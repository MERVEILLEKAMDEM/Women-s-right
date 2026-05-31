export type LawCategory = 'femme' | 'enfant' | 'vbg';

export interface Law {
  id: string;
  countryId: string;
  category: LawCategory;
  type: string;
  title: string;
  summary: string;
  fullText?: string;
  themes: string[];
  pdfUrl?: string;
  status: 'active' | 'draft';
  viewCount: number;
}

export interface Country {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  focalPoint: string;
  email: string;
  phone?: string;
  viewCount: number;
}

export interface CountryWithLaws extends Country {
  laws: {
    femme: Law[];
    enfant: Law[];
    vbg: Law[];
  };
}

export interface EmergencyAlert {
  id: string;
  anonymousId: string;
  countryId?: string;
  lat?: number;
  lng?: number;
  message?: string;
  status: 'open' | 'resolved';
  level: 'high' | 'medium' | 'low';
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminAlert {
  id: string;
  country: string;
  type: 'Urgence' | 'Alerte' | 'Info';
  message: string;
  date: string;
  level: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved';
}

export interface DashboardStats {
  totalVisits: number;
  uniqueUsers: number;
  emergencyAlerts: number;
  countryCount: number;
  topCountries: { name: string; views: number }[];
  topLaws: { title: string; views: number }[];
  topThemes: { label: string; searches: number; trend: number }[];
  lawCounts: { femme: number; enfant: number; vbg: number };
}

export interface CreateLawInput {
  countryId: string;
  category: LawCategory;
  type: string;
  title: string;
  summary: string;
  fullText?: string;
  themes?: string[];
  pdfUrl?: string;
  status?: 'active' | 'draft';
}

export interface UpdateLawInput extends Partial<CreateLawInput> {}

export interface EmergencyInput {
  lat?: number;
  lng?: number;
  countryId?: string;
  message?: string;
}

export const REGIONS = [
  'Toutes les régions',
  'Afrique',
  'Europe',
  'Amériques',
  'Moyen-Orient',
  'Asie',
] as const;

export const THEMES = [
  'Toutes thématiques',
  'Protection de la Femme',
  "Droits de l'Enfant",
  'Lutte contre les VBG',
  'Mariage précoce',
  'Équité salariale',
  'Violence domestique',
  'Harcèlement sexuel',
  'MGF',
] as const;

export const THEME_TO_CATEGORY: Record<string, LawCategory | null> = {
  'Toutes thématiques': null,
  'Protection de la Femme': 'femme',
  "Droits de l'Enfant": 'enfant',
  'Lutte contre les VBG': 'vbg',
  'Mariage précoce': 'enfant',
  'Équité salariale': 'femme',
  'Violence domestique': 'vbg',
  'Harcèlement sexuel': 'vbg',
  MGF: 'vbg',
};
