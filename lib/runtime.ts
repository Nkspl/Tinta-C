export type TintaRuntimeBindings = {
  DB?: D1Database;
  BUCKET?: R2Bucket;
  MP_ACCESS_TOKEN?: string;
  MP_WEBHOOK_SECRET?: string;
  MP_MODE?: string;
};

export function runtimeBindings(): TintaRuntimeBindings {
  return (globalThis as typeof globalThis & { __TINTA_RUNTIME_ENV__?: TintaRuntimeBindings }).__TINTA_RUNTIME_ENV__ ?? {};
}
