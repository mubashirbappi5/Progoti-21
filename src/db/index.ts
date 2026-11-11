import { drizzle } from "drizzle-orm/neon-http";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

function createDbClient() {
  if (!databaseUrl) {
    // Return a dummy proxy or throw a clean error when invoked
    return null;
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export const db = createDbClient();

export function getDb() {
  const currentUrl = process.env.DATABASE_URL;
  if (!currentUrl) {
    throw new Error(
      "DATABASE_URL is not set. Please configure your Neon Serverless PostgreSQL connection string in .env.local"
    );
  }
  const sql = neon(currentUrl);
  return drizzle(sql, { schema });
}

export { schema };

