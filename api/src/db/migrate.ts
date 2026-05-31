import 'dotenv/config';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { pool, testConnection, closePool } from './pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  await testConnection();

  const schemaPath = join(__dirname, '../../db/schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');

  await pool.query(schema);
  console.log('[PostgreSQL] Schéma appliqué avec succès');
  await closePool();
}

migrate().catch(err => {
  console.error('[PostgreSQL] Échec migration:', err.message);
  process.exit(1);
});
