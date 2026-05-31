import { Search, Shield, X } from 'lucide-react';
interface SidebarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedRegion: string;
  onRegionChange: (val: string) => void;
  selectedTheme: string;
  onThemeChange: (val: string) => void;
  onVBGClick: () => void;
  regions: string[];
  themes: string[];
}

export default function Sidebar({
  searchQuery, onSearchChange,
  selectedRegion, onRegionChange,
  selectedTheme, onThemeChange,
  onVBGClick,
  regions,
  themes,
}: SidebarProps) {
  const activeFilters = [
    selectedRegion !== 'Toutes les régions' ? `Région: ${selectedRegion}` : null,
    selectedTheme !== 'Toutes thématiques' ? selectedTheme : null,
  ].filter(Boolean) as string[];

  const removeFilter = (label: string) => {
    if (label.startsWith('Région:')) onRegionChange('Toutes les régions');
    else onThemeChange('Toutes thématiques');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <div className="sidebar-section-title">
          <span className="filter-icon">≡</span>
          Filtres de recherche
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un pays"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
          <Search size={16} className="search-icon" />
        </div>

        <div className="select-group">
          <label>Région</label>
          <select value={selectedRegion} onChange={e => onRegionChange(e.target.value)}>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="select-group">
          <select value={selectedTheme} onChange={e => onThemeChange(e.target.value)}>
            {themes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {activeFilters.length > 0 && (
          <div className="active-filters">
            {activeFilters.map(f => (
              <span key={f} className="filter-chip">
                {f}
                <button onClick={() => removeFilter(f)}><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-card about-card">
        <div className="about-title">À propos de MAP-PROTECT</div>
        <p className="about-text">
          Cette plateforme recense l'arsenal juridique protégeant les femmes et les enfants dans les{' '}
          <strong>20 pays signataires</strong> du Manifeste Paris 2026.
        </p>
        <a href="#" className="about-link">20 pays signataires</a>
      </div>

      <div className="sidebar-card vbg-card">
        <div className="vbg-header">
          <Shield size={18} className="vbg-shield" />
          <span className="vbg-title">Assistance VBG</span>
        </div>
        <p className="vbg-text">
          Ressources d'assistance immédiate pour les victimes de violences basées sur le genre
        </p>
        <button className="btn-vbg-access" onClick={onVBGClick}>
          <Shield size={14} />
          ACCÉDER AU MODULE VBG
        </button>
      </div>
    </aside>
  );
}
