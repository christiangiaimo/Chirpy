import type { MigrationConfig } from "drizzle-orm/migrator";

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
};

export type Config = {
  db: DBConfig;
  api: APIConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations/",
};

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const config: Config = {
  db: { url: envOrThrow("DB_URL"), migrationConfig: migrationConfig },

  api: {
    fileServerHits: 0,
    port: 8080,
    platform: envOrThrow("PLATFORM"),
  },
};
