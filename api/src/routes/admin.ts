import { Router } from 'express';
import * as db from '../db/repository.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { paramAsString } from '../utils/params.js';
import { createLawRouter } from './laws.js';

const router = Router();

router.get('/stats', asyncHandler(async (_req, res) => {
  res.json({ data: await db.getDashboardStats() });
}));

router.get('/laws', asyncHandler(async (_req, res) => {
  res.json({ data: await db.getAdminLaws() });
}));

router.use('/laws', createLawRouter(true));

router.get('/alerts', asyncHandler(async (_req, res) => {
  res.json({ data: await db.getAdminAlerts() });
}));

router.post('/alerts', asyncHandler(async (req, res) => {
  const { country, type, message, level } = req.body;
  if (!country || !type || !message) {
    res.status(400).json({ error: 'Champs requis: country, type, message' });
    return;
  }
  const alert = await db.createAdminAlert({ country, type, message, level });
  res.status(201).json({ data: alert });
}));

router.patch('/alerts/:id/resolve', asyncHandler(async (req, res) => {
  const alert = await db.resolveAdminAlert(paramAsString(req.params.id));
  if (!alert) {
    res.status(404).json({ error: 'Alerte non trouvée' });
    return;
  }
  res.json({ data: alert });
}));

router.get('/emergencies', asyncHandler(async (_req, res) => {
  const data = await db.getEmergencyAlerts();
  res.json({ data, meta: { total: data.length } });
}));

export default router;
