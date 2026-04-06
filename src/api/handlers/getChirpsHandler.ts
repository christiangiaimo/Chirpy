import { Request, Response } from "express";
import { deleteChirp, getChirp, getChirps } from "../db/queires/chirp.js";
import { respondWithError, respondWithJson } from "./json.js";
import { getBearerToken, validateJWT } from "../middlewares/auth.js";
import { config } from "../../config.js";
import { Unauthorized } from "../middlewares/errors.js";

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
  const chirp = await getChirp(req.params.chirpId);
  if (chirp) {
    respondWithJson(res, 200, chirp);
  } else {
    res.status(404).send();
  }
}

export async function deleteChirpHandler(
  req: Request<ChirpParams>,
  res: Response,
) {
  try {
    const token = getBearerToken(req as any);
    const userId = validateJWT(token, config.secret);
    if (!userId) {
      respondWithError(res, 403, "Forbidden");
      return;
    }
    const chirpId = req.params.chirpId;
    const chirp = await getChirp(chirpId);
    if (!chirp) {
      respondWithError(res, 404, "Unauthorized");
      return;
    }

    if (chirp.userId === userId) {
      await deleteChirp(chirpId);
      res.status(204).send();
      return;
    } else {
      respondWithError(res, 403, "Forbidden");
    }
  } catch (err) {
    respondWithError(res, 401, "Unauthorized");
  }
}
