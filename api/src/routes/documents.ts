import { Router } from 'express';
import * as db from '../db/repository.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { paramAsString } from '../utils/params.js';

const router = Router();

router.get('/:lawId/pdf', asyncHandler(async (req, res) => {
  const law = await db.findLawById(paramAsString(req.params.lawId));
  if (!law) {
    res.status(404).json({ error: 'Document non trouvé' });
    return;
  }

  const country = await db.findCountryById(law.countryId);
  const content = `
MAP-PROTECT — Document Officiel
================================
Pays : ${country?.name ?? law.countryId}
Catégorie : ${law.category}
Type : ${law.type}
Titre : ${law.title}

Résumé vulgarisé :
${law.summary}

---
Manifeste Paris 2026 — HCS-M26
Ce document est un placeholder. Le PDF officiel sera intégré par le CMS.
  `.trim();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${law.id}.txt"`);
  res.send(content);
}));

export default router;
