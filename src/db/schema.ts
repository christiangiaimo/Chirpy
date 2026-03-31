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

export type newUser = typeof users.$inferInsert;
export type newChirp = typeof chirps.$inferInsert;
export type getChirp = typeof chirps.$inferSelect;
