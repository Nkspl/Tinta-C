import { apiError, database, json, requireApiAccount } from "@/lib/database";
import { refundMercadoPagoPayment } from "@/lib/mercado-pago";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiAccount(request);
    if (!user) return apiError("Debes iniciar sesión.", 401);
    const { id } = await context.params;
    const body = await request.json().catch(() => null) as { decision?: string } | null;
    if (!body || !["accept", "reject"].includes(body.decision || "")) return apiError("Decisión inválida.");
    const db = database();
    const booking = await db.prepare("SELECT status, payment_status, payment_id FROM bookings WHERE id = ? AND artist_user_id = ? LIMIT 1")
      .bind(id, user.id).first<{ status: string; payment_status: string; payment_id: string | null }>();
    if (!booking) return apiError("Reserva no encontrada.", 404);
    if (booking.status !== "En revisión" || booking.payment_status !== "approved") return apiError("La reserva debe tener un anticipo aprobado y estar en revisión.", 409);

    const now = new Date().toISOString();
    if (body.decision === "reject") {
      if (!booking.payment_id) return apiError("La reserva no tiene un pago verificable.", 409);
      await refundMercadoPagoPayment(booking.payment_id, id);
      await db.prepare("UPDATE bookings SET status = 'Reembolsada', payment_status = 'refunded', updated_at = ? WHERE id = ? AND artist_user_id = ?")
        .bind(now, id, user.id).run();
      return json({ status: "Reembolsada" });
    }

    const status = "Confirmada";
    const result = await db.prepare("UPDATE bookings SET status = ?, updated_at = ? WHERE id = ? AND artist_user_id = ? AND status = 'En revisión' AND payment_status = 'approved'")
      .bind(status, now, id, user.id).run();
    if (!result.meta.changes) return apiError("La reserva cambió de estado. Actualiza la página.", 409);
    return json({ status });
  } catch (error) {
    console.error("bookings:decision", error);
    return apiError(error instanceof Error ? error.message : "No pudimos actualizar la reserva.", 503);
  }
}
