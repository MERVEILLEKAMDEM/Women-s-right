import { Router } from 'express';
import {
  getCountryById,
  getCountryWithLaws,
  incrementCountryView,
  store,
} from '../store.js';
import { THEME_TO_CATEGORY } from '../types.js';

const router = Router();

router.get('/', (req, res) => {
  const { search, region, theme } = req.query;
  let countries = [...store.countries];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    countries = countries.filter(c => c.name.toLowerCase().includes(q));
  }

  if (region && typeof region === 'string' && region !== 'Toutes les régions') {
    countries = countries.filter(c => c.region === region);
  }

  if (theme && typeof theme === 'string' && theme !== 'Toutes thématiques') {
    const category = THEME_TO_CATEGORY[theme];
    if (category) {
      const countryIds = new Set(
        store.laws
          .filter(l => l.category === category || l.themes.includes(theme))
          .map(l => l.countryId),
      );
      countries = countries.filter(c => countryIds.has(c.id));
    } else if (theme !== 'Toutes thématiques') {
      const countryIds = new Set(
        store.laws.filter(l => l.themes.includes(theme)).map(l => l.countryId),
      );
      countries = countries.filter(c => countryIds.has(c.id));
    }
  }

  res.json({
    data: countries,
    meta: { total: countries.length, regions: [...new Set(store.countries.map(c => c.region))] },
  });
});

router.get('/:id', (req, res) => {
  const country = getCountryWithLaws(req.params.id);
  if (!country) {
    res.status(404).json({ error: 'Pays non trouvé' });
    return;
  }
  incrementCountryView(req.params.id);
  res.json({ data: country });
});

router.get('/:id/focal-point', (req, res) => {
  const country = getCountryById(req.params.id);
  if (!country) {
    res.status(404).json({ error: 'Pays non trouvé' });
    return;
  }
  res.json({
    data: {
      name: country.focalPoint,
      email: country.email,
      phone: country.phone,
      country: country.name,
    },
  });
});

export default router;
