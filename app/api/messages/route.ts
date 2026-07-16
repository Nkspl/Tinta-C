import { apiError, database, json, requireApiAccount } from "@/lib/database";

export async function POST(request: Request) {
  const user = await requireApiAccount(request);
  if (!user) return apiError("Debes iniciar sesión.", 401);
  const body = await request.json().catch(() => null) as { conversationId?: string; text?: string } | null;
  const conversationId = body?.conversationId?.trim();
  const text = body?.text?.trim().slice(0, 1000);
  if (!conversationId || !text) return apiError("Escribe un mensaje.");
  const db = database();
  const conversation = await db.prepare("SELECT id FROM conversations WHERE id = ? AND (client_user_id = ? OR artist_user_id = ?) LIMIT 1").bind(conversationId, user.id, user.id).first();
  if (!conversation) return apiError("Conversación no encontrada.", 404);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("INSERT INTO messages (id, conversation_id, sender_user_id, body, created_at) VALUES (?, ?, ?, ?, ?)").bind(id, conversationId, user.id, text, now),
    db.prepare("UPDATE conversations SET updated_at = ? WHERE id = ?").bind(now, conversationId),
  ]);
  return json({ message: { id, from: "me", text, time: "Ahora" } }, { status: 201 });
}
