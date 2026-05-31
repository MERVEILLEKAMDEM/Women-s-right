interface StatsBarProps {
  countryCount: number;
  lawCounts: { femme: number; enfant: number; vbg: number };
}

export default function StatsBar({ countryCount, lawCounts }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-number stat-blue">{countryCount}</span>
        <span className="stat-label">Pays signataires</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-number stat-pink">{lawCounts.femme}</span>
        <span className="stat-label">Lois de protection des femmes</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-number stat-blue">{lawCounts.enfant}</span>
        <span className="stat-label">Lois de protection des enfants</span>
      </div>
    </div>
  );
}
