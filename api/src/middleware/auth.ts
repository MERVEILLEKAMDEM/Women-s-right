import type { Request, Response, NextFunction } from 'express';
import * as usersDb from '../db/users.js';
import type { AppUser } from '../db/users.js';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? 'map-protect-hcs-m26';

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
    }
  }
}

async function resolveUser(req: Request): Promise<AppUser | null> {
  const bearer = req.headers.authorization?.replace('Bearer ', '');
  if (!bearer || bearer === ADMIN_API_KEY) return null;
  return usersDb.getUserBySessionToken(bearer);
}

export async function attachUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await resolveUser(req);
    if (user) req.user = user;
    next();
  } catch {
    next();
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const key = req.headers['x-api-key'] ?? req.headers.authorization?.replace('Bearer ', '');
  if (key === ADMIN_API_KEY) {
    next();
    return;
  }

  const user = req.user ?? (await resolveUser(req));
  if (!user) {
    res.status(401).json({ error: 'Accès administrateur requis' });
    return;
  }
  if (user.role !== 'administrator') {
    res.status(403).json({ error: 'Rôle administrateur requis' });
    return;
  }
  req.user = user;
  next();
}

export async function requireStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  const key = req.headers['x-api-key'] ?? req.headers.authorization?.replace('Bearer ', '');
  if (key === ADMIN_API_KEY) {
    next();
    return;
  }

  const user = req.user ?? (await resolveUser(req));
  if (!user) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }
  req.user = user;
  next();
}
