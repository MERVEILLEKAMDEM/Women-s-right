import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://mapprotect:mapprotect@localhost:5432/map_protect';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Erreur pool inattendue:', err.message);
});

export async function testConnection(): Promise<void> {
  await checkConnection();
  console.log('[PostgreSQL] Connexion établie');
}

export async function checkConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}
