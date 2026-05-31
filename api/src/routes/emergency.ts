import { Router } from 'express';
import * as db from '../db/repository.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

const FOCAL_COORDINATORS = [
  { name: 'Fanta Bayo LEVEQUE', email: 'fanta.bayo@hcs-m26.org', role: 'Pilotage et Coordination' },
  { name: 'Céline Nathalie Razafindehibe', email: 'celine.razafindehibe@hcs-m26.org', role: 'Ingénierie, Droits et Parité' },
];

router.post('/', asyncHandler(async (req, res) => {
  const { lat, lng, countryId, message } = req.body;
  const alert = await db.createEmergencyAlert({ lat, lng, countryId, message });

  const country = countryId ? await db.findCountryById(countryId) : null;
  const notifiedContacts = [
    ...FOCAL_COORDINATORS,
    ...(country ? [{ name: country.focalPoint, email: country.email, role: `Point focal ${country.name}` }] : []),
  ];

  console.log('[URGENCE MAP-PROTECT]', {
    anonymousId: alert.anonymousId,
    country: country?.name ?? 'inconnu',
    location: lat && lng ? `${lat}, ${lng}` : 'non fournie',
    notified: notifiedContacts.map(c => c.email),
  });

  res.status(201).json({
    data: {
      ...db.anonymizeAlert(alert),
      message: 'Alerte transmise aux points focaux. Vous êtes en sécurité — aide en route.',
      emergencyNumber: country?.phone ?? '112',
    },
    notified: notifiedContacts.map(c => ({ name: c.name, role: c.role })),
  });
}));

router.get('/contacts', asyncHandler(async (_req, res) => {
  const countries = await db.findAllCountries();
  res.json({
    data: {
      coordinators: FOCAL_COORDINATORS,
      countries: countries.map(c => ({
        id: c.id,
        name: c.name,
        focalPoint: c.focalPoint,
        email: c.email,
        phone: c.phone,
      })),
    },
  });
}));

export default router;
