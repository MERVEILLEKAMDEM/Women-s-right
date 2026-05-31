import type {
  AdminAlert,
  AdminLawRow,
  Country,
  CountryWithLaws,
  DashboardStats,
  EmergencyResponse,
  Law,
  ThemesResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY ?? 'map-protect-hcs-m26';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `Erreur API ${res.status}`);
  }

  const json = await res.json();
  return json.data ?? json;
}

function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: {
      'X-API-Key': ADMIN_KEY,
      ...options?.headers,
    },
  });
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  getCountries: (params?: { search?: string; region?: string; theme?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.region) qs.set('region', params.region);
    if (params?.theme) qs.set('theme', params.theme);
    const query = qs.toString();
    return request<Country[]>(`/countries${query ? `?${query}` : ''}`);
  },

  getCountry: (id: string) => request<CountryWithLaws>(`/countries/${id}`),

  getLaw: (id: string) => request<Law>(`/laws/${id}`),

  getThemes: () => request<ThemesResponse>('/themes'),

  getStatsSummary: () =>
    request<{ countryCount: number; lawCounts: { femme: number; enfant: number; vbg: number } }>(
      '/stats/summary',
    ),

  sendEmergency: (payload: {
    lat?: number;
    lng?: number;
    countryId?: string;
    message?: string;
  }) =>
    request<EmergencyResponse>('/emergency', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getEmergencyContacts: () => request<{ coordinators: unknown[]; countries: Country[] }>('/emergency/contacts'),

  downloadDocument: (lawId: string) => `${API_BASE}/documents/${lawId}/pdf`,

  admin: {
    getStats: () => adminRequest<DashboardStats>('/admin/stats'),
    getLaws: () => adminRequest<AdminLawRow[]>('/admin/laws'),
    createLaw: (law: Record<string, unknown>) =>
      adminRequest<Law>('/admin/laws', { method: 'POST', body: JSON.stringify(law) }),
    updateLaw: (id: string, law: Record<string, unknown>) =>
      adminRequest<Law>(`/admin/laws/${id}`, { method: 'PUT', body: JSON.stringify(law) }),
    deleteLaw: (id: string) =>
      adminRequest<Law>(`/admin/laws/${id}`, { method: 'DELETE' }),
    getAlerts: () => adminRequest<AdminAlert[]>('/admin/alerts'),
    resolveAlert: (id: string) =>
      adminRequest<AdminAlert>(`/admin/alerts/${id}/resolve`, { method: 'PATCH' }),
  },
};
