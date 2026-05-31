import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Country, CountryWithLaws } from '../types';

interface MapProps {
  countries: Country[];
  selectedCountry: CountryWithLaws | Country | null;
  onCountrySelect: (country: Country) => void;
}

export default function MapComponent({ countries, selectedCountry, onCountrySelect }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [15, 10],
      zoom: 2,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    countries.forEach(country => {
      const isSelected = selectedCountry?.id === country.id;
      const marker = L.circleMarker([country.lat, country.lng], {
        radius: isSelected ? 10 : 7,
        fillColor: isSelected ? '#1565C0' : '#3949AB',
        color: isSelected ? '#1565C0' : '#3949AB',
        weight: isSelected ? 2 : 1,
        opacity: 1,
        fillOpacity: isSelected ? 1 : 0.25,
      });

      marker.bindTooltip(country.name, {
        permanent: false,
        direction: 'top',
        className: 'map-tooltip',
      });

      marker.on('click', () => onCountrySelect(country));
      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [countries, selectedCountry, onCountrySelect]);

  return (
    <div className="map-wrapper">
      <div className="map-header">Carte Interactive des Signataires</div>
      <div ref={containerRef} className="map-container" />
      <div className="map-legend">
        <span className="legend-dot" />
        <span>Pays signataire</span>
        <span className="legend-count">{countries.length} pays du Manifeste Paris 2026</span>
      </div>
    </div>
  );
}
