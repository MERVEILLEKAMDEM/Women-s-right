import { useState, useEffect } from 'react';
import { X, BarChart2, BookOpen, AlertTriangle, TrendingUp, Eye, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { api } from '../api/client';
import type { AdminAlert, AdminLawRow, DashboardStats } from '../types';

interface AdminModalProps {
  onClose: () => void;
}

type AdminTab = 'stats' | 'laws' | 'alerts';

export default function AdminModal({ onClose }: AdminModalProps) {
  const [tab, setTab] = useState<AdminTab>('stats');
  const [lawFilter, setLawFilter] = useState('Tous');
  const [alertFilter, setAlertFilter] = useState('Tous');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [laws, setLaws] = useState<AdminLawRow[]>([]);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsData, lawsData, alertsData] = await Promise.all([
          api.admin.getStats(),
          api.admin.getLaws(),
          api.admin.getAlerts(),
        ]);
        setStats(statsData);
        setLaws(lawsData);
        setAlerts(alertsData);
      } catch {
        setError('Impossible de charger les données admin. Vérifiez que l\'API est démarrée.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxViews = stats ? Math.max(...stats.topCountries.map(c => c.views), 1) : 1;

  const handleDeleteLaw = async (id: string) => {
    try {
      await api.admin.deleteLaw(id);
      setLaws(prev => prev.filter(l => l.id !== id));
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      const updated = await api.admin.resolveAlert(id);
      setAlerts(prev => prev.map(a => (a.id === id ? updated : a)));
    } catch {
      alert('Erreur lors de la résolution');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title-row">
            <BarChart2 size={20} />
            <span>Administration MAP-PROTECT</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

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

        <div className="admin-content">
          {loading && <p className="admin-loading">Chargement...</p>}
          {error && <p className="admin-error">{error}</p>}

          {!loading && tab === 'stats' && stats && (
            <div>
              <div className="admin-kpi-grid">
                {[
                  { val: stats.totalVisits.toLocaleString(), label: 'Visites totales' },
                  { val: stats.uniqueUsers.toLocaleString(), label: 'Utilisateurs uniques' },
                  { val: String(stats.emergencyAlerts), label: "Alertes d'urgence" },
                  { val: String(stats.countryCount), label: 'Pays signataires' },
                ].map(k => (
                  <div key={k.label} className="admin-kpi-card">
                    <div className="admin-kpi-val">{k.val}</div>
                    <div className="admin-kpi-label">{k.label}</div>
                  </div>
                ))}
              </div>

              <div className="admin-two-col">
                <div className="admin-table-card">
                  <div className="admin-table-title">Top 5 — Pays les plus consultés</div>
                  <table className="admin-table">
                    <thead><tr><th>Pays</th><th>Vues</th></tr></thead>
                    <tbody>
                      {stats.topCountries.map((c, i) => (
                        <tr key={c.name}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: '#f0f2f5', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${(c.views / maxViews) * 100}%`, height: '100%', background: `hsl(${210 + i * 15}, 70%, 50%)`, borderRadius: 3 }} />
                            </div>
                            {c.name}
                          </td>
                          <td><span className="admin-badge">{c.views.toLocaleString()}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-table-card">
                  <div className="admin-table-title">Top 5 — Lois les plus consultées</div>
                  <table className="admin-table">
                    <thead><tr><th>Loi</th><th>Vues</th></tr></thead>
                    <tbody>
                      {stats.topLaws.map(l => (
                        <tr key={l.title}>
                          <td style={{ fontSize: 12 }}>{l.title}</td>
                          <td><span className="admin-badge">{l.views}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-table-card" style={{ marginTop: 16 }}>
                <div className="admin-table-title">Thématiques les plus recherchées</div>
                <table className="admin-table">
                  <thead><tr><th>Thématique</th><th>Recherches</th><th>Tendance</th></tr></thead>
                  <tbody>
                    {stats.topThemes.map(t => (
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

          {!loading && tab === 'laws' && (
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
                                onClick={() => handleDeleteLaw(l.id)}
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
            </div>
          )}

          {!loading && tab === 'alerts' && (
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
                            <button className="admin-resolve-btn" onClick={() => handleResolveAlert(a.id)}>
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
