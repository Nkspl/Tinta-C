import { apiError, database, json, requireApiAccount } from "@/lib/database";
import { mercadoPagoConfigured, mercadoPagoMode } from "@/lib/mercado-pago";

export const dynamic = "force-dynamic";

const ALLOWED_STYLES = ["Fine line", "Blackwork", "Realismo", "Neo tradicional", "Botánico", "Geométrico", "Color", "Black & grey", "Minimalista"];

type ArtistProfileInput = {
  studio?: unknown;
  bio?: unknown;
  styles?: unknown;
  priceFrom?: unknown;
};

function cleanText(value: unknown, fallback: string, max: number): string {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

function bookingFromRow(row: Record<string, unknown>, currentUserId: string) {
  return {
    id: String(row.id),
    artistId: String(row.artist_id),
    artist: String(row.artist_name),
    studio: String(row.studio),
    style: `${String(row.style)} · ${String(row.placement)}`,
    placement: String(row.placement),
    size: String(row.size),
    date: String(row.preferred_date),
    time: String(row.preferred_time),
    status: String(row.status),
    price: Number(row.price),
    depositAmount: Number(row.deposit_amount),
    paymentStatus: String(row.payment_status),
    checkoutUrl: row.checkout_url ? String(row.checkout_url) : null,
    perspective: String(row.artist_user_id || "") === currentUserId ? "artist" : "client",
    client: row.client_name ? String(row.client_name) : "Cliente Tinta",
    notes: String(row.notes || ""),
  };
}

export async function GET(request: Request) {
  try {
    const user = await requireApiAccount(request);
    if (!user) return apiError("Debes iniciar sesión.", 401);
    const db = database();
    const [favoriteRows, bookingRows, portfolioRows, conversationRows, artistProfile] = await Promise.all([
      db.prepare("SELECT artist_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC").bind(user.id).all<{ artist_id: string }>(),
      db.prepare("SELECT b.*, client.display_name AS client_name FROM bookings b LEFT JOIN users client ON client.id = b.client_user_id WHERE b.client_user_id = ? OR b.artist_user_id = ? ORDER BY b.created_at DESC").bind(user.id, user.id).all(),
      db.prepare("SELECT id, title, style, likes, created_at FROM portfolio_items WHERE user_id = ? ORDER BY created_at DESC").bind(user.id).all(),
      db.prepare("SELECT c.*, client.display_name AS client_name FROM conversations c LEFT JOIN users client ON client.id = c.client_user_id WHERE c.client_user_id = ? OR c.artist_user_id = ? ORDER BY c.updated_at DESC").bind(user.id, user.id).all(),
      db.prepare("SELECT handle, studio, bio, styles, price_from, verified FROM artist_profiles WHERE user_id = ? LIMIT 1").bind(user.id).first(),
    ]);

    const conversations = await Promise.all(conversationRows.results.map(async (row) => {
      const messages = await db.prepare("SELECT id, sender_user_id, body, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 200").bind(String(row.id)).all();
      return {
        id: String(row.id),
        person: String(row.artist_user_id || "") === user.id ? String(row.client_name || "Cliente Tinta") : String(row.artist_name),
        role: String(row.studio),
        avatar: "",
        unread: 0,
        messages: messages.results.map((message) => ({
          id: String(message.id),
          from: String(message.sender_user_id) === user.id ? "me" : "them",
          text: String(message.body),
          time: new Intl.DateTimeFormat("es-CL", { hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago" }).format(new Date(String(message.created_at))),
        })),
      };
    }));

    return json({
      user: {
        ...user,
        artistProfile: artistProfile ? {
          handle: String(artistProfile.handle),
          studio: String(artistProfile.studio),
          bio: String(artistProfile.bio),
          styles: JSON.parse(String(artistProfile.styles || "[]")),
          priceFrom: Number(artistProfile.price_from),
          verified: Boolean(artistProfile.verified),
        } : null,
      },
      favorites: favoriteRows.results.map((row) => String(row.artist_id)),
      bookings: bookingRows.results.map((row) => bookingFromRow(row as Record<string, unknown>, user.id)),
      portfolio: portfolioRows.results.map((row) => ({
        id: String(row.id), title: String(row.title), style: String(row.style), likes: Number(row.likes), image: `/api/images/${String(row.id)}`,
      })),
      conversations,
      payments: { configured: mercadoPagoConfigured(), mode: mercadoPagoMode() },
    });
  } catch (error) {
    console.error("account:get", error);
    return apiError("No pudimos cargar tu cuenta.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireApiAccount(request);
    if (!user) return apiError("Debes iniciar sesión.", 401);
    const body = await request.json() as { role?: string; city?: string; displayName?: string; artistProfile?: ArtistProfileInput };
    const role = body.role === "artist" ? "artist" : body.role === "client" ? "client" : user.role;
    const city = typeof body.city === "string" && body.city.trim() ? body.city.trim().slice(0, 80) : user.city;
    const displayName = typeof body.displayName === "string" && body.displayName.trim() ? body.displayName.trim().slice(0, 80) : user.displayName;
    const now = new Date().toISOString();
    const db = database();
    await db.prepare("UPDATE users SET role = ?, city = ?, display_name = ?, updated_at = ? WHERE id = ?").bind(role, city, displayName, now, user.id).run();
    if (role === "artist") {
      const handleBase = user.email.split("@")[0].replace(/[^a-z0-9]+/gi, ".").replace(/^\.|\.$/g, "").toLowerCase() || "artista";
      await db.prepare(`
        INSERT OR IGNORE INTO artist_profiles (user_id, handle, studio, bio, styles, price_from, verified, created_at, updated_at)
        VALUES (?, ?, 'Estudio independiente', '', '["Fine line"]', 60000, 0, ?, ?)
      `).bind(user.id, `@${handleBase}.${user.id.slice(0, 5)}`, now, now).run();

      if (body.artistProfile) {
        const current = await db.prepare("SELECT studio, bio, styles, price_from FROM artist_profiles WHERE user_id = ? LIMIT 1").bind(user.id).first<{ studio: string; bio: string; styles: string; price_from: number }>();
        if (!current) return apiError("No pudimos preparar tu perfil profesional.", 500);
        const studio = cleanText(body.artistProfile.studio, current.studio, 100);
        const bio = typeof body.artistProfile.bio === "string" ? body.artistProfile.bio.trim().slice(0, 600) : current.bio;
        const requestedStyles: unknown[] = Array.isArray(body.artistProfile.styles) ? body.artistProfile.styles : JSON.parse(current.styles || "[]") as unknown[];
        const styles = [...new Set(requestedStyles.filter((item): item is string => typeof item === "string" && ALLOWED_STYLES.includes(item)))].slice(0, 5);
        const numericPrice = Number(body.artistProfile.priceFrom);
        const priceFrom = Number.isFinite(numericPrice) ? Math.min(2_000_000, Math.max(30_000, Math.round(numericPrice))) : Number(current.price_from);
        await db.prepare("UPDATE artist_profiles SET studio = ?, bio = ?, styles = ?, price_from = ?, updated_at = ? WHERE user_id = ?")
          .bind(studio, bio, JSON.stringify(styles.length ? styles : ["Fine line"]), priceFrom, now, user.id).run();
      }
    }
    const savedProfile = role === "artist" ? await db.prepare("SELECT handle, studio, bio, styles, price_from, verified FROM artist_profiles WHERE user_id = ? LIMIT 1").bind(user.id).first() : null;
    return json({ user: {
      ...user,
      role,
      city,
      displayName,
      artistProfile: savedProfile ? {
        handle: String(savedProfile.handle), studio: String(savedProfile.studio), bio: String(savedProfile.bio),
        styles: JSON.parse(String(savedProfile.styles || "[]")), priceFrom: Number(savedProfile.price_from), verified: Boolean(savedProfile.verified),
      } : null,
    } });
  } catch (error) {
    console.error("account:patch", error);
    return apiError("No pudimos guardar la configuración.", 500);
  }
}
