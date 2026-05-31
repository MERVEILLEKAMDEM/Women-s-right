import type { Request, Response, NextFunction } from 'express';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? 'map-protect-hcs-m26';

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-api-key'] ?? req.headers.authorization?.replace('Bearer ', '');
  if (key !== ADMIN_API_KEY) {
    res.status(401).json({ error: 'Accès administrateur requis' });
    return;
  }
  next();
}
