/**
 * Push schema to Turso by executing migration SQL via libsql client.
 * Used in Vercel build since `prisma db push` doesn't support libsql:// URLs.
 */
import { createClient } from "@libsql/client";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  const migrationSql = fs.readFileSync(
    path.resolve(__dirname2, "../prisma/migrations/20260316232641_init/migration.sql"),
    "utf-8"
  );

  const statements = migrationSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Pushing schema: ${statements.length} statements...`);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log(`  ✓ ${stmt.substring(0, 60)}...`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log(`  ⏭ ${stmt.substring(0, 60)}... (already exists)`);
      } else {
        throw e;
      }
    }
  }

  console.log("Schema push complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
