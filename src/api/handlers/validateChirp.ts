import { Request, Response } from "express";
import { respondWithError, respondWithJson } from "./json.js";
import { BadRequest } from "../middlewares/errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };
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
  const params: parameters = req.body;
  const maxChirpLenght = 140;
  if (params.body && params.body.length > maxChirpLenght) {
    //respondWithError(res, 400, "Chirp is too long");
    throw new BadRequest("Chirp is too long. Max length is 140");
  }
  /*respondWithJson(res, 200, {
    valid: true,
  });*/

  const words = params.body.trim().split(/\s+/);
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
  respondWithJson(res, 200, { cleanedBody: cleaned });
}
