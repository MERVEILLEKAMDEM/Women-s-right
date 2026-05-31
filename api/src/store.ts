import { v4 as uuidv4 } from 'uuid';
import type {
  AdminAlert,
  Country,
  CountryWithLaws,
  DashboardStats,
  EmergencyAlert,
  Law,
  LawCategory,
} from './types.js';

function lawId(countryId: string, category: LawCategory, index: number): string {
  return `${countryId}-${category}-${index + 1}`;
}

function buildSummary(title: string, category: LawCategory): string {
  const intro: Record<LawCategory, string> = {
    femme: 'Cette loi protège les droits des femmes et garantit leur sécurité.',
    enfant: "Cette loi défend les droits fondamentaux de l'enfant et sa protection.",
    vbg: 'Cette loi permet de lutter contre les violences basées sur le genre et d\'aider les victimes.',
  };
  return `${intro[category]} En résumé : ${title}. Contactez le point focal HCS-M26 de votre pays pour en savoir plus.`;
}

const RAW_COUNTRIES: Omit<Country, 'viewCount'>[] = [
  { id: 'cm', name: 'Cameroun', region: 'Afrique', lat: 3.848, lng: 11.502, focalPoint: 'Point focal Cameroun', email: 'cameroun@hcs-m26.org', phone: '+237 222 231 107' },
  { id: 'sn', name: 'Sénégal', region: 'Afrique', lat: 14.497, lng: -14.452, focalPoint: 'Point focal Sénégal', email: 'senegal@hcs-m26.org', phone: '+221 33 822 00 00' },
  { id: 'ci', name: "Côte d'Ivoire", region: 'Afrique', lat: 7.539, lng: -5.547, focalPoint: 'Point focal CI', email: 'cotedivoire@hcs-m26.org' },
  { id: 'ma', name: 'Maroc', region: 'Afrique', lat: 31.791, lng: -7.092, focalPoint: 'Point focal Maroc', email: 'maroc@hcs-m26.org', phone: '8007' },
  { id: 'tn', name: 'Tunisie', region: 'Afrique', lat: 33.886, lng: 9.537, focalPoint: 'Point focal Tunisie', email: 'tunisie@hcs-m26.org', phone: '1899' },
  { id: 'dz', name: 'Algérie', region: 'Afrique', lat: 28.033, lng: 1.659, focalPoint: 'Point focal Algérie', email: 'algerie@hcs-m26.org' },
  { id: 'ga', name: 'Gabon', region: 'Afrique', lat: -0.803, lng: 11.609, focalPoint: 'Point focal Gabon', email: 'gabon@hcs-m26.org' },
  { id: 'bf', name: 'Burkina Faso', region: 'Afrique', lat: 12.364, lng: -1.533, focalPoint: 'Point focal Burkina', email: 'burkina@hcs-m26.org' },
  { id: 'ml', name: 'Mali', region: 'Afrique', lat: 17.57, lng: -3.996, focalPoint: 'Point focal Mali', email: 'mali@hcs-m26.org' },
  { id: 'gn', name: 'Guinée', region: 'Afrique', lat: 9.945, lng: -9.696, focalPoint: 'Point focal Guinée', email: 'guinee@hcs-m26.org' },
  { id: 'td', name: 'Tchad', region: 'Afrique', lat: 15.454, lng: 18.732, focalPoint: 'Point focal Tchad', email: 'tchad@hcs-m26.org' },
  { id: 'ne', name: 'Niger', region: 'Afrique', lat: 17.607, lng: 8.081, focalPoint: 'Point focal Niger', email: 'niger@hcs-m26.org' },
  { id: 'fr', name: 'France', region: 'Europe', lat: 46.227, lng: 2.213, focalPoint: 'Fanta Bayo LEVEQUE', email: 'fanta.bayo@hcs-m26.org', phone: '3919' },
  { id: 'be', name: 'Belgique', region: 'Europe', lat: 50.503, lng: 4.469, focalPoint: 'Point focal Belgique', email: 'belgique@hcs-m26.org' },
  { id: 'ch', name: 'Suisse', region: 'Europe', lat: 46.818, lng: 8.228, focalPoint: 'Point focal Suisse', email: 'suisse@hcs-m26.org' },
  { id: 'ca', name: 'Canada', region: 'Amériques', lat: 56.13, lng: -106.346, focalPoint: 'Point focal Canada', email: 'canada@hcs-m26.org' },
  { id: 'br', name: 'Brésil', region: 'Amériques', lat: -14.235, lng: -51.925, focalPoint: 'Point focal Brésil', email: 'bresil@hcs-m26.org' },
  { id: 'lb', name: 'Liban', region: 'Moyen-Orient', lat: 33.854, lng: 35.862, focalPoint: 'Point focal Liban', email: 'liban@hcs-m26.org' },
  { id: 'jo', name: 'Jordanie', region: 'Moyen-Orient', lat: 30.585, lng: 36.238, focalPoint: 'Point focal Jordanie', email: 'jordanie@hcs-m26.org' },
  { id: 'vn', name: 'Vietnam', region: 'Asie', lat: 14.058, lng: 108.277, focalPoint: 'Céline N. Razafindehibe', email: 'celine.razafindehibe@hcs-m26.org' },
];

