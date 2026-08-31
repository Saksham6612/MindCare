'use strict';
/**
 * MindCare Database Migration Runner
 * ─────────────────────────────────────────────────────────────────────────────
 * Usage:
 *   node src/db/migrate.js              — apply all pending migrations
 *   node src/db/migrate.js --seed       — apply migrations + seed data
 *   node src/db/migrate.js --seed-only  — run seed only (schema must exist)
 *
 * Migrations are SQL files in src/db/migrations/ ordered by filename prefix.
 * Seeds are SQL files in src/db/seeds/ ordered by filename prefix.
 *
 * A `schema_migrations` table tracks which files have already been applied so
 * running this script multiple times is safe (idempotent).
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// ── Connection ──────────────────────────────────────────────────────────────
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host:     process.env.DB_HOST     || 'localhost',
        port:     parseInt(process.env.DB_PORT, 10) || 5432,
        database: process.env.DB_NAME     || 'mindcare',
        user:     process.env.DB_USER     || 'postgres',
        password: process.env.DB_PASSWORD || ''
      }
);

// ── Helpers ─────────────────────────────────────────────────────────────────
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const SEEDS_DIR      = path.join(__dirname, 'seeds');

function getSortedSQLFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();                           // lexicographic = 001_, 002_, …
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename    TEXT         PRIMARY KEY,
      applied_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}

async function isApplied(client, filename) {
  const { rowCount } = await client.query(
    'SELECT 1 FROM schema_migrations WHERE filename = $1',
    [filename]
  );
  return rowCount > 0;
}

async function markApplied(client, filename) {
  await client.query(
    'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT DO NOTHING',
    [filename]
  );
}

async function runSQLFile(client, filePath, filename) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`  ▶  Running: ${filename}`);
  await client.query(sql);
  console.log(`  ✅  Done:    ${filename}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args       = process.argv.slice(2);
  const seedOnly   = args.includes('--seed-only');
  const withSeed   = args.includes('--seed') || seedOnly;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    if (!seedOnly) {
      // ── Apply migrations ─────────────────────────────────────────────────
      await ensureMigrationsTable(client);
      const migrationFiles = getSortedSQLFiles(MIGRATIONS_DIR);

      if (migrationFiles.length === 0) {
        console.log('\n  ℹ️  No migration files found in src/db/migrations/');
      } else {
        console.log('\n📦  Applying migrations…');
        for (const filename of migrationFiles) {
          if (await isApplied(client, filename)) {
            console.log(`  ⏭  Skipped (already applied): ${filename}`);
            continue;
          }
          await runSQLFile(client, path.join(MIGRATIONS_DIR, filename), filename);
          await markApplied(client, filename);
        }
      }
    }

    if (withSeed) {
      // ── Run seed files ───────────────────────────────────────────────────
      const seedFiles = getSortedSQLFiles(SEEDS_DIR);

      if (seedFiles.length === 0) {
        console.log('\n  ℹ️  No seed files found in src/db/seeds/');
      } else {
        console.log('\n🌱  Running seeds…');
        for (const filename of seedFiles) {
          await runSQLFile(client, path.join(SEEDS_DIR, filename), filename);
        }
      }
    }

    await client.query('COMMIT');
    console.log('\n✅  Migration runner finished successfully.\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌  Migration failed — transaction rolled back.');
    console.error('   ', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
