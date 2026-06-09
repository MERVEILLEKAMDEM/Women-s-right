import { pool } from './pool.js';
import { verifyPassword } from '../utils/password.js';

export type UserRole = 'administrator' | 'secretary';

export interface AppUser {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

function mapUser(row: {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
}): AppUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
  };
}

export async function findUserByEmail(email: string): Promise<(AppUser & { passwordHash: string }) | null> {
  const { rows } = await pool.query<{
    id: number;
    email: string;
    full_name: string;
    role: UserRole;
    password_hash: string;
    active: boolean;
  }>(
    `SELECT id, email, full_name, role, password_hash, active
     FROM users WHERE email = $1`,
    [email.toLowerCase()],
  );

  const row = rows[0];
  if (!row || !row.active) return null;

  return {
    ...mapUser(row),
    passwordHash: row.password_hash,
  };
}

export async function verifyUserCredentials(email: string, password: string): Promise<AppUser | null> {
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

export async function createSession(userId: number, token: string, expiresAt: Date): Promise<void> {
  await pool.query(
    `INSERT INTO user_sessions (token, user_id, expires_at) VALUES ($1, $2, $3)`,
    [token, userId, expiresAt],
  );
}

export async function getUserBySessionToken(token: string): Promise<AppUser | null> {
  const { rows } = await pool.query<{
    id: number;
    email: string;
    full_name: string;
    role: UserRole;
  }>(
    `SELECT u.id, u.email, u.full_name, u.role
     FROM user_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > NOW() AND u.active = TRUE`,
    [token],
  );

  const row = rows[0];
  return row ? mapUser(row) : null;
}

export async function deleteSession(token: string): Promise<void> {
  await pool.query(`DELETE FROM user_sessions WHERE token = $1`, [token]);
}
