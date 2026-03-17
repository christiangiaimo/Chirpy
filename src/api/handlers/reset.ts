import { config } from "../../config.js";
import { Response, Request, NextFunction } from "express";

export function handlerResetMetrics(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  config.fileServerHits = 0;
  res.send("OK");
}
