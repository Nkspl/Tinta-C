import { apiUser, type AuthenticatedUser } from "./auth";
import { runtimeBindings } from "./runtime";

export type StoredUser = {
  id: string;
  email: string;
  displayName: string;
  role: "client" | "artist";
  city: string;
};

export function database(): D1Database {
  const binding = runtimeBindings().DB;
  if (!binding) throw new Error("La base de datos no está disponible.");
  return binding;
}

let schemaInitialization: Promise<void> | null = null;

export async function ensureDatabase(): Promise<D1Database> {
  const db = database();
  if (!schemaInitialization) {
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL, display_name TEXT NOT NULL, role TEXT DEFAULT 'client' NOT NULL, city TEXT DEFAULT 'Santiago' NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
      `CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email)`,
      `CREATE TABLE IF NOT EXISTS artist_profiles (user_id TEXT PRIMARY KEY NOT NULL, handle TEXT NOT NULL, studio TEXT DEFAULT 'Estudio independiente' NOT NULL, bio TEXT DEFAULT '' NOT NULL, styles TEXT DEFAULT '[]' NOT NULL, price_from INTEGER DEFAULT 60000 NOT NULL, verified INTEGER DEFAULT 0 NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`,
      `CREATE UNIQUE INDEX IF NOT EXISTS artist_profiles_handle_unique ON artist_profiles (handle)`,
      `CREATE TABLE IF NOT EXISTS favorites (user_id TEXT NOT NULL, artist_id TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY (user_id, artist_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`,
      `CREATE INDEX IF NOT EXISTS favorites_user_idx ON favorites (user_id)`,
      `CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY NOT NULL, client_user_id TEXT NOT NULL, artist_user_id TEXT, artist_id TEXT NOT NULL, artist_name TEXT NOT NULL, studio TEXT NOT NULL, style TEXT NOT NULL, placement TEXT NOT NULL, size TEXT NOT NULL, preferred_date TEXT NOT NULL, preferred_time TEXT NOT NULL, notes TEXT DEFAULT '' NOT NULL, status TEXT DEFAULT 'En revisión' NOT NULL, price INTEGER NOT NULL, deposit_amount INTEGER NOT NULL, payment_status TEXT DEFAULT 'not_started' NOT NULL, preference_id TEXT, payment_id TEXT, checkout_url TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY (client_user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (artist_user_id) REFERENCES users(id) ON DELETE SET NULL)`,
      `CREATE INDEX IF NOT EXISTS bookings_client_idx ON bookings (client_user_id)`,
      `CREATE INDEX IF NOT EXISTS bookings_artist_idx ON bookings (artist_user_id)`,
      `CREATE INDEX IF NOT EXISTS bookings_preference_idx ON bookings (preference_id)`,
      `CREATE TABLE IF NOT EXISTS portfolio_items (id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, title TEXT NOT NULL, style TEXT NOT NULL, image_key TEXT NOT NULL, content_type TEXT NOT NULL, size_bytes INTEGER NOT NULL, likes INTEGER DEFAULT 0 NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`,
      `CREATE INDEX IF NOT EXISTS portfolio_user_idx ON portfolio_items (user_id)`,
      `CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY NOT NULL, booking_id TEXT, client_user_id TEXT NOT NULL, artist_user_id TEXT, artist_name TEXT NOT NULL, studio TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL, FOREIGN KEY (client_user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (artist_user_id) REFERENCES users(id) ON DELETE CASCADE)`,
      `CREATE INDEX IF NOT EXISTS conversations_client_idx ON conversations (client_user_id)`,
      `CREATE INDEX IF NOT EXISTS conversations_artist_idx ON conversations (artist_user_id)`,
      `CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY NOT NULL, conversation_id TEXT NOT NULL, sender_user_id TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE, FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE)`,
      `CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages (conversation_id, created_at)`,
      `CREATE TABLE IF NOT EXISTS payment_events (id TEXT PRIMARY KEY NOT NULL, booking_id TEXT, provider_payment_id TEXT, event_type TEXT NOT NULL, status TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL)`,
      `CREATE UNIQUE INDEX IF NOT EXISTS payment_events_provider_id_unique ON payment_events (provider_payment_id, event_type, status)`,
      `CREATE INDEX IF NOT EXISTS payment_events_booking_idx ON payment_events (booking_id)`,
    ];
    schemaInitialization = db.batch(statements.map((statement) => db.prepare(statement))).then(() => undefined).catch((error) => {
      schemaInitialization = null;
      throw error;
    });
  }
  await schemaInitialization;
  return db;
}

export async function getOrCreateUser(identity: AuthenticatedUser): Promise<StoredUser> {
  const db = await ensureDatabase();
  const now = new Date().toISOString();
  await db.prepare(`
    INSERT OR IGNORE INTO users (id, email, display_name, role, city, created_at, updated_at)
    VALUES (?, ?, ?, 'client', 'Santiago', ?, ?)
  `).bind(crypto.randomUUID(), identity.email, identity.displayName, now, now).run();
  const row = await db.prepare(`
    SELECT id, email, display_name, role, city FROM users WHERE email = ? LIMIT 1
  `).bind(identity.email).first<{ id: string; email: string; display_name: string; role: "client" | "artist"; city: string }>();
  if (!row) throw new Error("No se pudo crear la cuenta.");
  return { id: row.id, email: row.email, displayName: row.display_name, role: row.role, city: row.city };
}

export async function requireApiAccount(request: Request): Promise<StoredUser | null> {
  const identity = apiUser(request);
  return identity ? getOrCreateUser(identity) : null;
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function apiError(message: string, status = 400): Response {
  return json({ error: message }, { status });
}
