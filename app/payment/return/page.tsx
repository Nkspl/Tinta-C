import Link from "next/link";
import { Check, Clock3, X } from "lucide-react";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { database, getOrCreateUser } from "@/lib/database";

export const dynamic = "force-dynamic";

export default async function PaymentReturn({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const { booking: bookingId } = await searchParams;
  const identity = await requireChatGPTUser(bookingId ? `/payment/return?booking=${encodeURIComponent(bookingId)}` : "/payment/return");
  const user = await getOrCreateUser(identity);
  const booking = bookingId ? await database().prepare("SELECT payment_status FROM bookings WHERE id = ? AND client_user_id = ? LIMIT 1")
    .bind(bookingId, user.id).first<{ payment_status: string }>() : null;
  const state = booking?.payment_status === "approved" ? "success" : ["pending", "not_started"].includes(booking?.payment_status || "") ? "pending" : "failure";
  const copy = {
    success: { icon: Check, title: "Pago verificado", text: "Mercado Pago confirmó el anticipo y la reserva quedó en revisión del artista." },
    pending: { icon: Clock3, title: "Confirmación en proceso", text: "Aún esperamos la confirmación firmada de Mercado Pago. Puedes volver a tus reservas y actualizar en unos instantes." },
    failure: { icon: X, title: booking?.payment_status === "refunded" ? "Anticipo reembolsado" : "Pago no confirmado", text: booking?.payment_status === "refunded" ? "Mercado Pago registró la devolución del anticipo." : "No existe un cobro aprobado para esta reserva. Puedes volver e intentarlo nuevamente." },
  }[state];
  const Icon = copy.icon;
  return (
    <main className="payment-return-shell">
      <section className={`payment-return-card payment-${state}`}>
        <span className="payment-return-icon"><Icon size={28} /></span>
        <span className="eyebrow">Mercado Pago · Tinta</span>
        <h1>{copy.title}</h1>
        <p>{copy.text}</p>
        <Link className="button button-primary button-large" href="/">Volver a mis reservas</Link>
        <small>El estado definitivo siempre se verifica directamente con Mercado Pago.</small>
      </section>
    </main>
  );
}
