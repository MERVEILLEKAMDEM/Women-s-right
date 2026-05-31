import { v4 as uuidv4 } from 'uuid';
import { pool } from './pool.js';
import type {
  AdminAlert,
  Country,
  CountryWithLaws,
  CreateLawInput,
  DashboardStats,
  EmergencyAlert,
  Law,
  LawCategory,
  UpdateLawInput,
} from '../types.js';
import { THEME_TO_CATEGORY } from '../types.js';

interface CountryRow {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  focal_point: string;
  email: string;
  phone: string | null;
  view_count: number;
}

interface LawRow {
  id: string;
  country_id: string;
  category: LawCategory;
  type: string;
  title: string;
  summary: string;
  full_text: string | null;
  themes: string[];
  pdf_url: string | null;
  status: 'active' | 'draft';
  view_count: number;
}

function mapCountry(row: CountryRow): Country {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    lat: row.lat,
    lng: row.lng,
    focalPoint: row.focal_point,
    email: row.email,
    phone: row.phone ?? undefined,
    viewCount: row.view_count,
  };
}

function mapLaw(row: LawRow): Law {
  return {
    id: row.id,
    countryId: row.country_id,
    category: row.category,
    type: row.type,
    title: row.title,
    summary: row.summary,
    fullText: row.full_text ?? undefined,
    themes: row.themes ?? [],
    pdfUrl: row.pdf_url ?? undefined,
    status: row.status,
    viewCount: row.view_count,
  };
}

async function bumpTotalVisits(): Promise<void> {
  await pool.query('UPDATE app_stats SET total_visits = total_visits + 1 WHERE id = 1');
}

