import { error } from "node:console";
import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { randomBytes } from "node:crypto";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
  try {
    const passwordHash = await argon2.hash(password);
    return passwordHash;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to hash password");
  }
}

export async function checkPasswordHash(
  password: string,
  hash1: string,
): Promise<Boolean> {
  try {
    if (await argon2.verify(hash1, password)) {
      console.log("verified password");
      return true;
    } else {
      console.log("failed to verify password");
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000);
  const payload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: iat,
    exp: iat + expiresIn,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  const decoded = jwt.verify(tokenString, secret);
  if (!decoded) {
    throw new Error("Unable to verify the user ID");
  } else if (decoded.sub && typeof decoded.sub === "string") {
    return decoded.sub;
  } else {
    throw new Error("Invalid user Id");
  }
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Error("Invalid bearer token found");
  }
  const token = authHeader.split(" ")[1];
  return token;
}

export function makeRefreshToken() {
  const token = randomBytes(32).toString("hex");
  return token;
}

export async function getAPIKey(req: Request) {
  const authHeader = req.get("Authorization") as string;
  const APIKey = authHeader.split(" ")[1];
  return APIKey;
}
