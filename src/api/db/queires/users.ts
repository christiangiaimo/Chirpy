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
