import {
  createUser,
  getUserByEmail,
  updateEmail,
  updatePassword,
  updateUserInfo,
} from "../db/queires/users.js";
import { Request, Response } from "express";
import {
  getBearerToken,
  hashPassword,
  makeJWT,
  makeRefreshToken,
  validateJWT,
} from "../middlewares/auth.js";
import { NewToken, newUser } from "src/db/schema.js";
import * as argon2 from "argon2";
import { verify } from "node:crypto";
import { Unauthorized } from "../middlewares/errors.js";
import { respondWithError, respondWithJson } from "./json.js";
import { config } from "../../config.js";
import { insertToken } from "../db/queires/tokens.js";

interface CreateUserBody {
  email: string;
  password: string;
  expiresInSeconds?: number;
}

type CreateUserBodyPreview = Omit<CreateUserBody, "password">;

export async function CreateUserHandler(
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
) {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const { expiresInSeconds } = req.body;
    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input",
        message: "Invalid email or password",
      });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user: newUser = {
      email: req.body.email,
      hashedPassword: hashedPassword,
    };

    const dbUser = await createUser(user);
    if (!dbUser) {
      throw new Error("Unable to create the new user");
    }
    res.status(201).json({
      id: dbUser.id,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function validateUserLoginHandler(
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
) {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const { expiresInSeconds = 3600 } = req.body;
    const expiry = Math.min(expiresInSeconds, 3600);

    if (
      !email ||
      typeof email != "string" ||
      !password ||
      typeof password != "string"
    ) {
      throw new Error("Invalid Email or password");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid email" });
      return;
    }
    const verifyPassword = await argon2.verify(user.hashedPassword, password);
    if (verifyPassword === true) {
      const refreshToken = makeRefreshToken();
      const now = new Date();
      const expireJWTDate = 3600;
      const monthsInMiliSeconds = 60 * 3600 * 24 * 60 * 1000;
      const expireRefreshTokenDate = new Date(
        now.getTime() + monthsInMiliSeconds,
      );
      const dbRefreshToken: NewToken = {
        userId: user.id,
        token: refreshToken,
        expiresAt: expireRefreshTokenDate,
      };
      const JWTtoken = makeJWT(user.id, expireJWTDate, config.secret);

      await insertToken(dbRefreshToken);
      const userPreview = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: JWTtoken,
        refreshToken: refreshToken,
      };

      respondWithJson(res, 200, userPreview);
    } else {
      res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserInfoHandler(req: Request, res: Response) {
  try {
    const { password, email } = req.body;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.secret);

    const hashedPassword = await hashPassword(password);
    const updatedUser = await updateUserInfo(userId, email, hashedPassword);

    respondWithJson(res, 200, {
      id: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (err) {
    respondWithError(res, 401, "Unauthorized");
  }
}