const RAW_LAWS: Record<string, { femme: { type: string; title: string; themes?: string[] }[]; enfant: { type: string; title: string; themes?: string[] }[]; vbg: { type: string; title: string; themes?: string[] }[] }> = {
  cm: { femme: [{ type: 'Code pénal', title: 'Code pénal - Violence conjugale', themes: ['Violence domestique'] }], enfant: [{ type: 'Loi', title: "Loi sur la protection de l'enfant", themes: ['Mariage précoce'] }], vbg: [{ type: 'Décret', title: 'Décret anti-VBG 2023', themes: ['Violence domestique'] }] },
  sn: { femme: [{ type: 'Loi', title: "Loi sur l'égalité de genre", themes: ['Équité salariale'] }], enfant: [{ type: 'Code', title: "Code de l'enfant" }], vbg: [{ type: 'Loi', title: 'Loi contre les violences basées sur le genre', themes: ['Violence domestique'] }] },
  ci: { femme: [{ type: 'Code pénal', title: 'Dispositions sur les droits de la femme' }], enfant: [{ type: 'Loi', title: "Protection de l'enfance", themes: ['Mariage précoce'] }], vbg: [{ type: 'Loi', title: 'Lutte contre les mutilations génitales', themes: ['MGF'] }] },
  ma: { femme: [{ type: 'Moudawwana', title: 'Code de la famille réformé' }], enfant: [{ type: 'Loi', title: "Droits de l'enfant" }], vbg: [{ type: 'Loi 103-13', title: 'Lutte contre les violences faites aux femmes', themes: ['Violence domestique', 'Harcèlement sexuel'] }] },
  tn: { femme: [{ type: 'Loi organique', title: 'Loi 2017-58 contre les violences' }], enfant: [{ type: 'Code', title: "Code de protection de l'enfant" }], vbg: [{ type: 'Décret', title: 'Mécanismes de protection VBG' }] },
  dz: { femme: [{ type: 'Code de la famille', title: 'Droits des femmes mariées' }], enfant: [{ type: 'Loi', title: "Protection de l'enfance 2015" }], vbg: [{ type: 'Code pénal', title: 'Article 266 - violences conjugales', themes: ['Violence domestique'] }] },
  ga: { femme: [{ type: 'Loi', title: 'Égalité homme-femme', themes: ['Équité salariale'] }], enfant: [{ type: 'Code civil', title: "Droits de l'enfant gabonais" }], vbg: [{ type: 'Loi', title: 'Prévention et répression des VBG' }] },
  bf: { femme: [{ type: 'Code des personnes', title: 'Droits de la femme' }], enfant: [{ type: 'Loi', title: "Code de l'enfant burkinabè" }], vbg: [{ type: 'Loi', title: 'Lutte contre les violences', themes: ['MGF'] }] },
  ml: { femme: [{ type: 'Loi', title: 'Protection des droits des femmes' }], enfant: [{ type: 'Code de protection', title: 'Enfant 2002', themes: ['Mariage précoce'] }], vbg: [{ type: 'Décret', title: 'Stratégie nationale contre les VBG' }] },
  gn: { femme: [{ type: 'Code pénal', title: 'Interdiction des MGF', themes: ['MGF'] }], enfant: [{ type: 'Loi', title: "Droits de l'enfant guinéen" }], vbg: [{ type: 'Loi', title: 'Violence basée sur le genre' }] },
  td: { femme: [{ type: 'Code pénal', title: 'Protection de la femme' }], enfant: [{ type: 'Loi', title: 'Protection enfants Tchad' }], vbg: [{ type: 'Stratégie', title: 'Plan national VBG' }] },
  ne: { femme: [{ type: 'Code civil', title: 'Droits des femmes' }], enfant: [{ type: 'Ordonnance', title: "Protection de l'enfant", themes: ['Mariage précoce'] }], vbg: [{ type: "Plan d'action", title: 'VBG Niger 2022' }] },
  fr: { femme: [{ type: 'Loi', title: 'Loi contre les violences conjugales 2020', themes: ['Violence domestique'] }], enfant: [{ type: 'Code civil', title: "Protection de l'enfant" }], vbg: [{ type: 'Loi Schiappa', title: 'Contre les violences sexistes', themes: ['Harcèlement sexuel'] }] },
  be: { femme: [{ type: 'Loi', title: 'Égalité des genres', themes: ['Équité salariale'] }], enfant: [{ type: 'Décret', title: "Droits de l'enfant" }], vbg: [{ type: 'Loi', title: 'Plan national VBG Belgique' }] },
  ch: { femme: [{ type: 'Code civil', title: 'Égalité femme-homme' }], enfant: [{ type: 'Loi fédérale', title: "Protection de l'enfance" }], vbg: [{ type: 'Loi', title: 'Lutte contre la violence domestique', themes: ['Violence domestique'] }] },
  ca: { femme: [{ type: 'Loi fédérale', title: "Loi sur l'équité en matière d'emploi", themes: ['Équité salariale'] }], enfant: [{ type: 'Loi', title: 'Code criminel - enfants' }], vbg: [{ type: 'Stratégie', title: 'Stratégie fédérale VBG' }] },
  br: { femme: [{ type: 'Loi Maria da Penha', title: 'Contre la violence domestique', themes: ['Violence domestique'] }], enfant: [{ type: 'ECA', title: "Statut de l'enfant et de l'adolescent" }], vbg: [{ type: 'Loi 13.772', title: 'Violation de la vie privée' }] },
  lb: { femme: [{ type: 'Loi 293', title: 'Protection des femmes de la violence' }], enfant: [{ type: 'Code pénal', title: "Protection de l'enfant" }], vbg: [{ type: 'Loi', title: 'Violence domestique Liban', themes: ['Violence domestique'] }] },
  jo: { femme: [{ type: 'Loi', title: 'Protection contre la violence familiale' }], enfant: [{ type: 'Loi', title: 'Droit de la famille - enfants' }], vbg: [{ type: 'Stratégie', title: 'VBG Jordanie 2021' }] },
  vn: { femme: [{ type: 'Loi', title: "Loi sur l'égalité des genres 2006", themes: ['Équité salariale'] }], enfant: [{ type: 'Loi', title: 'Enfance 2016' }], vbg: [{ type: 'Loi', title: 'Prévention violences domestiques', themes: ['Violence domestique'] }] },
};

