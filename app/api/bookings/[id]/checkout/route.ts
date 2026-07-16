import { apiError, database, json, requireApiAccount } from "@/lib/database";
import { createCheckoutPreference } from "@/lib/mercado-pago";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiAccount(request);
    if (!user) return apiError("Debes iniciar sesión.", 401);
    const { id } = await context.params;
    const db = database();
    const booking = await db.prepare(`
      SELECT id, artist_name, deposit_amount, payment_status, checkout_url, status FROM bookings WHERE id = ? AND client_user_id = ? LIMIT 1
    `).bind(id, user.id).first<{ id: string; artist_name: string; deposit_amount: number; payment_status: string; checkout_url: string | null; status: string }>();
    if (!booking) return apiError("Reserva no encontrada.", 404);
    if (booking.payment_status === "approved") return apiError("Esta reserva ya está pagada.", 409);
    if (["Rechazada", "Reembolsada", "Completada"].includes(booking.status)) return apiError("Esta reserva ya no admite pagos.", 409);
    if (booking.payment_status === "pending" && booking.checkout_url) return json({ checkoutUrl: booking.checkout_url });

    const origin = new URL(request.url).origin;
    const preference = await createCheckoutPreference({
      bookingId: booking.id,
      artistName: booking.artist_name,
      amount: Number(booking.deposit_amount),
      payerEmail: user.email,
      origin,
    });
    await db.prepare(`
      UPDATE bookings SET preference_id = ?, checkout_url = ?, payment_status = 'pending', updated_at = ? WHERE id = ? AND client_user_id = ?
    `).bind(preference.id, preference.checkoutUrl, new Date().toISOString(), booking.id, user.id).run();
    return json({ checkoutUrl: preference.checkoutUrl });
  } catch (error) {
    console.error("checkout:post", error);
    return apiError(error instanceof Error ? error.message : "No pudimos iniciar el pago.", 503);
  }
}
