import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, ensureDatabaseExists, closePool, testConnection, getPool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readMigrationFile(filename: string): Promise<string> {
  const filePath = path.resolve(__dirname, '..', 'migrations', filename);
  return readFile(filePath, 'utf-8');
}

async function isMigrationApplied(version: string): Promise<boolean> {
  try {
    const res = await query(
      `SELECT 1 FROM schema_migrations WHERE version = $1`,
      [version]
    );
    return res.rows.length > 0;
  } catch (err) {
    return false;
  }
}

async function recordMigration(version: string, name: string): Promise<void> {
  await query(
    `INSERT INTO schema_migrations (version, name) VALUES ($1, $2)`,
    [version, name]
  );
}

interface MigrationResult {
  version: string;
  name: string;
  status: 'applied' | 'skipped' | 'error';
  error?: string;
}

const MIGRATIONS = [
  { version: '001', name: 'init_schema', file: '001_init_schema.sql' },
];

async function runMigrations(): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];

  console.log('\n========================================');
  console.log('  AgentCart Database Migration');
  console.log('========================================\n');

  const connCheck = await testConnection();
  if (!connCheck.ok) {
    console.log(`⚠️  Cannot connect: ${connCheck.message}`);
    console.log('\nAttempting to create database...');
    try {
      const created = await ensureDatabaseExists();
      console.log(`✅ ${created.message}`);
      await closePool();
      getPool();
      const retry = await testConnection();
      if (!retry.ok) {
        throw new Error(retry.message);
      }
    } catch (err: any) {
      throw new Error(`Database setup failed: ${err.message}`);
    }
  }

  for (const migration of MIGRATIONS) {
    const already = await isMigrationApplied(migration.version);
    if (already) {
      results.push({ version: migration.version, name: migration.name, status: 'skipped' });
      console.log(`⏭  [${migration.version}] ${migration.name} — already applied`);
      continue;
    }

    try {
      const sql = await readMigrationFile(migration.file);
      await query(sql);
      await recordMigration(migration.version, migration.name);
      results.push({ version: migration.version, name: migration.name, status: 'applied' });
      console.log(`✅ [${migration.version}] ${migration.name} — applied`);
    } catch (err: any) {
      results.push({
        version: migration.version,
        name: migration.name,
        status: 'error',
        error: err.message,
      });
      console.error(`❌ [${migration.version}] ${migration.name} — ERROR: ${err.message}`);
      throw err;
    }
  }

  console.log('\n========================================');
  const applied = results.filter((r) => r.status === 'applied').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const errors = results.filter((r) => r.status === 'error').length;
  console.log(`  Applied: ${applied} | Skipped: ${skipped} | Errors: ${errors}`);
  console.log('========================================\n');

  return results;
}

if (process.argv[1] === __filename || process.argv[1]?.endsWith('migrate.ts')) {
  runMigrations()
    .then(() => {
      console.log('🎉 Migration complete!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n💥 Migration failed:', err.message);
      process.exit(1);
    })
    .finally(() => closePool());
}

export { runMigrations };
