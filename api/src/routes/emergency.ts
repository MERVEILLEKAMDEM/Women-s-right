import { Router } from 'express';
import { anonymizeAlert, createEmergencyAlert, getCountryById, store } from '../store.js';

const router = Router();

const FOCAL_COORDINATORS = [
  { name: 'Fanta Bayo LEVEQUE', email: 'fanta.bayo@hcs-m26.org', role: 'Pilotage et Coordination' },
  { name: 'Céline Nathalie Razafindehibe', email: 'celine.razafindehibe@hcs-m26.org', role: 'Ingénierie, Droits et Parité' },
];

router.post('/', (req, res) => {
  const { lat, lng, countryId, message } = req.body;

  const alert = createEmergencyAlert({ lat, lng, countryId, message });

  const country = countryId ? getCountryById(countryId) : undefined;
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
      ...anonymizeAlert(alert),
      message: 'Alerte transmise aux points focaux. Vous êtes en sécurité — aide en route.',
      emergencyNumber: country?.phone ?? '112',
    },
    notified: notifiedContacts.map(c => ({ name: c.name, role: c.role })),
  });
});

router.get('/contacts', (_req, res) => {
  res.json({
    data: {
      coordinators: FOCAL_COORDINATORS,
      countries: store.countries.map(c => ({
        id: c.id,
        name: c.name,
        focalPoint: c.focalPoint,
        email: c.email,
        phone: c.phone,
      })),
    },
  });
});

export default router;