function seedLaws(): Law[] {
  const laws: Law[] = [];
  const viewSeeds: Record<string, number> = {
    'fr-femme-1': 892, 'sn-femme-1': 745, 'ma-vbg-1': 678, 'bf-enfant-1': 534, 'ci-vbg-1': 467,
  };

  for (const [countryId, categories] of Object.entries(RAW_LAWS)) {
    for (const category of ['femme', 'enfant', 'vbg'] as LawCategory[]) {
      categories[category].forEach((raw, index) => {
        const id = lawId(countryId, category, index);
        laws.push({
          id,
          countryId,
          category,
          type: raw.type,
          title: raw.title,
          summary: buildSummary(raw.title, category),
          themes: raw.themes ?? [],
          pdfUrl: `/api/documents/${id}/pdf`,
          status: countryId === 'cm' && category === 'enfant' ? 'draft' : 'active',
          viewCount: viewSeeds[id] ?? Math.floor(Math.random() * 200) + 50,
        });
      });
    }
  }
  return laws;
}

const countryViewSeeds: Record<string, number> = {
  fr: 3245, sn: 2891, cm: 1834, ci: 1523, ma: 1200,
};

export const store = {
  countries: RAW_COUNTRIES.map(c => ({
    ...c,
    viewCount: countryViewSeeds[c.id] ?? Math.floor(Math.random() * 800) + 200,
  })) as Country[],

  laws: seedLaws(),

  emergencyAlerts: [] as EmergencyAlert[],

  adminAlerts: [
    { id: '1', country: 'Sénégal', type: 'Urgence', message: 'Augmentation signalements mariages forcés — région de Ziguinchor', date: '2025-05-15', level: 'high', status: 'open' },
    { id: '2', country: 'Mali', type: 'Alerte', message: 'Recrudescence MGF signalée dans 3 cercles du sud', date: '2025-05-12', level: 'high', status: 'open' },
    { id: '3', country: 'France', type: 'Info', message: 'Nouvelle jurisprudence sur les violences économiques dans le couple', date: '2025-05-10', level: 'medium', status: 'resolved' },
    { id: '4', country: 'Maroc', type: 'Alerte', message: "Signalements en hausse de violences conjugales post-Ramadan", date: '2025-05-08', level: 'medium', status: 'open' },
    { id: '5', country: 'Cameroun', type: 'Info', message: "Nouvelle circulaire ministérielle sur l'application de la loi VBG", date: '2025-05-05', level: 'low', status: 'resolved' },
  ] as AdminAlert[],

  totalVisits: 15234,
  uniqueUsers: 8456,
  themeSearches: {
    'Violence domestique': 1234,
    'Mariage précoce': 987,
    'Équité salariale': 756,
    'Harcèlement sexuel': 623,
    MGF: 445,
  } as Record<string, number>,
};

