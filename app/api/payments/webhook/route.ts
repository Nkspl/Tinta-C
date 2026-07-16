import { apiError, ensureDatabase, json } from "@/lib/database";
import { getMercadoPagoPayment, verifyMercadoPagoWebhook } from "@/lib/mercado-pago";

function normalizedPaymentStatus(status: string): string {
  if (["approved", "authorized"].includes(status)) return "approved";
  if (["pending", "in_process", "in_mediation"].includes(status)) return "pending";
  if (["refunded", "charged_back"].includes(status)) return "refunded";
  return "rejected";
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const queryId = url.searchParams.get("data.id") || url.searchParams.get("id") || "";
    const body = await request.json().catch(() => ({})) as { data?: { id?: string | number }; type?: string; action?: string };
    const paymentId = String(queryId || body.data?.id || "");
    if (!paymentId) return apiError("Notificación inválida.");
    if (!(await verifyMercadoPagoWebhook(request, paymentId))) return apiError("Firma inválida.", 401);
    if (body.type && body.type !== "payment") return json({ received: true });

    const payment = await getMercadoPagoPayment(paymentId);
    const bookingId = String(payment.external_reference || "");
    const status = normalizedPaymentStatus(String(payment.status || ""));
    const amount = Number(payment.transaction_amount || 0);
    const currency = String(payment.currency_id || "");
    if (!bookingId) return apiError("Pago sin reserva asociada.", 422);
    const db = await ensureDatabase();
    const booking = await db.prepare("SELECT deposit_amount FROM bookings WHERE id = ? LIMIT 1").bind(bookingId).first<{ deposit_amount: number }>();
    if (!booking) return apiError("Reserva no encontrada.", 404);
    const verifiedStatus = amount === Number(booking.deposit_amount) && currency === "CLP" ? status : "rejected";
    const nextBookingStatus = verifiedStatus === "approved" ? "En revisión" : verifiedStatus === "refunded" ? "Reembolsada" : null;
    const now = new Date().toISOString();
    const eventPayload = JSON.stringify({ id: payment.id, status: payment.status, amount, currency, external_reference: bookingId });
    const eventType = body.action || body.type || "payment";
    await db.batch([
      db.prepare(`
        INSERT OR IGNORE INTO payment_events (id, booking_id, provider_payment_id, event_type, status, payload, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(crypto.randomUUID(), bookingId, paymentId, eventType, verifiedStatus, eventPayload, now),
      db.prepare(`
        UPDATE bookings SET payment_id = ?, payment_status = ?, status = COALESCE(?, status), updated_at = ? WHERE id = ?
      `).bind(paymentId, verifiedStatus, nextBookingStatus, now, bookingId),
    ]);
    return json({ received: true });
  } catch (error) {
    console.error("payments:webhook", error);
    return apiError("No pudimos procesar la notificación.", 500);
  }
}
