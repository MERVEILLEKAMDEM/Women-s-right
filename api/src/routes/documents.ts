import { Router } from 'express';
import { store } from '../store.js';
import { getCountryById } from '../store.js';

const router = Router();

router.get('/:lawId/pdf', (req, res) => {
  const law = store.laws.find(l => l.id === req.params.lawId);
  if (!law) {
    res.status(404).json({ error: 'Document non trouvé' });
    return;
  }

  const country = getCountryById(law.countryId);
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
});

export default router;
