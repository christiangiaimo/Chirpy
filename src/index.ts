import express from "express";
import { handlerReadiness } from "./api/handlers/readiness.js";
import { middlewareLogResponses } from "./api/middlewares/logResponses.js";
import { middlewareMetricsInc } from "./api/middlewares/metricsInc.js";
import { handlerPrintMetrics } from "./api/handlers/printMetrics.js";
import { handlerResetMetrics } from "./api/handlers/reset.js";
import { handlerValidateChirp } from "./api/handlers/validateChirp.js";
import { middlewareError } from "./api/middlewares/errors.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import {
  CreateUserHandler,
  validateUserLoginHandler,
} from "./api/handlers/users.js";
import { createChirpHandler } from "./api/handlers/createChirpHandler.js";
import { getChirps } from "./api/db/queires/chirp.js";
import {
  getChirpHandler,
  getChirpsHandler,
} from "./api/handlers/getChirpsHandler.js";
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
app.use(express.json());

const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.get("/admin/healthz", handlerReadiness);
app.get("/admin/metrics", handlerPrintMetrics);
app.post("/admin/reset", handlerResetMetrics);
app.post("/api/users", CreateUserHandler);
//app.post("/api/validate_chirp", handlerValidateChirp);
app.post("/api/chirps", createChirpHandler);
app.get("/api/chirps", getChirpsHandler);
app.get("/api/chirps/:chirpId", getChirpHandler);
app.post("/api/login", validateUserLoginHandler);

//app.post("/api/chirps", (req, res, next) => {
//  Promise.resolve(handlerValidateChirp(req, res)).catch(next);
//});
app.use(middlewareError);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
