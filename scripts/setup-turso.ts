import "dotenv/config";
import { createClient } from "@libsql/client";
import * as fs from "node:fs";
import * as path from "node:path";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  // Read and execute migration SQL
  const migrationSql = fs.readFileSync(
    path.resolve(__dirname, "../prisma/migrations/20260316232641_init/migration.sql"),
    "utf-8"
  );

  // Split by semicolons and execute each statement
  const statements = migrationSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} SQL statements...`);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log(`  ✓ ${stmt.substring(0, 60)}...`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log(`  ⏭ Already exists: ${stmt.substring(0, 60)}...`);
      } else {
        throw e;
      }
    }
  }

  console.log("\nSchema pushed to Turso successfully!");
}

main().catch(console.error);
