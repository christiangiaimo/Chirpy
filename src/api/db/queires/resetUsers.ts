import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";

export async function resetUsersTable() {
  const [result] = await db.delete(users);
  return result;
}
