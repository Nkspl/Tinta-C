import { apiError, ensureDatabase, json } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await ensureDatabase();
    const rows = await db.prepare(`
      SELECT u.id, u.display_name, u.city, p.handle, p.studio, p.bio, p.styles, p.price_from, p.verified,
             (SELECT id FROM portfolio_items WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) AS cover_id,
             (SELECT COUNT(*) FROM portfolio_items WHERE user_id = u.id) AS work_count
      FROM artist_profiles p JOIN users u ON u.id = p.user_id
      ORDER BY p.verified DESC, p.updated_at DESC LIMIT 100
    `).all();
    return json({ artists: rows.results.map((row) => ({
      id: String(row.id),
      name: String(row.display_name),
      handle: String(row.handle),
      studio: String(row.studio),
      city: String(row.city),
      bio: String(row.bio),
      styles: JSON.parse(String(row.styles || "[]")),
      priceFrom: Number(row.price_from),
      verified: Boolean(row.verified),
      cover: row.cover_id ? `/api/images/${String(row.cover_id)}` : null,
      workCount: Number(row.work_count),
    })) });
  } catch (error) {
    console.error("artists:get", error);
    return apiError("No pudimos cargar los artistas.", 500);
  }
}
