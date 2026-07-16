import { apiError, database } from "@/lib/database";
import { runtimeBindings } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const row = await database().prepare("SELECT image_key, content_type FROM portfolio_items WHERE id = ? LIMIT 1").bind(id).first<{ image_key: string; content_type: string }>();
  if (!row) return apiError("Imagen no encontrada.", 404);
  const bucket = runtimeBindings().BUCKET;
  if (!bucket) return apiError("El almacenamiento no está disponible.", 503);
  const object = await bucket.get(row.image_key);
  if (!object) return apiError("Imagen no encontrada.", 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-type", row.content_type);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("etag", object.httpEtag);
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { headers });
}
