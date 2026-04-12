import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { chirps, newChirp } from "../../../db/schema.js";

export async function createChirp(chirp: newChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps() {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return result;
}

export async function getChirp(chirpId: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  return result;
}

export async function deleteChirp(chirpId: string) {
  await db.delete(chirps).where(eq(chirps.id, chirpId));
  console.log(`Succesfully removed chrirp ${chirpId}`);
}

export async function getChirpsByUserId(id: string) {
  const result = await db.select().from(chirps).where(eq(chirps.userId, id));
  return result;
}

export async function getChripsSorted(sort: string) {
  if (sort === "asc") {
    return await getChirps();
  } else {
    const result = await db
      .select()
      .from(chirps)
      .orderBy(desc(chirps.createdAt));
    return result;
  }
}
