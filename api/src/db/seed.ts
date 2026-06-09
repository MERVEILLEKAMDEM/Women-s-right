import 'dotenv/config';
import { pool, testConnection, closePool } from './pool.js';
import {
  ADMIN_ALERTS_SEED,
  APP_STATS_SEED,
  buildSeedLaws,
  COUNTRY_VIEW_SEEDS,
  SEED_COUNTRIES,
  THEME_SEARCHES_SEED,
} from '../data/seed-data.js';
import { USERS_SEED } from '../data/users-seed.js';

async function seedUsers(): Promise<void> {
  const { rows: userCount } = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  if (userCount[0].count > 0) {
    console.log('[PostgreSQL] Comptes utilisateurs déjà présents');
    return;
  }

  for (const user of USERS_SEED) {
    await pool.query(
      `INSERT INTO users (email, full_name, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      [user.email, user.fullName, user.passwordHash, user.role],
    );
  }
  console.log('[PostgreSQL] Comptes créés (1 administrateur, 3 secrétaires)');
}

async function seed() {
  await testConnection();

  const { rows: existing } = await pool.query('SELECT COUNT(*)::int AS count FROM countries');
  if (existing[0].count > 0) {
    console.log('[PostgreSQL] Base déjà peuplée — seed données ignoré');
    await seedUsers();
    await closePool();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const country of SEED_COUNTRIES) {
      await client.query(
        `INSERT INTO countries (id, name, region, lat, lng, focal_point, email, phone, view_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          country.id,
          country.name,
          country.region,
          country.lat,
          country.lng,
          country.focalPoint,
          country.email,
          country.phone ?? null,
          COUNTRY_VIEW_SEEDS[country.id] ?? 400,
        ],
      );
    }

    for (const law of buildSeedLaws()) {
      await client.query(
        `INSERT INTO laws (id, country_id, category, type, title, summary, themes, pdf_url, status, view_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          law.id,
          law.countryId,
          law.category,
          law.type,
          law.title,
          law.summary,
          law.themes,
          law.pdfUrl,
          law.status,
          law.viewCount,
        ],
      );
    }

    for (const alert of ADMIN_ALERTS_SEED) {
      await client.query(
        `INSERT INTO admin_alerts (country, type, message, alert_date, level, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [alert.country, alert.type, alert.message, alert.date, alert.level, alert.status],
      );
    }

    await client.query(
      `UPDATE app_stats SET total_visits = $1, unique_users = $2 WHERE id = 1`,
      [APP_STATS_SEED.totalVisits, APP_STATS_SEED.uniqueUsers],
    );

    for (const [theme, count] of Object.entries(THEME_SEARCHES_SEED)) {
      await client.query(
        `INSERT INTO theme_searches (theme, search_count) VALUES ($1, $2)`,
        [theme, count],
      );
    }

    await client.query('COMMIT');
    console.log('[PostgreSQL] Données initiales insérées (20 pays, 60 lois)');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  await seedUsers();
  await closePool();
}

seed().catch(err => {
  console.error('[PostgreSQL] Échec seed:', err.message);
  process.exit(1);
});
