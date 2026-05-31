import { Router } from 'express';
import * as db from '../db/repository.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { paramAsString } from '../utils/params.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { search, region, theme } = req.query;
  const { countries, regions } = await db.findCountries({
    search: typeof search === 'string' ? search : undefined,
    region: typeof region === 'string' ? region : undefined,
    theme: typeof theme === 'string' ? theme : undefined,
  });

  res.json({
    data: countries,
    meta: { total: countries.length, regions },
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = paramAsString(req.params.id);
  const country = await db.findCountryWithLaws(id);
  if (!country) {
    res.status(404).json({ error: 'Pays non trouvé' });
    return;
  }
  await db.incrementCountryView(id);
  res.json({ data: country });
}));

router.get('/:id/focal-point', asyncHandler(async (req, res) => {
  const id = paramAsString(req.params.id);
  const country = await db.findCountryById(id);
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
}));

export default router;
