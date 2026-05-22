import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Country } from '../data/countries';

interface ArsenalProps {
  country: Country | null;
}

type Tab = 'femme' | 'enfant' | 'vbg';

const TAB_LABELS: Record<Tab, string> = {
  femme: 'Protection de la Femme',
  enfant: "Droits de l'Enfant",
  vbg: 'Lutte contre les VBG',
};

export default function Arsenal({ country }: ArsenalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('femme');
  const [expandedLaw, setExpandedLaw] = useState<number | null>(null);

  if (!country) {
    return (
      <div className="arsenal-panel arsenal-empty">
        <div className="arsenal-placeholder">
          <div className="placeholder-icon">⚖️</div>
          <p>Sélectionnez un pays sur la carte pour consulter son arsenal juridique</p>
        </div>
      </div>
    );
  }

  const laws = country.laws[activeTab];

  return (
    <div className="arsenal-panel">
      <div className="arsenal-header">
        <h2 className="arsenal-title">Arsenal Juridique - {country.name}</h2>
        <p className="arsenal-focal">
          Point focal: {country.focalPoint} (
          <a href={`mailto:${country.email}`} className="arsenal-email">{country.email}</a>
          )
        </p>
      </div>

      <div className="arsenal-tabs">
        {(Object.keys(TAB_LABELS) as Tab[]).map(tab => {
          const count = country.laws[tab].length;
          return (
            <button
              key={tab}
              className={`arsenal-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setExpandedLaw(null); }}
            >
              <span className="tab-label">{TAB_LABELS[tab]}</span>
              <span className="tab-count">({count} lois)</span>
            </button>
          );
        })}
      </div>

      <div className="arsenal-laws">
        {laws.map((law, i) => (
          <div key={i} className="law-item">
            <div
              className="law-header"
              onClick={() => setExpandedLaw(expandedLaw === i ? null : i)}
            >
              <div className="law-left">
                <span className="law-type-badge">{law.type}</span>
                <span className="law-title">{law.title}</span>
              </div>
              {expandedLaw === i
                ? <ChevronUp size={16} className="law-chevron" />
                : <ChevronDown size={16} className="law-chevron" />
              }
            </div>
            {expandedLaw === i && (
              <div className="law-detail">
                <p>Texte de loi relatif à : <strong>{law.title}</strong></p>
                <p className="law-meta">Catégorie : {TAB_LABELS[activeTab]} · Pays : {country.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
