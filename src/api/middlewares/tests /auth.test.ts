import { describe, it, expect, beforeAll } from "vitest";
import {
  checkPasswordHash,
  getBearerToken,
  hashPassword,
  makeJWT,
  validateJWT,
} from "../auth";

import { createRequest } from "node-mocks-http";

describe("Password Hashing", () => {
  const password1 = "correctPassword123";
  const password2 = "correctPassword456";

  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password2, hash2);
    expect(result).toBe(true);
  });
});

describe("JWT validation", () => {
  const user1 = { userID: "123", expiresIn: 300, secret: "secret" };
  const user2 = { userID: "jkcjth", expiresIn: 120, secret: "hello" };

  let JWT1: string;
  let JWT2: string;

  beforeAll(async () => {
    JWT1 = makeJWT(user1.userID, user1.expiresIn, user1.secret);
    JWT2 = makeJWT(user2.userID, user2.expiresIn, user2.secret);
  });

  it("should validate the JWT token and return the user secret", async () => {
    const result = validateJWT(JWT1, user1.secret);
    expect(result).toBeDefined();
    expect(result).toBe(user1.userID);
  });

  it("should validate the JWT token and return the user secret", async () => {
    const result = validateJWT(JWT2, user2.secret);
    expect(result).toBe(user2.userID);
  });
});

describe("JWT user token auth", () => {
  const mockReq1 = createRequest({
    headers: { authorization: "Bearer test-token" },
  });
  const mockReq2 = createRequest({
    headers: { authorization: "Bearer test-token-2" },
  });
  let token1: string;
  let token2: string;

  beforeAll(async () => {
    token1 = getBearerToken(mockReq1);
    token2 = getBearerToken(mockReq2);
  });
  it("Should return the user token as a string", async () => {
    expect(token1).toBe("test-token");
  });

  it("Should return the user token as a string", async () => {
    expect(token2).toBe("test-token-2");
  });
});
