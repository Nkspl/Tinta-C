import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role", { enum: ["client", "artist"] }).notNull().default("client"),
  city: text("city").notNull().default("Santiago"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("users_email_unique").on(table.email)]);

export const artistProfiles = sqliteTable("artist_profiles", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  handle: text("handle").notNull(),
  studio: text("studio").notNull().default("Estudio independiente"),
  bio: text("bio").notNull().default(""),
  styles: text("styles").notNull().default("[]"),
  priceFrom: integer("price_from").notNull().default(60000),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("artist_profiles_handle_unique").on(table.handle)]);

export const favorites = sqliteTable("favorites", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  artistId: text("artist_id").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.artistId] }),
  index("favorites_user_idx").on(table.userId),
]);

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  clientUserId: text("client_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  artistUserId: text("artist_user_id").references(() => users.id, { onDelete: "set null" }),
  artistId: text("artist_id").notNull(),
  artistName: text("artist_name").notNull(),
  studio: text("studio").notNull(),
  style: text("style").notNull(),
  placement: text("placement").notNull(),
  size: text("size").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("En revisión"),
  price: integer("price").notNull(),
  depositAmount: integer("deposit_amount").notNull(),
  paymentStatus: text("payment_status").notNull().default("not_started"),
  preferenceId: text("preference_id"),
  paymentId: text("payment_id"),
  checkoutUrl: text("checkout_url"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("bookings_client_idx").on(table.clientUserId),
  index("bookings_artist_idx").on(table.artistUserId),
  index("bookings_preference_idx").on(table.preferenceId),
]);

export const portfolioItems = sqliteTable("portfolio_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  style: text("style").notNull(),
  imageKey: text("image_key").notNull(),
  contentType: text("content_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: text("created_at").notNull(),
}, (table) => [index("portfolio_user_idx").on(table.userId)]);

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").references(() => bookings.id, { onDelete: "set null" }),
  clientUserId: text("client_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  artistUserId: text("artist_user_id").references(() => users.id, { onDelete: "cascade" }),
  artistName: text("artist_name").notNull(),
  studio: text("studio").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("conversations_client_idx").on(table.clientUserId),
  index("conversations_artist_idx").on(table.artistUserId),
]);

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderUserId: text("sender_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [index("messages_conversation_idx").on(table.conversationId, table.createdAt)]);

export const paymentEvents = sqliteTable("payment_events", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").references(() => bookings.id, { onDelete: "set null" }),
  providerPaymentId: text("provider_payment_id"),
  eventType: text("event_type").notNull(),
  status: text("status").notNull(),
  payload: text("payload").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("payment_events_provider_id_unique").on(table.providerPaymentId, table.eventType, table.status),
  index("payment_events_booking_idx").on(table.bookingId),
]);
