import { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, ChevronRight, ChevronLeft, Phone, MapPin, FileText, Heart, Briefcase, Users } from 'lucide-react';

interface VBGModalProps {
  onClose: () => void;
  country?: string;
}

const STEPS = [
  { id: 1, label: 'Sécurité immédiate' },
  { id: 2, label: "Ressources d'assistance" },
  { id: 3, label: 'Démarches juridiques' },
  { id: 4, label: 'Suivi et accompagnement' },
];

export default function VBGModal({ onClose, country }: VBGModalProps) {
  const [step, setStep] = useState(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="vbg-modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="vbg-modal-header">
          <div className="vbg-modal-title-row">
            <Shield size={18} />
            <span>Module VBG — Assistance Immédiate</span>
          </div>
          <button className="vbg-modal-close" onClick={onClose}>
            <X size={16} /> FERMER
          </button>
        </div>

        {/* Danger banner */}
        <div className="vbg-danger-banner">
          <AlertTriangle size={16} color="#c62828" />
          <span><strong>En danger immédiat ?</strong> Composez le numéro d'urgence de votre pays ou utilisez le bouton SOS rouge en bas à droite de l'écran.</span>
        </div>

        {/* Stepper */}
        <div className="vbg-stepper">
          {STEPS.map((s, i) => (
            <div key={s.id} className="vbg-step-group">
              <div className="vbg-step-col">
                <div className={`vbg-step-circle ${step > s.id ? 'done' : step === s.id ? 'active' : ''}`}>
                  {step > s.id ? <CheckCircle size={14} /> : s.id}
                </div>
                <div className={`vbg-step-label ${step === s.id ? 'active' : ''}`}>{s.label}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`vbg-step-line ${step > s.id ? 'done' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="vbg-content">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 country={country} />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        {/* Footer buttons */}
        <div className="vbg-footer">
          {step > 1 && (
            <button className="vbg-btn-prev" onClick={() => setStep(s => s - 1)}>
              <ChevronLeft size={16} /> PRÉCÉDENT
            </button>
          )}
          {step < 4 ? (
            <button className="vbg-btn-next" onClick={() => setStep(s => s + 1)}>
              SUIVANT : {STEPS[step].label.toUpperCase()} <ChevronRight size={16} />
            </button>
          ) : (
            <button className="vbg-btn-done" onClick={onClose}>
              J'AI COMPRIS
            </button>
          )}
        </div>

        {/* Bottom chips */}
        <div className="vbg-chips">
          {STEPS.map(s => (
            <button
              key={s.id}
              className={`vbg-chip ${step === s.id ? 'active' : ''}`}
              onClick={() => setStep(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div>
      <div className="vbg-section-box vbg-section-red">
        <div className="vbg-section-title">
          <AlertTriangle size={16} color="#c62828" />
          <span>Priorité : Votre sécurité</span>
        </div>
        {[
          { n: 1, title: 'Mettez-vous en sécurité', desc: 'Quittez le lieu si possible, allez chez une personne de confiance' },
          { n: 2, title: 'Appelez les secours', desc: 'Police, numéro d\'urgence national, ou ligne dédiée VBG' },
          { n: 3, title: 'Alertez votre réseau', desc: 'Famille, amis, voisins, collègues de confiance' },
          { n: 4, title: 'Préparez un sac d\'urgence', desc: 'Papiers d\'identité, argent, clés, médicaments, vêtements de rechange' },
        ].map(item => (
          <div key={item.n} className="vbg-step-item">
            <div className="vbg-step-num">{item.n}</div>
            <div>
              <div className="vbg-step-item-title">{item.title}</div>
              <div className="vbg-step-item-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2({ country }: { country?: string }) {
  const resources = [
    { country: 'France', phone: '3919', name: 'Violences Femmes Info', hours: '24h/24' },
    { country: 'Sénégal', phone: '+221 33 822 00 00', name: 'Ligne SOS Femmes', hours: '8h-20h' },
    { country: 'Maroc', phone: '8007', name: 'Centre Écoute Femmes', hours: '8h-22h' },
    { country: 'Tunisie', phone: '1899', name: 'Ligne d\'urgence VBG', hours: '24h/24' },
    { country: 'Cameroun', phone: '+237 222 231 107', name: 'MINPROFF', hours: '8h-18h' },
  ];

  return (
    <div>
      <div className="vbg-info-banner">
        <span style={{ color: '#1565C0', fontSize: 14 }}>ℹ️</span>
        <span>Les ressources spécifiques pour {country || 'votre pays'} seront bientôt disponibles. En attendant, contactez les services d'urgence locaux.</span>
      </div>
      <div className="vbg-section-box" style={{ marginTop: 12 }}>
        <div className="vbg-section-title">
          <Phone size={16} color="#1565C0" />
          <span>Lignes d'urgence — Pays signataires</span>
        </div>
        {resources.map(r => (
          <div key={r.country} className="vbg-resource-row">
            <div className="vbg-resource-country">{r.country}</div>
            <div>
              <div className="vbg-resource-name">{r.name}</div>
              <div className="vbg-resource-hours">{r.hours}</div>
            </div>
            <a href={`tel:${r.phone}`} className="vbg-resource-phone">
              <Phone size={12} /> {r.phone}
            </a>
          </div>
        ))}
      </div>
      <div className="vbg-section-box" style={{ marginTop: 12 }}>
        <div className="vbg-section-title">
          <MapPin size={16} color="#1565C0" />
          <span>Centres d'accueil</span>
        </div>
        <div className="vbg-two-col">
          {[
            { icon: '🏥', label: 'Hôpitaux partenaires', desc: 'Prise en charge médicale gratuite' },
            { icon: '🏠', label: 'Hébergements d\'urgence', desc: 'Foyers sécurisés et discrets' },
            { icon: '⚖️', label: 'Maisons de justice', desc: 'Aide juridictionnelle disponible' },
            { icon: '🧠', label: 'Centres psycho-sociaux', desc: 'Soutien psychologique immédiat' },
          ].map(c => (
            <div key={c.label} className="vbg-center-card">
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: '#777' }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3() {
  const steps = [
    { n: 1, title: 'Porter plainte', desc: 'Au commissariat ou à la gendarmerie, demandez un récépissé de dépôt de plainte', type: 'urgent' },
    { n: 2, title: 'Certificat médical', desc: 'Consultez un médecin pour faire constater vos blessures — preuve essentielle', type: 'urgent' },
    { n: 3, title: 'Aide juridictionnelle', desc: 'Si vos ressources sont insuffisantes, vous avez droit à un avocat gratuit', type: 'info' },
    { n: 4, title: 'Ordonnance de protection', desc: 'Le juge peut vous protéger en urgence et éloigner votre agresseur', type: 'info' },
    { n: 5, title: 'Dossier de preuves', desc: 'Conservez SMS, photos, témoignages, certificats — tout document utile', type: 'tip' },
  ];

  const laws = [
    { country: 'France', law: 'Loi du 30 juillet 2020', desc: 'Contre les violences conjugales' },
    { country: 'Maroc', law: 'Loi 103-13', desc: 'Lutte contre les violences faites aux femmes' },
    { country: 'Tunisie', law: 'Loi organique 2017-58', desc: 'Élimination de la violence à l\'égard des femmes' },
    { country: 'Sénégal', law: 'Code pénal Art. 297', desc: 'Violences conjugales et agressions sexuelles' },
  ];

  return (
    <div>
      <div className="vbg-section-box">
        <div className="vbg-section-title">
          <FileText size={16} color="#1565C0" />
          <span>Étapes des démarches juridiques</span>
        </div>
        {steps.map(s => (
          <div key={s.n} className={`vbg-legal-step vbg-legal-${s.type}`}>
            <div className="vbg-step-num">{s.n}</div>
            <div>
              <div className="vbg-step-item-title">{s.title}</div>
              <div className="vbg-step-item-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="vbg-section-box" style={{ marginTop: 12 }}>
        <div className="vbg-section-title">
          <Shield size={16} color="#7b1fa2" />
          <span>Lois applicables — Arsenal MAP-PROTECT</span>
        </div>
        {laws.map(l => (
          <div key={l.country} className="vbg-law-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: '#333' }}>{l.country}</span>
              <span className="vbg-law-badge">{l.law}</span>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>{l.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 14 }}>Accompagnement et suivi</h3>

      <div className="vbg-support-card vbg-support-purple">
        <div className="vbg-section-title">
          <Heart size={16} color="#7b1fa2" />
          <span style={{ color: '#7b1fa2' }}>Soutien psychologique</span>
        </div>
        {[
          { title: 'Thérapie individuelle ou de groupe', desc: 'Accompagnement par des professionnels formés aux traumatismes' },
          { title: 'Associations spécialisées', desc: 'Groupes de parole, ateliers de reconstruction' },
        ].map(i => (
          <div key={i.title} className="vbg-support-item">
            <div className="vbg-step-item-title">{i.title}</div>
            <div className="vbg-step-item-desc">{i.desc}</div>
          </div>
        ))}
      </div>

      <div className="vbg-support-card vbg-support-green">
        <div className="vbg-section-title">
          <Briefcase size={16} color="#2e7d32" />
          <span style={{ color: '#2e7d32' }}>Autonomisation économique</span>
        </div>
        {[
          { title: 'Formation professionnelle', desc: 'Accès à des programmes de réinsertion' },
          { title: 'Aide financière d\'urgence', desc: 'Fonds d\'aide aux victimes, RSA, allocations' },
        ].map(i => (
          <div key={i.title} className="vbg-support-item">
            <div className="vbg-step-item-title">{i.title}</div>
            <div className="vbg-step-item-desc">{i.desc}</div>
          </div>
        ))}
      </div>

      <div className="vbg-support-card vbg-support-orange">
        <div className="vbg-section-title">
          <Users size={16} color="#e65100" />
          <span style={{ color: '#e65100' }}>Réseau Sentinelles MAP-PROTECT</span>
        </div>
        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>
          Vous n'êtes pas seule. Le réseau des Sentinelles du Manifeste Paris 2026 est là pour vous accompagner à chaque étape.
        </p>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#333', marginBottom: 6 }}>Points focaux disponibles :</div>
        <div className="vbg-two-col">
          {['France', 'Sénégal', 'Maroc', 'Tunisie', 'Cameroun', 'Côte d\'Ivoire'].map(c => (
            <div key={c} className="vbg-focal-chip">{c}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
