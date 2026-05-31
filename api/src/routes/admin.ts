import { Router } from 'express';
import { anonymizeAlert, getCountryById, getDashboardStats, store } from '../store.js';
import { createLawRouter } from './laws.js';

const router = Router();

router.get('/stats', (_req, res) => {
  res.json({ data: getDashboardStats() });
});

router.get('/laws', (_req, res) => {
  const laws = store.laws.map(l => ({
    id: l.id,
    country: getCountryById(l.countryId)?.name ?? l.countryId,
    countryId: l.countryId,
    category: l.category === 'femme' ? 'Femme' : l.category === 'enfant' ? 'Enfant' : 'VBG',
    title: l.title,
    type: l.type,
    status: l.status,
    viewCount: l.viewCount,
  }));
  res.json({ data: laws });
});

router.use('/laws', createLawRouter(true));

router.get('/alerts', (_req, res) => {
  res.json({ data: store.adminAlerts });
});

router.post('/alerts', (req, res) => {
  const { country, type, message, level } = req.body;
  if (!country || !type || !message) {
    res.status(400).json({ error: 'Champs requis: country, type, message' });
    return;
  }
  const alert = {
    id: String(store.adminAlerts.length + 1),
    country,
    type,
    message,
    date: new Date().toISOString().slice(0, 10),
    level: level ?? 'medium',
    status: 'open' as const,
  };
  store.adminAlerts.unshift(alert);
  res.status(201).json({ data: alert });
});

router.patch('/alerts/:id/resolve', (req, res) => {
  const alert = store.adminAlerts.find(a => a.id === req.params.id);
  if (!alert) {
    res.status(404).json({ error: 'Alerte non trouvée' });
    return;
  }
  alert.status = 'resolved';
  res.json({ data: alert });
});

router.get('/emergencies', (_req, res) => {
  res.json({
    data: store.emergencyAlerts.map(anonymizeAlert),
    meta: { total: store.emergencyAlerts.length },
  });
});

export default router;
