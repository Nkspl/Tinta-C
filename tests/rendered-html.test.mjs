import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const workerPromise = import(workerUrl.href).then((module) => module.default);

const testEnv = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const testContext = { waitUntil() {}, passThroughOnException() {} };

test("renders development preview metadata", async () => {
  const worker = await workerPromise;

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    testEnv,
    testContext,
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(html, /Iniciar sesión con ChatGPT/i);
  assert.doesNotMatch(html, /Artistas recomendados para ti/i);
});

test("protects user data endpoints without authentication", async () => {
  const worker = await workerPromise;
  const response = await worker.fetch(new Request("http://localhost/api/favorites", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ artistId: "1" }),
  }), testEnv, testContext);
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Debes iniciar sesión." });
});

test("rejects every anonymous account mutation", async () => {
  const worker = await workerPromise;
  const attempts = [
    ["/api/account", "PATCH", { role: "artist" }],
    ["/api/bookings", "POST", { artistId: "someone" }],
    ["/api/bookings/test/checkout", "POST", null],
    ["/api/bookings/test/decision", "POST", { decision: "accept" }],
    ["/api/messages", "POST", { conversationId: "test", text: "hola" }],
    ["/api/portfolio", "POST", null],
  ];
  for (const [path, method, body] of attempts) {
    const response = await worker.fetch(new Request(`http://localhost${path}`, {
      method,
      ...(body ? { headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : {}),
    }), testEnv, testContext);
    assert.equal(response.status, 401, `${method} ${path}`);
    assert.deepEqual(await response.json(), { error: "Debes iniciar sesión." });
  }
});

test("rejects unsigned Mercado Pago webhooks", async () => {
  const worker = await workerPromise;
  const response = await worker.fetch(new Request("http://localhost/api/payments/webhook?data.id=123", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "payment", data: { id: "123" } }),
  }), testEnv, testContext);
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Firma inválida." });
});

test("rejects malformed Mercado Pago notifications", async () => {
  const worker = await workerPromise;
  const response = await worker.fetch(new Request("http://localhost/api/payments/webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "payment" }),
  }), testEnv, testContext);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Notificación inválida." });
});
