import { Router } from 'express';
import * as db from '../db/repository.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { paramAsString } from '../utils/params.js';
import type { LawCategory } from '../types.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { countryId, category, theme, search, status } = req.query;
  const laws = await db.findLaws({
    countryId: typeof countryId === 'string' ? countryId : undefined,
    category: typeof category === 'string' ? category : undefined,
    theme: typeof theme === 'string' ? theme : undefined,
    search: typeof search === 'string' ? search : undefined,
    status: typeof status === 'string' ? status : undefined,
  });
  res.json({ data: laws, meta: { total: laws.length } });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = paramAsString(req.params.id);
  const law = await db.incrementLawView(id);
  if (!law) {
    res.status(404).json({ error: 'Loi non trouvée' });
    return;
  }
  const country = await db.findCountryById(law.countryId);
  res.json({
    data: {
      ...law,
      countryName: country?.name,
      focalPoint: country ? { name: country.focalPoint, email: country.email } : null,
    },
  });
}));

router.post('/:id/view', asyncHandler(async (req, res) => {
  const id = paramAsString(req.params.id);
  const law = await db.incrementLawView(id);
  if (!law) {
    res.status(404).json({ error: 'Loi non trouvée' });
    return;
  }
  res.json({ data: { viewCount: law.viewCount } });
}));

export default router;

export function createLawRouter(admin = false) {
  const r = Router();

  if (admin) {
    r.post('/', asyncHandler(async (req, res) => {
      const { countryId, category, type, title, summary, fullText, themes, pdfUrl, status } = req.body;

      if (!countryId || !category || !type || !title || !summary) {
        res.status(400).json({ error: 'Champs requis: countryId, category, type, title, summary' });
        return;
      }

      const country = await db.findCountryById(countryId);
      if (!country) {
        res.status(400).json({ error: 'Pays invalide' });
        return;
      }

      const law = await db.createLaw({
        countryId,
        category: category as LawCategory,
        type,
        title,
        summary,
        fullText,
        themes,
        pdfUrl,
        status,
      });
      res.status(201).json({ data: law });
    }));

    r.put('/:id', asyncHandler(async (req, res) => {
      const id = paramAsString(req.params.id);
      const law = await db.updateLaw(id, req.body);
      if (!law) {
        res.status(404).json({ error: 'Loi non trouvée' });
        return;
      }
      res.json({ data: law });
    }));

    r.delete('/:id', asyncHandler(async (req, res) => {
      const id = paramAsString(req.params.id);
      const law = await db.deleteLaw(id);
      if (!law) {
        res.status(404).json({ error: 'Loi non trouvée' });
        return;
      }
      res.json({ data: law });
    }));
  }

  return r;
}
