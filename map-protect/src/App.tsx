import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import Arsenal from './components/Arsenal';
import StatsBar from './components/StatsBar';
import VBGModal from './components/VBGModal';
import AdminModal from './components/AdminModal';
import EmergencyButton from './components/EmergencyButton';
import { api } from './api/client';
import type { Country, CountryWithLaws } from './types';
import { COUNTRIES, REGIONS, THEMES } from './data/countries';
import './App.css';

function toFallbackCountries(): CountryWithLaws[] {
  return COUNTRIES.map(c => ({
    ...c,
    viewCount: 0,
    laws: {
      femme: c.laws.femme.map((l, i) => ({
        id: `${c.id}-femme-${i + 1}`,
        countryId: c.id,
        category: 'femme' as const,
        type: l.type,
        title: l.title,
        summary: l.title,
        themes: [],
        status: 'active' as const,
        viewCount: 0,
      })),
      enfant: c.laws.enfant.map((l, i) => ({
        id: `${c.id}-enfant-${i + 1}`,
        countryId: c.id,
        category: 'enfant' as const,
        type: l.type,
        title: l.title,
        summary: l.title,
        themes: [],
        status: 'active' as const,
        viewCount: 0,
      })),
      vbg: c.laws.vbg.map((l, i) => ({
        id: `${c.id}-vbg-${i + 1}`,
        countryId: c.id,
        category: 'vbg' as const,
        type: l.type,
        title: l.title,
        summary: l.title,
        themes: [],
        status: 'active' as const,
        viewCount: 0,
      })),
    },
  }));
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [selectedTheme, setSelectedTheme] = useState('Toutes thématiques');
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryWithLaws | null>(null);
  const [showVBG, setShowVBG] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lawCounts, setLawCounts] = useState({ femme: 0, enfant: 0, vbg: 0 });
  const [regions, setRegions] = useState<string[]>([...REGIONS]);
  const [themes, setThemes] = useState<string[]>([...THEMES]);
  const selectedIdRef = useRef<string | null>(null);

  const loadCountryDetail = useCallback(async (countryId: string) => {
    selectedIdRef.current = countryId;
    try {
      const detailed = await api.getCountry(countryId);
      if (selectedIdRef.current === countryId) {
        setSelectedCountry(detailed);
      }
    } catch {
      const fallback = toFallbackCountries().find(c => c.id === countryId);
      if (fallback && selectedIdRef.current === countryId) {
        setSelectedCountry(fallback);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [list, summary, themesData] = await Promise.all([
          api.getCountries({
            search: searchQuery || undefined,
            region: selectedRegion,
            theme: selectedTheme,
          }),
          api.getStatsSummary(),
          api.getThemes(),
        ]);

        if (cancelled) return;

        setCountries(list);
        setLawCounts(summary.lawCounts);
        setRegions(themesData.regions);
        setThemes(themesData.themes);

        const targetId =
          list.find(c => c.id === selectedIdRef.current)?.id ?? list[0]?.id;

        if (targetId) {
          await loadCountryDetail(targetId);
        } else {
          setSelectedCountry(null);
        }
      } catch {
        if (cancelled) return;
        const fallback = toFallbackCountries();
        setCountries(fallback);
        setSelectedCountry(fallback[0] ?? null);
        selectedIdRef.current = fallback[0]?.id ?? null;
        setLawCounts({
          femme: fallback.reduce((n, c) => n + c.laws.femme.length, 0),
          enfant: fallback.reduce((n, c) => n + c.laws.enfant.length, 0),
          vbg: fallback.reduce((n, c) => n + c.laws.vbg.length, 0),
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [searchQuery, selectedRegion, selectedTheme, loadCountryDetail]);

  const handleCountrySelect = useCallback(async (country: Country) => {
    await loadCountryDetail(country.id);
  }, [loadCountryDetail]);

  return (
    <div className="app">
      <Header onVBGClick={() => setShowVBG(true)} onAdminClick={() => setShowAdmin(true)} />
      {loading && <div className="loading-bar">Chargement de l'arsenal juridique...</div>}
      <main className="main-content">
        <Sidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          onVBGClick={() => setShowVBG(true)}
          regions={regions}
          themes={themes}
        />
        <MapComponent
          countries={countries}
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
        />
        <Arsenal country={selectedCountry} />
      </main>
      <StatsBar countryCount={countries.length} lawCounts={lawCounts} />
      <EmergencyButton countryId={selectedCountry?.id} />
      {showVBG && <VBGModal onClose={() => setShowVBG(false)} country={selectedCountry?.name} />}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
