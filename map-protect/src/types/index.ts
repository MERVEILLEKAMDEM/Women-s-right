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
  countryName?: string;
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

export interface AdminLawRow {
  id: string;
  country: string;
  countryId: string;
  category: string;
  title: string;
  type: string;
  status: 'active' | 'draft';
  viewCount: number;
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

export interface EmergencyResponse {
  anonymousId: string;
  message: string;
  emergencyNumber: string;
}

export interface ThemesResponse {
  regions: string[];
  themes: string[];
}
