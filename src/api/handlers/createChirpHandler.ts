import { Response, Request, NextFunction } from "express";
import { createChirp } from "../db/queires/chirp.js";
import { BadRequest } from "../middlewares/errors.js";

type createChirpParameters = {
  body: string;
  userId: string;
};

export function handlerValidateChirp(body: string): string {
  /* let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  let params: parameters;

  req.on("end", () => {
    try {
      params = JSON.parse(body);
    } catch (e) {
      respondWithError(res, 400, "Invalid JSON");
      return;
    }
*/
  const maxChirpLenght = 140;
  if (body && body.length > maxChirpLenght) {
    //respondWithError(res, 400, "Chirp is too long");
    throw new BadRequest("Chirp is too long. Max length is 140");
  }
  /*respondWithJson(res, 200, {
    valid: true,
  });*/

  const words = body.trim().split(/\s+/);
  const cleanedBody = [];
  const badWords = ["kerfuffle", "sharbert", "fornax"];
  for (let word of words) {
    if (badWords.includes(word.toLowerCase())) {
      word = "****";
      cleanedBody.push(word);
    } else {
      cleanedBody.push(word);
    }
  }
  const cleaned = cleanedBody.join(" ");
  return cleaned;
  //respondWithJson(res, 200, { cleanedBody: cleaned });
}

export async function createChirpHandler(
  req: Request<{}, {}, createChirpParameters>,
  res: Response,
) {
  const body = req.body;

  const cleaned = handlerValidateChirp(req.body.body);
  const { userId } = body;
  console.error("createChirpHandler called", req.body);

  const chirp = await createChirp({ body: cleaned, userId: userId });
  res.status(201).json({
    id: chirp.id,
    createdAt: chirp.createdAt,
    updatetAt: chirp.updatedAt,
    body: chirp.body,
    userId: chirp.userId,
  });
}
