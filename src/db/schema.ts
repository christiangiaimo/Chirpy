import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { time } from "node:console";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").notNull().default("unset"),
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: varchar("body").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
});

export const refreshTokens = pgTable("refresh_tokens", {
  token: varchar("token").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  revokedAt: timestamp("revoked_at"),
});

export type newUser = typeof users.$inferInsert;
export type getUser = typeof users.$inferSelect;
export type newChirp = typeof chirps.$inferInsert;
export type getChirp = typeof chirps.$inferSelect;
export type GetToken = typeof refreshTokens.$inferSelect;
export type NewToken = typeof refreshTokens.$inferInsert;
