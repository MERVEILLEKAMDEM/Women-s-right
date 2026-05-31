import { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { api } from '../api/client';
import type { CountryWithLaws, Law } from '../types';

interface ArsenalProps {
  country: CountryWithLaws | null;
}

type Tab = 'femme' | 'enfant' | 'vbg';

const TAB_LABELS: Record<Tab, string> = {
  femme: 'Protection de la Femme',
  enfant: "Droits de l'Enfant",
  vbg: 'Lutte contre les VBG',
};

export default function Arsenal({ country }: ArsenalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('femme');
  const [expandedLaw, setExpandedLaw] = useState<string | null>(null);
  const [lawDetails, setLawDetails] = useState<Record<string, Law>>({});

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

  const toggleLaw = async (law: Law) => {
    if (expandedLaw === law.id) {
      setExpandedLaw(null);
      return;
    }
    setExpandedLaw(law.id);
    if (!lawDetails[law.id]) {
      try {
        const detail = await api.getLaw(law.id);
        setLawDetails(prev => ({ ...prev, [law.id]: detail }));
      } catch {
        setLawDetails(prev => ({ ...prev, [law.id]: law }));
      }
    }
  };

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
        {laws.map(law => {
          const detail = lawDetails[law.id] ?? law;
          return (
            <div key={law.id} className="law-item">
              <div className="law-header" onClick={() => toggleLaw(law)}>
                <div className="law-left">
                  <span className="law-type-badge">{law.type}</span>
                  <span className="law-title">{law.title}</span>
                </div>
                {expandedLaw === law.id
                  ? <ChevronUp size={16} className="law-chevron" />
                  : <ChevronDown size={16} className="law-chevron" />
                }
              </div>
              {expandedLaw === law.id && (
                <div className="law-detail">
                  <p className="law-summary-label">Résumé vulgarisé</p>
                  <p className="law-summary">{detail.summary}</p>
                  <p className="law-meta">
                    Catégorie : {TAB_LABELS[activeTab]} · Pays : {country.name}
                    {detail.viewCount > 0 && ` · ${detail.viewCount} consultations`}
                  </p>
                  <a
                    href={api.downloadDocument(law.id)}
                    className="law-download-btn"
                    download
                    onClick={e => e.stopPropagation()}
                  >
                    <Download size={14} /> Télécharger le document source (PDF)
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
