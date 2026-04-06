import { eq, ne } from "drizzle-orm";
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

export async function updateEmail(userId: string, newEmail: string) {
  const [result] = await db
    .update(users)
    .set({ email: newEmail })
    .where(eq(users.id, userId))
    .returning();
  return result;
}

export async function updatePassword(userId: string, newPassword: string) {
  const [result] = await db
    .update(users)
    .set({ hashedPassword: newPassword })
    .where(eq(users.id, userId))
    .returning();
  return result;
}

export async function updateUserInfo(
  userId: string,
  newEmail: string,
  newPassword: string,
) {
  const [result] = await db
    .update(users)
    .set({ email: newEmail, hashedPassword: newPassword })
    .where(eq(users.id, userId))
    .returning();
  return result;
}
