import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const envPath = path.join(projectRoot, '.env');
dotenv.config({ path: envPath });

const isCI = process.env.CI === 'true' || process.env.NODE_ENV === 'test';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'agentcart',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(dbConfig);

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

export async function getClient() {
  return getPool().connect();
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    if (!isCI) {
      console.error('[DB Query Error]', (err as Error).message);
    }
    throw err;
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function testConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await query('SELECT NOW() as now');
    return { ok: true, message: `Connected to PostgreSQL at ${res.rows[0].now}` };
  } catch (err: any) {
    return { ok: false, message: err.message || 'Failed to connect to database' };
  }
}

export async function ensureDatabaseExists(): Promise<{ created: boolean; message: string }> {
  const dbName = dbConfig.database;
  const maintenancePool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    const checkRes = await maintenancePool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkRes.rows.length > 0) {
      return { created: false, message: `Database "${dbName}" already exists` };
    }

    await maintenancePool.query(`CREATE DATABASE "${dbName}" ENCODING 'UTF8'`);
    return { created: true, message: `Database "${dbName}" created successfully` };
  } finally {
    await maintenancePool.end();
  }
}
