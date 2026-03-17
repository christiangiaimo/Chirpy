import { config } from "../../config.js";
import { Request, Response } from "express";

export function handlerPrintMetrics(req: Request, res: Response) {
  console.log(`Hits: ${config.fileServerHits}`);
  res.set({ "Content-Type": "text/html", charset: "utf-8" });
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileServerHits} times!</p>
  </body>
</html>`);
}
