import { Router } from 'express';
import { getCountryById, incrementLawView, store } from '../store.js';
import { THEME_TO_CATEGORY } from '../types.js';
import type { LawCategory } from '../types.js';

const router = Router();

router.get('/', (req, res) => {
  const { countryId, category, theme, search, status } = req.query;
  let laws = [...store.laws];

  if (countryId && typeof countryId === 'string') {
    laws = laws.filter(l => l.countryId === countryId);
  }

  if (category && typeof category === 'string') {
    laws = laws.filter(l => l.category === category);
  }

  if (theme && typeof theme === 'string' && theme !== 'Toutes thématiques') {
    const cat = THEME_TO_CATEGORY[theme];
    if (cat) {
      laws = laws.filter(l => l.category === cat || l.themes.includes(theme));
    } else {
      laws = laws.filter(l => l.themes.includes(theme));
    }
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    laws = laws.filter(
      l => l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q),
    );
  }

  if (status && typeof status === 'string') {
    laws = laws.filter(l => l.status === status);
  }

  const enriched = laws.map(l => ({
    ...l,
    countryName: getCountryById(l.countryId)?.name,
  }));

  res.json({ data: enriched, meta: { total: enriched.length } });
});

router.get('/:id', (req, res) => {
  const law = incrementLawView(req.params.id);
  if (!law) {
    res.status(404).json({ error: 'Loi non trouvée' });
    return;
  }
  const country = getCountryById(law.countryId);
  res.json({
    data: {
      ...law,
      countryName: country?.name,
      focalPoint: country ? { name: country.focalPoint, email: country.email } : null,
    },
  });
});

router.post('/:id/view', (req, res) => {
  const law = incrementLawView(req.params.id);
  if (!law) {
    res.status(404).json({ error: 'Loi non trouvée' });
    return;
  }
  res.json({ data: { viewCount: law.viewCount } });
});

export default router;

export function createLawRouter(admin = false) {
  const r = Router();

  if (admin) {
    r.post('/', (req, res) => {
      const { countryId, category, type, title, summary, fullText, themes, pdfUrl, status } = req.body;

      if (!countryId || !category || !type || !title || !summary) {
        res.status(400).json({ error: 'Champs requis: countryId, category, type, title, summary' });
        return;
      }

      if (!getCountryById(countryId)) {
        res.status(400).json({ error: 'Pays invalide' });
        return;
      }

      const existing = store.laws.filter(l => l.countryId === countryId && l.category === category);
      const id = `${countryId}-${category}-${existing.length + 1}`;

      const law = {
        id,
        countryId,
        category: category as LawCategory,
        type,
        title,
        summary,
        fullText,
        themes: themes ?? [],
        pdfUrl: pdfUrl ?? `/api/documents/${id}/pdf`,
        status: status ?? 'draft',
        viewCount: 0,
      };

      store.laws.push(law);
      res.status(201).json({ data: law });
    });

    r.put('/:id', (req, res) => {
      const index = store.laws.findIndex(l => l.id === req.params.id);
      if (index === -1) {
        res.status(404).json({ error: 'Loi non trouvée' });
        return;
      }
      store.laws[index] = { ...store.laws[index], ...req.body, id: req.params.id };
      res.json({ data: store.laws[index] });
    });

    r.delete('/:id', (req, res) => {
      const index = store.laws.findIndex(l => l.id === req.params.id);
      if (index === -1) {
        res.status(404).json({ error: 'Loi non trouvée' });
        return;
      }
      const removed = store.laws.splice(index, 1)[0];
      res.json({ data: removed });
    });
  }

  return r;
}
