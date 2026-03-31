import { createUser } from "../db/queires/users.js";
import { Request, Response } from "express";

interface CreateUserBody {
  email: string;
  name?: string;
}

export async function CreateUserHandler(
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
) {
  try {
    const user = req.body;
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      res.status(400).json({
        error: "Invalid input",
        message: "A valid email string is requires",
      });
    }
    const dbUser = await createUser(user);
    res.status(201).json({
      id: dbUser.id,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    });
  } catch (error) {
    throw new Error("Error");
  }
}
