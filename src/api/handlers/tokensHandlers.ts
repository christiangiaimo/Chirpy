import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../middlewares/auth.js";
import { getToken, updateRevokeToken } from "../db/queires/tokens.js";
import { config } from "../../config.js";
import { respondWithJson } from "./json.js";

export async function isTokenExpired(token: string) {
  const dbToken = await getToken(token);
  const now = new Date();
  const nowInMilliseconds = now.getTime();
  if (dbToken.revokedAt) {
    if (nowInMilliseconds > dbToken.revokedAt.getTime()) {
      return true;
    }
  } else return false;
}

export async function refreshJWTTokenHandler(req: Request, res: Response) {
  const token = getBearerToken(req);
  const dbToken = await getToken(token);
  const validateExpiration = await isTokenExpired(token);
  if (!dbToken || dbToken.revokedAt != null || validateExpiration) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const newJWT = makeJWT(dbToken.userId, 3600, config.secret);
  respondWithJson(res, 200, { token: newJWT });
}

export async function revokeTokenHandler(req: Request, res: Response) {
  const token = getBearerToken(req);
  const dbToken = await getToken(token);
  if (!dbToken) {
    throw new Error("Couldnt validate the token in the database");
  }
  updateRevokeToken(token);
  res.status(204).json({ message: "Succsesfully revoked token" });
}
