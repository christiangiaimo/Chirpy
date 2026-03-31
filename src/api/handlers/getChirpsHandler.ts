import { Request, Response } from "express";
import { getChirp, getChirps } from "../db/queires/chirp.js";
import { respondWithJson } from "./json.js";

interface ChirpParams {
  chirpId: string;
}

export async function getChirpsHandler(req: Request, res: Response) {
  const chirps = await getChirps();
  respondWithJson(res, 200, chirps);
}

export async function getChirpHandler(
  req: Request<ChirpParams>,
  res: Response,
) {
  const [chirp] = await getChirp(req.params.chirpId);
  if (chirp) {
    respondWithJson(res, 200, chirp);
  } else {
    res.status(400);
  }
}
