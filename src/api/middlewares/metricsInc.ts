import { NextFunction, Request, Response } from "express";
import { config } from "../../config.js";

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    config.api.fileServerHits += 1;
  });
  next();
}
