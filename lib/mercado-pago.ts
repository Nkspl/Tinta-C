import { runtimeBindings } from "./runtime";

type RuntimeEnv = {
  MP_ACCESS_TOKEN?: string;
  MP_WEBHOOK_SECRET?: string;
  MP_MODE?: string;
};

function runtimeEnv(): RuntimeEnv {
  return runtimeBindings();
}

export function mercadoPagoConfigured(): boolean {
  const env = runtimeEnv();
  return Boolean(env.MP_ACCESS_TOKEN && env.MP_WEBHOOK_SECRET);
}

export function mercadoPagoMode(): "sandbox" | "production" {
  return runtimeEnv().MP_MODE === "production" ? "production" : "sandbox";
}

export async function createCheckoutPreference(input: {
  bookingId: string;
  artistName: string;
  amount: number;
  payerEmail: string;
  origin: string;
}): Promise<{ id: string; checkoutUrl: string }> {
  const accessToken = runtimeEnv().MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Mercado Pago aún no tiene credenciales configuradas.");

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      "x-idempotency-key": `tinta-${input.bookingId}-${input.amount}`,
    },
    body: JSON.stringify({
      items: [{
        id: input.bookingId,
        title: `Anticipo reserva con ${input.artistName}`,
        description: "Anticipo de reserva en Tinta",
        currency_id: "CLP",
        quantity: 1,
        unit_price: input.amount,
      }],
      payer: { email: input.payerEmail },
      external_reference: input.bookingId,
      metadata: { booking_id: input.bookingId },
      statement_descriptor: "TINTA",
      payment_methods: { installments: 1 },
      back_urls: {
        success: `${input.origin}/payment/return?booking=${encodeURIComponent(input.bookingId)}&result=success`,
        pending: `${input.origin}/payment/return?booking=${encodeURIComponent(input.bookingId)}&result=pending`,
        failure: `${input.origin}/payment/return?booking=${encodeURIComponent(input.bookingId)}&result=failure`,
      },
      auto_return: "approved",
      notification_url: `${input.origin}/api/payments/webhook`,
    }),
  });

  const body = await response.json() as { id?: string; init_point?: string; sandbox_init_point?: string; message?: string };
  if (!response.ok || !body.id) throw new Error(body.message || "Mercado Pago rechazó la creación del cobro.");
  const checkoutUrl = mercadoPagoMode() === "production" ? body.init_point : (body.sandbox_init_point || body.init_point);
  if (!checkoutUrl) throw new Error("Mercado Pago no devolvió una URL de pago.");
  return { id: body.id, checkoutUrl };
}

export async function getMercadoPagoPayment(paymentId: string): Promise<Record<string, unknown>> {
  const accessToken = runtimeEnv().MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Mercado Pago aún no tiene credenciales configuradas.");
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  const body = await response.json() as Record<string, unknown> & { message?: string };
  if (!response.ok) throw new Error(body.message || "No se pudo verificar el pago.");
  return body;
}

export async function refundMercadoPagoPayment(paymentId: string, bookingId: string): Promise<void> {
  const accessToken = runtimeEnv().MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Mercado Pago aún no tiene credenciales configuradas.");
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}/refunds`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      "x-idempotency-key": `tinta-refund-${bookingId}`,
    },
    body: "{}",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message || "Mercado Pago no pudo devolver el anticipo.");
  }
}

export async function verifyMercadoPagoWebhook(request: Request, dataId: string): Promise<boolean> {
  const secret = runtimeEnv().MP_WEBHOOK_SECRET;
  if (!secret) return false;
  const signature = request.headers.get("x-signature") || "";
  const requestId = request.headers.get("x-request-id") || "";
  const parts = Object.fromEntries(signature.split(",").map((part) => part.trim().split("=", 2)));
  const ts = parts.ts;
  const received = parts.v1;
  if (!ts || !received || !requestId || !dataId) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(manifest));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (expected.length !== received.length) return false;
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) mismatch |= expected.charCodeAt(index) ^ received.charCodeAt(index);
  return mismatch === 0;
}
