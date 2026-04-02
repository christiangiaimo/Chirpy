import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { newUser, users } from "../../../db/schema.js";

export async function createUser(user: newUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}
