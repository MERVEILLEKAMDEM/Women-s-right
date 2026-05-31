import { Router } from 'express';
import { getDashboardStats, store } from '../store.js';

const router = Router();

router.get('/summary', (_req, res) => {
  res.json({
    data: {
      countryCount: store.countries.length,
      lawCounts: {
        femme: store.laws.filter(l => l.category === 'femme').length,
        enfant: store.laws.filter(l => l.category === 'enfant').length,
        vbg: store.laws.filter(l => l.category === 'vbg').length,
      },
    },
  });
});

router.get('/dashboard', (_req, res) => {
  res.json({ data: getDashboardStats() });
});

export default router;