export async function findCountries(filters: {
  search?: string;
  region?: string;
  theme?: string;
}): Promise<{ countries: Country[]; regions: string[] }> {
  const params: unknown[] = [];
  const conditions: string[] = [];
  let joinLaws = false;

  if (filters.search) {
    params.push(`%${filters.search.toLowerCase()}%`);
    conditions.push(`LOWER(c.name) LIKE $${params.length}`);
  }

  if (filters.region && filters.region !== 'Toutes les régions') {
    params.push(filters.region);
    conditions.push(`c.region = $${params.length}`);
  }

  if (filters.theme && filters.theme !== 'Toutes thématiques') {
    joinLaws = true;
    const category = THEME_TO_CATEGORY[filters.theme];
    if (category) {
      params.push(category, filters.theme);
      conditions.push(`(l.category = $${params.length - 1} OR $${params.length} = ANY(l.themes))`);
    } else {
      params.push(filters.theme);
      conditions.push(`$${params.length} = ANY(l.themes)`);
    }
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const from = joinLaws
    ? 'countries c INNER JOIN laws l ON l.country_id = c.id'
    : 'countries c';

  const query = `
    SELECT DISTINCT c.* FROM ${from}
    ${where}
    ORDER BY c.name
  `;

  const { rows } = await pool.query<CountryRow>(query, params);
  const { rows: regionRows } = await pool.query<{ region: string }>(
    'SELECT DISTINCT region FROM countries ORDER BY region',
  );

  return {
    countries: rows.map(mapCountry),
    regions: regionRows.map(r => r.region),
  };
}

export async function findCountryById(id: string): Promise<Country | null> {
  const { rows } = await pool.query<CountryRow>('SELECT * FROM countries WHERE id = $1', [id]);
  return rows[0] ? mapCountry(rows[0]) : null;
}

export async function findLawsByCountry(countryId: string): Promise<Law[]> {
  const { rows } = await pool.query<LawRow>(
    'SELECT * FROM laws WHERE country_id = $1 ORDER BY category, title',
    [countryId],
  );
  return rows.map(mapLaw);
}

export async function findCountryWithLaws(id: string): Promise<CountryWithLaws | null> {
  const country = await findCountryById(id);
  if (!country) return null;

  const laws = await findLawsByCountry(id);
  return {
    ...country,
    laws: {
      femme: laws.filter(l => l.category === 'femme'),
      enfant: laws.filter(l => l.category === 'enfant'),
      vbg: laws.filter(l => l.category === 'vbg'),
    },
  };
}

export async function incrementCountryView(countryId: string): Promise<Country | null> {
  const { rows } = await pool.query<CountryRow>(
    'UPDATE countries SET view_count = view_count + 1 WHERE id = $1 RETURNING *',
    [countryId],
  );
  if (!rows[0]) return null;
  await bumpTotalVisits();
  return mapCountry(rows[0]);
}

export async function findLaws(filters: {
  countryId?: string;
  category?: string;
  theme?: string;
  search?: string;
  status?: string;
}): Promise<(Law & { countryName?: string })[]> {
  const params: unknown[] = [];
  const conditions: string[] = [];

  if (filters.countryId) {
    params.push(filters.countryId);
    conditions.push(`l.country_id = $${params.length}`);
  }
  if (filters.category) {
    params.push(filters.category);
    conditions.push(`l.category = $${params.length}`);
  }
  if (filters.theme && filters.theme !== 'Toutes thématiques') {
    const cat = THEME_TO_CATEGORY[filters.theme];
    if (cat) {
      params.push(cat, filters.theme);
      conditions.push(`(l.category = $${params.length - 1} OR $${params.length} = ANY(l.themes))`);
    } else {
      params.push(filters.theme);
      conditions.push(`$${params.length} = ANY(l.themes)`);
    }
  }
  if (filters.search) {
    params.push(`%${filters.search.toLowerCase()}%`);
    conditions.push(`(LOWER(l.title) LIKE $${params.length} OR LOWER(l.summary) LIKE $${params.length})`);
  }
  if (filters.status) {
    params.push(filters.status);
    conditions.push(`l.status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query<LawRow & { country_name: string }>(
    `SELECT l.*, c.name AS country_name FROM laws l
     JOIN countries c ON c.id = l.country_id
     ${where}
     ORDER BY l.title`,
    params,
  );

  return rows.map(r => ({ ...mapLaw(r), countryName: r.country_name }));
}

export async function findLawById(id: string): Promise<Law | null> {
  const { rows } = await pool.query<LawRow>('SELECT * FROM laws WHERE id = $1', [id]);
  return rows[0] ? mapLaw(rows[0]) : null;
}

export async function incrementLawView(lawId: string): Promise<Law | null> {
  const { rows } = await pool.query<LawRow>(
    'UPDATE laws SET view_count = view_count + 1 WHERE id = $1 RETURNING *',
    [lawId],
  );
  if (!rows[0]) return null;
  await bumpTotalVisits();
  return mapLaw(rows[0]);
}

export async function createLaw(input: CreateLawInput): Promise<Law> {
  const { rows: countRows } = await pool.query<{ count: string }>(
    'SELECT COUNT(*) FROM laws WHERE country_id = $1 AND category = $2',
    [input.countryId, input.category],
  );
  const id = `${input.countryId}-${input.category}-${Number(countRows[0].count) + 1}`;

  const { rows } = await pool.query<LawRow>(
    `INSERT INTO laws (id, country_id, category, type, title, summary, full_text, themes, pdf_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      id,
      input.countryId,
      input.category,
      input.type,
      input.title,
      input.summary,
      input.fullText ?? null,
      input.themes ?? [],
      input.pdfUrl ?? `/api/documents/${id}/pdf`,
      input.status ?? 'draft',
    ],
  );
  return mapLaw(rows[0]);
}

export async function updateLaw(id: string, input: UpdateLawInput): Promise<Law | null> {
  const existing = await findLawById(id);
  if (!existing) return null;

  const merged = { ...existing, ...input, id };
  const { rows } = await pool.query<LawRow>(
    `UPDATE laws SET
      country_id = $2, category = $3, type = $4, title = $5, summary = $6,
      full_text = $7, themes = $8, pdf_url = $9, status = $10, updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [
      id,
      merged.countryId,
      merged.category,
      merged.type,
      merged.title,
      merged.summary,
      merged.fullText ?? null,
      merged.themes,
      merged.pdfUrl ?? null,
      merged.status,
    ],
  );
  return rows[0] ? mapLaw(rows[0]) : null;
}

export async function deleteLaw(id: string): Promise<Law | null> {
  const { rows } = await pool.query<LawRow>('DELETE FROM laws WHERE id = $1 RETURNING *', [id]);
  return rows[0] ? mapLaw(rows[0]) : null;
}

export async function createEmergencyAlert(input: {
  lat?: number;
  lng?: number;
  countryId?: string;
  message?: string;
}): Promise<EmergencyAlert> {
  const id = uuidv4();
  const anonymousId = uuidv4().slice(0, 8);

  const { rows } = await pool.query<{
    id: string;
    anonymous_id: string;
    country_id: string | null;
    lat: number | null;
    lng: number | null;
    message: string | null;
    status: 'open' | 'resolved';
    level: 'high' | 'medium' | 'low';
    created_at: Date;
  }>(
    `INSERT INTO emergency_alerts (id, anonymous_id, country_id, lat, lng, message)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [id, anonymousId, input.countryId ?? null, input.lat ?? null, input.lng ?? null, input.message ?? null],
  );

  const row = rows[0];
  return {
    id: row.id,
    anonymousId: row.anonymous_id,
    countryId: row.country_id ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    message: row.message ?? undefined,
    status: row.status,
    level: row.level,
    createdAt: row.created_at.toISOString(),
  };
}

export async function findAllCountries(): Promise<Country[]> {
  const { rows } = await pool.query<CountryRow>('SELECT * FROM countries ORDER BY name');
  return rows.map(mapCountry);
}

export async function getAdminLaws() {
  const { rows } = await pool.query<LawRow & { country_name: string }>(
    `SELECT l.*, c.name AS country_name FROM laws l
     JOIN countries c ON c.id = l.country_id ORDER BY c.name, l.title`,
  );
  return rows.map(r => ({
    id: r.id,
    country: r.country_name,
    countryId: r.country_id,
    category: r.category === 'femme' ? 'Femme' : r.category === 'enfant' ? 'Enfant' : 'VBG',
    title: r.title,
    type: r.type,
    status: r.status,
    viewCount: r.view_count,
  }));
}

export async function getAdminAlerts(): Promise<AdminAlert[]> {
  const { rows } = await pool.query<{
    id: number;
    country: string;
    type: AdminAlert['type'];
    message: string;
    alert_date: Date;
    level: AdminAlert['level'];
    status: AdminAlert['status'];
  }>('SELECT * FROM admin_alerts ORDER BY alert_date DESC, id DESC');

  return rows.map(r => ({
    id: String(r.id),
    country: r.country,
    type: r.type,
    message: r.message,
    date: r.alert_date.toISOString().slice(0, 10),
    level: r.level,
    status: r.status,
  }));
}

export async function createAdminAlert(input: {
  country: string;
  type: AdminAlert['type'];
  message: string;
  level?: AdminAlert['level'];
}): Promise<AdminAlert> {
  const { rows } = await pool.query<{
    id: number;
    country: string;
    type: AdminAlert['type'];
    message: string;
    alert_date: Date;
    level: AdminAlert['level'];
    status: AdminAlert['status'];
  }>(
    `INSERT INTO admin_alerts (country, type, message, level)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [input.country, input.type, input.message, input.level ?? 'medium'],
  );
  const r = rows[0];
  return {
    id: String(r.id),
    country: r.country,
    type: r.type,
    message: r.message,
    date: r.alert_date.toISOString().slice(0, 10),
    level: r.level,
    status: r.status,
  };
}

export async function resolveAdminAlert(id: string): Promise<AdminAlert | null> {
  const { rows } = await pool.query<{
    id: number;
    country: string;
    type: AdminAlert['type'];
    message: string;
    alert_date: Date;
    level: AdminAlert['level'];
    status: AdminAlert['status'];
  }>(
    `UPDATE admin_alerts SET status = 'resolved' WHERE id = $1 RETURNING *`,
    [Number(id)],
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: String(r.id),
    country: r.country,
    type: r.type,
    message: r.message,
    date: r.alert_date.toISOString().slice(0, 10),
    level: r.level,
    status: r.status,
  };
}

export async function getEmergencyAlerts() {
  const { rows } = await pool.query<{
    id: string;
    anonymous_id: string;
    country_id: string | null;
    lat: number | null;
    lng: number | null;
    status: 'open' | 'resolved';
    level: 'high' | 'medium' | 'low';
    created_at: Date;
  }>('SELECT id, anonymous_id, country_id, lat, lng, status, level, created_at FROM emergency_alerts ORDER BY created_at DESC');

  return rows.map(r => ({
    id: r.id,
    anonymousId: r.anonymous_id,
    countryId: r.country_id ?? undefined,
    status: r.status,
    level: r.level,
    createdAt: r.created_at.toISOString(),
    hasLocation: !!(r.lat && r.lng),
  }));
}

export async function getStatsSummary() {
  const { rows: countryRows } = await pool.query<{ count: string }>('SELECT COUNT(*) FROM countries');
  const { rows: lawRows } = await pool.query<{ category: LawCategory; count: string }>(
    'SELECT category, COUNT(*) AS count FROM laws GROUP BY category',
  );

  const lawCounts = { femme: 0, enfant: 0, vbg: 0 };
  for (const row of lawRows) {
    lawCounts[row.category] = Number(row.count);
  }

  return {
    countryCount: Number(countryRows[0].count),
    lawCounts,
  };
}

export async function getThemeCounts(): Promise<Record<string, number>> {
  const { rows: allLaws } = await pool.query<LawRow>('SELECT category, themes FROM laws');
  const themes = [
    'Protection de la Femme',
    "Droits de l'Enfant",
    'Lutte contre les VBG',
    'Mariage précoce',
    'Équité salariale',
    'Violence domestique',
    'Harcèlement sexuel',
    'MGF',
  ];

  const counts: Record<string, number> = {};
  for (const theme of themes) {
    const cat = THEME_TO_CATEGORY[theme];
    counts[theme] = allLaws.filter(l =>
      l.themes.includes(theme) ||
      (theme === 'Protection de la Femme' && l.category === 'femme') ||
      (theme === "Droits de l'Enfant" && l.category === 'enfant') ||
      (theme === 'Lutte contre les VBG' && l.category === 'vbg'),
    ).length;
    if (cat && !counts[theme]) {
      counts[theme] = allLaws.filter(l => l.category === cat || l.themes.includes(theme)).length;
    }
  }
  return counts;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const summary = await getStatsSummary();

  const { rows: topCountryRows } = await pool.query<{ name: string; view_count: number }>(
    'SELECT name, view_count FROM countries ORDER BY view_count DESC LIMIT 5',
  );

  const { rows: topLawRows } = await pool.query<{ title: string; view_count: number; country_name: string }>(
    `SELECT l.title, l.view_count, c.name AS country_name FROM laws l
     JOIN countries c ON c.id = l.country_id
     ORDER BY l.view_count DESC LIMIT 5`,
  );

  const { rows: themeRows } = await pool.query<{ theme: string; search_count: number }>(
    'SELECT theme, search_count FROM theme_searches ORDER BY search_count DESC',
  );

  const { rows: statsRows } = await pool.query<{ total_visits: number; unique_users: number }>(
    'SELECT total_visits, unique_users FROM app_stats WHERE id = 1',
  );

  const { rows: emergencyRows } = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM emergency_alerts WHERE status = 'open'",
  );

  return {
    totalVisits: statsRows[0]?.total_visits ?? 0,
    uniqueUsers: statsRows[0]?.unique_users ?? 0,
    emergencyAlerts: Number(emergencyRows[0]?.count ?? 0),
    countryCount: summary.countryCount,
    topCountries: topCountryRows.map(r => ({ name: r.name, views: r.view_count })),
    topLaws: topLawRows.map(r => ({ title: `${r.title} (${r.country_name})`, views: r.view_count })),
    topThemes: themeRows.map(r => ({
      label: r.theme,
      searches: r.search_count,
      trend: Math.floor(Math.random() * 15) + 8,
    })),
    lawCounts: summary.lawCounts,
  };
}

export function anonymizeAlert(alert: EmergencyAlert) {
  return {
    id: alert.id,
    anonymousId: alert.anonymousId,
    countryId: alert.countryId,
    status: alert.status,
    level: alert.level,
    createdAt: alert.createdAt,
    hasLocation: !!(alert.lat && alert.lng),
  };
}
