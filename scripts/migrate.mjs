import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ Error: DATABASE_URL is not set in your environment or .env.local file.");
  process.exit(1);
}

async function runMigration() {
  console.log("🚀 Applying migration to Neon PostgreSQL...");
  const sql = neon(databaseUrl);

  const migrationPath = path.join(process.cwd(), "drizzle", "0000_noisy_shiver_man.sql");
  const migrationSql = fs.readFileSync(migrationPath, "utf-8");

  try {
    await sql(migrationSql);
    console.log("✅ Migration applied successfully! Table 'reunion_submissions' is ready.");
  } catch (err) {
    if (err.message && err.message.includes("already exists")) {
      console.log("ℹ️ Table 'reunion_submissions' already exists. Schema is up to date.");
    } else {
      console.error("❌ Migration failed:", err);
      process.exit(1);
    }
  }
}

runMigration();
