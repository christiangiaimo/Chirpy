import { date } from "drizzle-orm/mysql-core/index.js";
import { db } from "../../../db/index.js";
import {
  GetToken,
  NewToken,
  refreshTokens,
  users,
} from "../../../db/schema.js";
import { eq } from "drizzle-orm";

export async function insertToken(token: NewToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(token)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return result;
}

export async function updateRevokeToken(token: string) {
  const [result] = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token));
  return result;
}
