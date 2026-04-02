import { createUser, getUserByEmail } from "../db/queires/users.js";
import { Request, Response } from "express";
import { hashPassword } from "../middlewares/auth.js";
import { newUser } from "src/db/schema.js";
import * as argon2 from "argon2";
import { verify } from "node:crypto";
import { Unauthorized } from "../middlewares/errors.js";
import { respondWithJson } from "./json.js";

interface CreateUserBody {
  email: string;
  password: string;
}

type CreateUserBodyPreview = Omit<CreateUserBody, "password">;

export async function CreateUserHandler(
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
) {
  try {
    const { email } = req.body;
    const { password } = req.body;
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
      const userPreview = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
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