export function getCountryById(id: string): Country | undefined {
  return store.countries.find(c => c.id === id);
}

export function getLawsForCountry(countryId: string): Law[] {
  return store.laws.filter(l => l.countryId === countryId);
}

export function getCountryWithLaws(id: string): CountryWithLaws | undefined {
  const country = getCountryById(id);
  if (!country) return undefined;

  const laws = getLawsForCountry(id);
  return {
    ...country,
    laws: {
      femme: laws.filter(l => l.category === 'femme'),
      enfant: laws.filter(l => l.category === 'enfant'),
      vbg: laws.filter(l => l.category === 'vbg'),
    },
  };
}

export function incrementLawView(lawId: string): Law | undefined {
  const law = store.laws.find(l => l.id === lawId);
  if (law) {
    law.viewCount += 1;
    store.totalVisits += 1;
  }
  return law;
}

export function incrementCountryView(countryId: string): Country | undefined {
  const country = getCountryById(countryId);
  if (country) {
    country.viewCount += 1;
    store.totalVisits += 1;
  }
  return country;
}

export function createEmergencyAlert(input: {
  lat?: number;
  lng?: number;
  countryId?: string;
  message?: string;
}): EmergencyAlert {
  const alert: EmergencyAlert = {
    id: uuidv4(),
    anonymousId: uuidv4().slice(0, 8),
    countryId: input.countryId,
    lat: input.lat,
    lng: input.lng,
    message: input.message,
    status: 'open',
    level: 'high',
    createdAt: new Date().toISOString(),
  };
  store.emergencyAlerts.push(alert);
  return alert;
}

export function getDashboardStats(): DashboardStats {
  const topCountries = [...store.countries]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
    .map(c => ({ name: c.name, views: c.viewCount }));

  const topLaws = [...store.laws]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
    .map(l => {
      const country = getCountryById(l.countryId);
      return { title: `${l.title} (${country?.name ?? l.countryId})`, views: l.viewCount };
    });

  const topThemes = Object.entries(store.themeSearches)
    .sort(([, a], [, b]) => b - a)
    .map(([label, searches]) => ({
      label,
      searches,
      trend: Math.floor(Math.random() * 15) + 8,
    }));

  const lawCounts = {
    femme: store.laws.filter(l => l.category === 'femme').length,
    enfant: store.laws.filter(l => l.category === 'enfant').length,
    vbg: store.laws.filter(l => l.category === 'vbg').length,
  };

  return {
    totalVisits: store.totalVisits,
    uniqueUsers: store.uniqueUsers,
    emergencyAlerts: store.emergencyAlerts.filter(a => a.status === 'open').length,
    countryCount: store.countries.length,
    topCountries,
    topLaws,
    topThemes,
    lawCounts,
  };
}

export function anonymizeAlert(alert: EmergencyAlert) {
  return {
    id: alert.id,
    anonymousId: alert.anonymousId,
    countryId: alert.countryId,
    status: alert.status,
    level: alert.level,
    createdAt: alert.createdAt,
    hasLocation: !!(alert.lat && alert.lng),
  };
}
