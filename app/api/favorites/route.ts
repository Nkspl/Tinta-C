import { apiError, database, json, requireApiAccount } from "@/lib/database";

async function artistIdFrom(request: Request): Promise<string | null> {
  const body = await request.json().catch(() => null) as { artistId?: unknown } | null;
  const value = body?.artistId;
  if ((typeof value !== "string" && typeof value !== "number") || !String(value).trim()) return null;
  return String(value).trim().slice(0, 80);
}

export async function PUT(request: Request) {
  try {
    const user = await requireApiAccount(request);
    if (!user) return apiError("Debes iniciar sesión.", 401);
    const artistId = await artistIdFrom(request);
    if (!artistId) return apiError("Artista inválido.");
    const db = database();
    const artist = await db.prepare("SELECT user_id FROM artist_profiles WHERE user_id = ? LIMIT 1").bind(artistId).first();
    if (!artist) return apiError("El artista ya no está disponible.", 404);
    if (artistId === user.id) return apiError("Tu propio perfil ya está siempre disponible en tu cuenta.");
    await db.prepare("INSERT OR IGNORE INTO favorites (user_id, artist_id, created_at) VALUES (?, ?, ?)").bind(user.id, artistId, new Date().toISOString()).run();
    return json({ ok: true });
  } catch (error) {
    console.error("favorites:put", error);
    return apiError(process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "No pudimos guardar el favorito.", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireApiAccount(request);
    if (!user) return apiError("Debes iniciar sesión.", 401);
    const artistId = await artistIdFrom(request);
    if (!artistId) return apiError("Artista inválido.");
    await database().prepare("DELETE FROM favorites WHERE user_id = ? AND artist_id = ?").bind(user.id, artistId).run();
    return json({ ok: true });
  } catch (error) {
    console.error("favorites:delete", error);
    return apiError(process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "No pudimos quitar el favorito.", 500);
  }
}
