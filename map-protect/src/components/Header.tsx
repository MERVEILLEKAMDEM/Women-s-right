import { Shield, Menu, BarChart2 } from 'lucide-react';

interface HeaderProps {
  onVBGClick: () => void;
  onAdminClick: () => void;
}

export default function Header({ onVBGClick, onAdminClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <Shield size={22} />
        </div>
        <div className="header-title">
          <span className="header-name">MAP-PROTECT</span>
          <span className="header-subtitle">Manifeste Paris 2026 — Protection des Femmes et des Enfants</span>
        </div>
      </div>
      <div className="header-actions">
        <button className="btn-admin" onClick={onAdminClick}>
          <BarChart2 size={16} />
          ADMINISTRATION
        </button>
        <button className="btn-vbg" onClick={onVBGClick}>
          <Shield size={16} />
          MODULE VBG
        </button>
        <button className="btn-menu">
          MENU <Menu size={16} />
        </button>
      </div>
    </header>
  );
}
