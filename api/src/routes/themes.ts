import { Router } from 'express';
import { REGIONS, THEMES } from '../types.js';
import { store } from '../store.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    data: {
      regions: REGIONS,
      themes: THEMES,
      themeCounts: Object.fromEntries(
        THEMES.filter(t => t !== 'Toutes thématiques').map(theme => {
          const count = store.laws.filter(
            l =>
              l.themes.includes(theme) ||
              (theme === 'Protection de la Femme' && l.category === 'femme') ||
              (theme === "Droits de l'Enfant" && l.category === 'enfant') ||
              (theme === 'Lutte contre les VBG' && l.category === 'vbg'),
          ).length;
          return [theme, count];
        }),
      ),
    },
  });
});

export default router;
