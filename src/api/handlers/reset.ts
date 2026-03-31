import { config } from "../../config.js";
import { Response, Request, NextFunction } from "express";
import { resetUsersTable } from "../db/queires/resetUsers.js";

export async function handlerResetMetrics(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log("reset ran");
  if (config.api.platform !== "dev") {
    res.status(403).send("403 Forbidden");
    return;
  }
  console.log("reset ran");
  config.api.fileServerHits = 0;
  await resetUsersTable();
  res.send("OK");
}
