import { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import Arsenal from './components/Arsenal';
import StatsBar from './components/StatsBar';
import VBGModal from './components/VBGModal';
import AdminModal from './components/AdminModal';
import { COUNTRIES } from './data/countries';
import type { Country } from './data/countries';
import './App.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [selectedTheme, setSelectedTheme] = useState('Toutes thématiques');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(COUNTRIES[0]);
  const [showVBG, setShowVBG] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => {
      const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion = selectedRegion === 'Toutes les régions' || c.region === selectedRegion;
      return matchSearch && matchRegion;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="app">
      <Header onVBGClick={() => setShowVBG(true)} onAdminClick={() => setShowAdmin(true)} />
      <main className="main-content">
        <Sidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          onVBGClick={() => setShowVBG(true)}
        />
        <MapComponent
          countries={filteredCountries}
          selectedCountry={selectedCountry}
          onCountrySelect={setSelectedCountry}
        />
        <Arsenal country={selectedCountry} />
      </main>
      <StatsBar countryCount={filteredCountries.length} />
      {showVBG && <VBGModal onClose={() => setShowVBG(false)} country={selectedCountry?.name} />}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
