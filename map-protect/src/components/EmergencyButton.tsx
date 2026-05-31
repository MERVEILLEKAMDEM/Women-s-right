import { useState, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { api } from '../api/client';

interface EmergencyButtonProps {
  countryId?: string;
}

export default function EmergencyButton({ countryId }: EmergencyButtonProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSOS = useCallback(async () => {
    if (sending || sent) return;

    const confirmed = window.confirm(
      "Vous allez envoyer une alerte d'urgence aux points focaux HCS-M26.\n\nVotre identité restera anonyme.\n\nContinuer ?",
    );
    if (!confirmed) return;

    setSending(true);
    setError(null);

    try {
      let lat: number | undefined;
      let lng: number | undefined;

      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 8000,
            enableHighAccuracy: true,
          });
        }).catch(() => null);

        if (pos) {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        }
      }

      const result = await api.sendEmergency({ lat, lng, countryId });
      setSent(true);
      alert(`${result.message}\n\nNuméro d'urgence : ${result.emergencyNumber}`);
      setTimeout(() => setSent(false), 30000);
    } catch {
      setError("Impossible d'envoyer l'alerte. Appelez les secours directement.");
    } finally {
      setSending(false);
    }
  }, [sending, sent, countryId]);

  return (
    <div className="emergency-fab-wrapper">
      <button
        className={`emergency-fab ${sent ? 'sent' : ''}`}
        onClick={handleSOS}
        disabled={sending}
        title="Alerte d'urgence — SOS"
        aria-label="Bouton d'urgence SOS"
      >
        <AlertTriangle size={22} />
        <span>{sending ? 'ENVOI...' : sent ? 'ENVOYÉ' : 'SOS'}</span>
      </button>
      {error && <div className="emergency-error">{error}</div>}
    </div>
  );
}
