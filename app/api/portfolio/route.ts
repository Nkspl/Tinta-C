import { apiError, database, json, requireApiAccount } from "@/lib/database";
import { runtimeBindings } from "@/lib/runtime";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const TYPES: Record<string, { extension: string; signatures: number[][] }> = {
  "image/jpeg": { extension: "jpg", signatures: [[0xff, 0xd8, 0xff]] },
  "image/png": { extension: "png", signatures: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]] },
  "image/webp": { extension: "webp", signatures: [[0x52, 0x49, 0x46, 0x46]] },
};

function hasValidSignature(bytes: Uint8Array, type: string): boolean {
  if (type === "image/webp") {
    return TYPES[type].signatures[0].every((value, index) => bytes[index] === value) && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return TYPES[type].signatures.some((signature) => signature.every((value, index) => bytes[index] === value));
}

export async function POST(request: Request) {
  try {
    const user = await requireApiAccount(request);
    if (!user) return apiError("Debes iniciar sesión.", 401);
    if (user.role !== "artist") return apiError("Activa el modo artista para publicar trabajos.", 403);
    const form = await request.formData();
    const title = String(form.get("title") || "").trim().slice(0, 100);
    const style = String(form.get("style") || "").trim().slice(0, 60);
    const image = form.get("image");
    if (!title || !style || !(image instanceof File)) return apiError("Completa el título, estilo y fotografía.");
    if (!TYPES[image.type]) return apiError("Usa una imagen JPG, PNG o WebP.");
    if (image.size < 1 || image.size > MAX_IMAGE_BYTES) return apiError("La imagen debe pesar menos de 8 MB.");
    const bytes = new Uint8Array(await image.arrayBuffer());
    if (!hasValidSignature(bytes, image.type)) return apiError("El archivo no parece ser una imagen válida.");

    const bucket = runtimeBindings().BUCKET;
    if (!bucket) return apiError("El almacenamiento de imágenes no está disponible.", 503);
    const id = crypto.randomUUID();
    const key = `portfolio/${user.id}/${id}.${TYPES[image.type].extension}`;
    await bucket.put(key, bytes, {
      httpMetadata: { contentType: image.type, cacheControl: "public, max-age=31536000, immutable" },
      customMetadata: { ownerId: user.id, portfolioId: id },
    });
    try {
      await database().prepare(`
        INSERT INTO portfolio_items (id, user_id, title, style, image_key, content_type, size_bytes, likes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
      `).bind(id, user.id, title, style, key, image.type, image.size, new Date().toISOString()).run();
    } catch (error) {
      await bucket.delete(key);
      throw error;
    }
    return json({ item: { id, title, style, image: `/api/images/${id}`, likes: 0 } }, { status: 201 });
  } catch (error) {
    console.error("portfolio:post", error);
    return apiError("No pudimos publicar la imagen.", 500);
  }
}
