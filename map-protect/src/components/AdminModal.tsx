import { useState } from 'react';
import { X, BarChart2, BookOpen, AlertTriangle, TrendingUp, Eye, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

interface AdminModalProps {
  onClose: () => void;
}

type AdminTab = 'stats' | 'laws' | 'alerts';

const STATS_TOP_COUNTRIES = [
  { name: 'France', views: 3245, color: '#1565C0' },
  { name: 'Sénégal', views: 2891, color: '#1976D2' },
  { name: 'Madagascar', views: 2156, color: '#1e88e5' },
  { name: 'Cameroun', views: 1834, color: '#42a5f5' },
  { name: "Côte d'Ivoire", views: 1523, color: '#90caf9' },
];

const STATS_TOP_LAWS = [
  { title: 'Loi contre les violences conjugales (France)', views: 892, color: '#e91e63' },
  { title: "Loi sur la parité (Sénégal)", views: 745, color: '#9c27b0' },
  { title: 'Loi VBG 2019 (Madagascar)', views: 678, color: '#673ab7' },
  { title: "Code de l'enfant (Bénin)", views: 534, color: '#3f51b5' },
  { title: 'Loi contre les MGF (Burkina Faso)', views: 467, color: '#7c4dff' },
];

const THEMES = [
  { label: 'Violence domestique', searches: 1234, trend: 10 },
  { label: 'Mariage précoce', searches: 987, trend: 18 },
  { label: 'Équité salariale', searches: 756, trend: 20 },
  { label: 'Harcèlement sexuel', searches: 623, trend: 13 },
  { label: 'MGF', searches: 445, trend: 20 },
];

const LAWS_DATA = [
  { id: 1, country: 'France', category: 'VBG', title: 'Loi contre les violences conjugales 2020', type: 'Loi', status: 'active' },
  { id: 2, country: 'Sénégal', category: 'Femme', title: "Loi sur l'égalité de genre", type: 'Loi', status: 'active' },
  { id: 3, country: 'Maroc', category: 'VBG', title: 'Loi 103-13 Lutte contre les violences', type: 'Loi 103-13', status: 'active' },
  { id: 4, country: 'Tunisie', category: 'VBG', title: "Loi organique 2017-58", type: 'Loi organique', status: 'active' },
  { id: 5, country: 'Cameroun', category: 'Enfant', title: "Loi sur la protection de l'enfant", type: 'Loi', status: 'draft' },
  { id: 6, country: 'Côte d\'Ivoire', category: 'VBG', title: 'Lutte contre les mutilations génitales', type: 'Loi', status: 'active' },
  { id: 7, country: 'Burkina Faso', category: 'Enfant', title: "Code de l'enfant burkinabè", type: 'Code', status: 'active' },
  { id: 8, country: 'Mali', category: 'Femme', title: 'Protection des droits des femmes', type: 'Loi', status: 'draft' },
];

const ALERTS_DATA = [
  { id: 1, country: 'Sénégal', type: 'Urgence', message: 'Augmentation signalements mariages forcés — région de Ziguinchor', date: '2025-05-15', level: 'high', status: 'open' },
  { id: 2, country: 'Mali', type: 'Alerte', message: 'Recrudescence MGF signalée dans 3 cercles du sud', date: '2025-05-12', level: 'high', status: 'open' },
  { id: 3, country: 'France', type: 'Info', message: 'Nouvelle jurisprudence sur les violences économiques dans le couple', date: '2025-05-10', level: 'medium', status: 'resolved' },
  { id: 4, country: 'Maroc', type: 'Alerte', message: "Signalements en hausse de violences conjugales post-Ramadan", date: '2025-05-08', level: 'medium', status: 'open' },
  { id: 5, country: 'Cameroun', type: 'Info', message: "Nouvelle circulaire ministérielle sur l'application de la loi VBG", date: '2025-05-05', level: 'low', status: 'resolved' },
];

export default function AdminModal({ onClose }: AdminModalProps) {
  const [tab, setTab] = useState<AdminTab>('stats');
  const [lawFilter, setLawFilter] = useState('Tous');
  const [alertFilter, setAlertFilter] = useState('Tous');
  const [laws, setLaws] = useState(LAWS_DATA);
  const [alerts, setAlerts] = useState(ALERTS_DATA);

  const maxViews = Math.max(...STATS_TOP_COUNTRIES.map(c => c.views));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-row">
            <BarChart2 size={20} />
            <span>Administration MAP-PROTECT</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {([
            { id: 'stats', label: 'STATISTIQUES', icon: <BarChart2 size={14} /> },
            { id: 'laws', label: 'GESTION DES LOIS', icon: <BookOpen size={14} /> },
            { id: 'alerts', label: "ALERTES D'URGENCE", icon: <AlertTriangle size={14} /> },
          ] as { id: AdminTab; label: string; icon: React.ReactNode }[]).map(t => (
            <button
              key={t.id}
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="admin-content">

          {/* ── STATISTIQUES ── */}
          {tab === 'stats' && (
            <div>
              {/* KPI Cards */}
              <div className="admin-kpi-grid">
                {[
                  { val: '15 234', label: 'Visites totales' },
                  { val: '8 456', label: 'Utilisateurs uniques' },
                  { val: '142', label: "Alertes d'urgence" },
                  { val: '20', label: 'Pays signataires' },
                ].map(k => (
                  <div key={k.label} className="admin-kpi-card">
                    <div className="admin-kpi-val">{k.val}</div>
                    <div className="admin-kpi-label">{k.label}</div>
                  </div>
                ))}
              </div>

              <div className="admin-two-col">
                {/* Top 5 pays */}
                <div className="admin-table-card">
                  <div className="admin-table-title">Top 5 — Pays les plus consultés</div>
                  <table className="admin-table">
                    <thead><tr><th>Pays</th><th>Vues</th></tr></thead>
                    <tbody>
                      {STATS_TOP_COUNTRIES.map(c => (
                        <tr key={c.name}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: '#f0f2f5', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${(c.views / maxViews) * 100}%`, height: '100%', background: c.color, borderRadius: 3 }} />
                            </div>
                            {c.name}
                          </td>
                          <td><span className="admin-badge" style={{ background: c.color }}>{c.views.toLocaleString()}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top 5 lois */}
                <div className="admin-table-card">
                  <div className="admin-table-title">Top 5 — Lois les plus consultées</div>
                  <table className="admin-table">
                    <thead><tr><th>Loi</th><th>Vues</th></tr></thead>
                    <tbody>
                      {STATS_TOP_LAWS.map(l => (
                        <tr key={l.title}>
                          <td style={{ fontSize: 12 }}>{l.title}</td>
                          <td><span className="admin-badge" style={{ background: l.color }}>{l.views}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Thématiques */}
              <div className="admin-table-card" style={{ marginTop: 16 }}>
                <div className="admin-table-title">Thématiques les plus recherchées</div>
                <table className="admin-table">
                  <thead><tr><th>Thématique</th><th>Recherches</th><th>Tendance</th></tr></thead>
                  <tbody>
                    {THEMES.map(t => (
                      <tr key={t.label}>
                        <td>{t.label}</td>
                        <td>{t.searches.toLocaleString()}</td>
                        <td>
                          <span style={{ color: '#2e7d32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <TrendingUp size={12} /> +{t.trend}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── GESTION DES LOIS ── */}
          {tab === 'laws' && (
            <div>
              <div className="admin-toolbar">
                <div className="admin-filter-group">
                  {['Tous', 'Femme', 'Enfant', 'VBG'].map(f => (
                    <button
                      key={f}
                      className={`admin-filter-btn ${lawFilter === f ? 'active' : ''}`}
                      onClick={() => setLawFilter(f)}
                    >{f}</button>
                  ))}
                </div>
                <button className="admin-add-btn">
                  <Plus size={14} /> Ajouter une loi
                </button>
              </div>

              <div className="admin-table-card">
                <table className="admin-table admin-table-full">
                  <thead>
                    <tr>
                      <th>Pays</th>
                      <th>Catégorie</th>
                      <th>Titre</th>
                      <th>Type</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laws
                      .filter(l => lawFilter === 'Tous' || l.category === lawFilter)
                      .map(l => (
                        <tr key={l.id}>
                          <td style={{ fontWeight: 600 }}>{l.country}</td>
                          <td>
                            <span className={`admin-cat-badge admin-cat-${l.category.toLowerCase()}`}>
                              {l.category}
                            </span>
                          </td>
                          <td style={{ fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</td>
                          <td style={{ fontSize: 12, color: '#777' }}>{l.type}</td>
                          <td>
                            <span className={`admin-status-badge ${l.status === 'active' ? 'active' : 'draft'}`}>
                              {l.status === 'active' ? 'Actif' : 'Brouillon'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="admin-action-btn"><Eye size={13} /></button>
                              <button className="admin-action-btn"><Edit2 size={13} /></button>
                              <button
                                className="admin-action-btn admin-action-danger"
                                onClick={() => setLaws(prev => prev.filter(x => x.id !== l.id))}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: '#999' }}>
                {laws.filter(l => lawFilter === 'Tous' || l.category === lawFilter).length} loi(s) affichée(s)
              </div>
            </div>
          )}

          {/* ── ALERTES D'URGENCE ── */}
          {tab === 'alerts' && (
            <div>
              <div className="admin-toolbar">
                <div className="admin-filter-group">
                  {['Tous', 'Ouvertes', 'Résolues'].map(f => (
                    <button
                      key={f}
                      className={`admin-filter-btn ${alertFilter === f ? 'active' : ''}`}
                      onClick={() => setAlertFilter(f)}
                    >{f}</button>
                  ))}
                </div>
                <button className="admin-add-btn admin-add-red">
                  <AlertTriangle size={14} /> Nouvelle alerte
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {alerts
                  .filter(a => {
                    if (alertFilter === 'Ouvertes') return a.status === 'open';
                    if (alertFilter === 'Résolues') return a.status === 'resolved';
                    return true;
                  })
                  .map(a => (
                    <div key={a.id} className={`admin-alert-card admin-alert-${a.level}`}>
                      <div className="admin-alert-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className={`admin-alert-dot admin-dot-${a.level}`} />
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{a.country}</span>
                          <span className={`admin-alert-type-badge admin-type-${a.type.toLowerCase()}`}>{a.type}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: '#999' }}>{a.date}</span>
                          {a.status === 'open' ? (
                            <button
                              className="admin-resolve-btn"
                              onClick={() => setAlerts(prev => prev.map(x => x.id === a.id ? { ...x, status: 'resolved' } : x))}
                            >
                              <CheckCircle size={12} /> Résoudre
                            </button>
                          ) : (
                            <span className="admin-resolved-badge"><CheckCircle size={11} /> Résolue</span>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: '#444', marginTop: 8, lineHeight: 1.5 }}>{a.message}</p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <button className="admin-action-btn" style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, gap: 4 }}>
                          <Eye size={12} /> Voir le dossier
                        </button>
                        <button className="admin-action-btn" style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, gap: 4 }}>
                          <Clock size={12} /> Historique
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
