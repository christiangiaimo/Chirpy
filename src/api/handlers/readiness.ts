import { Request, Response } from "express";

export function handlerReadiness(req: Request, res: Response) {
  res.set({
    "Content-Type": "text/plain",
  });
  res.send("OK");
}
