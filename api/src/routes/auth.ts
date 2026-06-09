import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../middleware/async-handler.js';
import * as usersDb from '../db/users.js';

const router = Router();
const SESSION_HOURS = 24;

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe requis' });
    return;
  }

  const user = await usersDb.verifyUserCredentials(email, password);
  if (!user) {
    res.status(401).json({ error: 'Identifiants invalides' });
    return;
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await usersDb.createSession(user.id, token, expiresAt);

  res.json({
    data: {
      token,
      expiresAt: expiresAt.toISOString(),
      user,
    },
  });
}));

router.post('/logout', asyncHandler(async (req, res) => {
  const auth = req.headers.authorization?.replace('Bearer ', '');
  if (auth) {
    await usersDb.deleteSession(auth);
  }
  res.json({ data: { ok: true } });
}));

router.get('/me', asyncHandler(async (req, res) => {
  const auth = req.headers.authorization?.replace('Bearer ', '');
  if (!auth) {
    res.status(401).json({ error: 'Session requise' });
    return;
  }

  const user = await usersDb.getUserBySessionToken(auth);
  if (!user) {
    res.status(401).json({ error: 'Session expirée ou invalide' });
    return;
  }

  res.json({ data: user });
}));

export default router;
