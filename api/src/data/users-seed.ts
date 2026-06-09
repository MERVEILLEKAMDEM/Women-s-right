import { hashPassword } from '../utils/password.js';

export const USERS_SEED = [
  {
    email: 'admin@map-protect.hcs',
    fullName: 'Administrateur MAP-PROTECT',
    password: 'Admin@2026',
    role: 'administrator' as const,
  },
  {
    email: 'secretary1@map-protect.hcs',
    fullName: 'Secrétaire Région Afrique',
    password: 'Secretary1@2026',
    role: 'secretary' as const,
  },
  {
    email: 'secretary2@map-protect.hcs',
    fullName: 'Secrétaire Région Europe',
    password: 'Secretary2@2026',
    role: 'secretary' as const,
  },
  {
    email: 'secretary3@map-protect.hcs',
    fullName: 'Secrétaire Région Amériques',
    password: 'Secretary3@2026',
    role: 'secretary' as const,
  },
].map((user) => ({
  ...user,
  passwordHash: hashPassword(user.password),
}));
