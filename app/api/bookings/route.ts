import { bookingPrice, depositFor } from "@/lib/catalog";
import { apiError, database, json, requireApiAccount } from "@/lib/database";

type BookingInput = {
  artistId?: unknown;
  style?: unknown;
  placement?: unknown;
  size?: unknown;
  date?: unknown;
  time?: unknown;
  notes?: unknown;
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const user = await requireApiAccount(request);
    if (!user) return apiError("Debes iniciar sesión.", 401);
    const body = await request.json() as BookingInput;
    const artistId = clean(body.artistId, 80);
    const style = clean(body.style, 80);
    const placement = clean(body.placement, 80);
    const size = clean(body.size, 30);
    const date = clean(body.date, 10);
    const time = clean(body.time, 5);
    const notes = clean(body.notes, 400);
    if (!artistId || !style || !placement || !["Pequeño", "Mediano", "Grande"].includes(size) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      const detail = process.env.NODE_ENV !== "production" ? ` (artista:${Boolean(artistId)}, estilo:${Boolean(style)}, zona:${Boolean(placement)}, tamaño:${size || "vacío"}, fecha:${date || "vacía"}, hora:${time || "vacía"})` : "";
      return apiError(`Revisa los datos de la reserva.${detail}`);
    }
    const requestedDate = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(requestedDate.valueOf()) || requestedDate.toISOString().slice(0, 10) !== date || requestedDate <= new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z")) return apiError("La fecha debe ser posterior a hoy.");

    const db = database();
    const dynamic = await db.prepare(`
      SELECT u.id, u.display_name, u.city, p.studio, p.price_from, p.styles FROM artist_profiles p JOIN users u ON u.id = p.user_id WHERE u.id = ? LIMIT 1
    `).bind(artistId).first<{ id: string; display_name: string; city: string; studio: string; price_from: number; styles: string }>();
    if (!dynamic) return apiError("El artista ya no está disponible.", 404);
    if (dynamic.id === user.id) return apiError("No puedes reservar contigo mismo.");
    const artistStyles = JSON.parse(dynamic.styles || "[]") as string[];
    if (!artistStyles.includes(style)) return apiError("Selecciona uno de los estilos publicados por el artista.");

    const artistName = dynamic.display_name;
    const studio = dynamic.studio;
    const basePrice = Number(dynamic.price_from);
    const price = bookingPrice(basePrice, size);
    const depositAmount = depositFor(price);
    const bookingId = crypto.randomUUID();
    const conversationId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.batch([
      db.prepare(`
        INSERT INTO bookings (id, client_user_id, artist_user_id, artist_id, artist_name, studio, style, placement, size, preferred_date, preferred_time, notes, status, price, deposit_amount, payment_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Esperando anticipo', ?, ?, 'not_started', ?, ?)
      `).bind(bookingId, user.id, dynamic.id, artistId, artistName, studio, style, placement, size, date, time, notes, price, depositAmount, now, now),
      db.prepare(`
        INSERT INTO conversations (id, booking_id, client_user_id, artist_user_id, artist_name, studio, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(conversationId, bookingId, user.id, dynamic.id, artistName, studio, now, now),
      db.prepare("INSERT INTO messages (id, conversation_id, sender_user_id, body, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind(crypto.randomUUID(), conversationId, user.id, notes || `Hola, quiero cotizar una pieza ${style.toLowerCase()} en ${placement.toLowerCase()}.`, now),
    ]);
    return json({ booking: {
      id: bookingId, artistId, artist: artistName, studio, style: `${style} · ${placement}`, placement, size, date, time,
      status: "Esperando anticipo", price, depositAmount, paymentStatus: "not_started", checkoutUrl: null,
    } }, { status: 201 });
  } catch (error) {
    console.error("bookings:post", error);
    return apiError("No pudimos crear la reserva.", 500);
  }
}
