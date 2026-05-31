# MAP-PROTECT

Plateforme interactive (Web) pour visualiser l'arsenal juridique protégeant les femmes et les enfants dans les **20 pays signataires** du Manifeste Paris 2026.

## Architecture

```
map-protect/
├── api/              # Backend REST (Express + TypeScript)
└── map-protect/      # Frontend (React + TypeScript + CSS)
```

## Démarrage rapide

```bash
# Installer les dépendances
npm run install:all

# Lancer API + Frontend en parallèle
npm run dev
```

- **Frontend** : http://localhost:5173
- **API** : http://localhost:3001/api/health

## Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Santé du service |
| GET | `/api/countries` | Liste des pays (filtres: `search`, `region`, `theme`) |
| GET | `/api/countries/:id` | Détail pays + lois par catégorie |
| GET | `/api/laws` | Liste des lois (filtres: `countryId`, `category`, `theme`) |
| GET | `/api/laws/:id` | Détail loi + résumé vulgarisé |
| GET | `/api/stats/summary` | Compteurs publics (pays, lois) |
| GET | `/api/themes` | Régions et thématiques disponibles |
| POST | `/api/emergency` | Alerte SOS (géolocalisation anonymisée) |
| GET | `/api/emergency/contacts` | Points focaux HCS-M26 |
| GET | `/api/documents/:lawId/pdf` | Téléchargement document source |
| GET | `/api/admin/stats` | Tableau de bord (clé API requise) |
| GET/POST/PUT/DELETE | `/api/admin/laws` | CMS gestion des lois |
| GET/PATCH | `/api/admin/alerts` | Gestion des alertes |

### Authentification Admin

Header requis : `X-API-Key: map-protect-hcs-m26`

Variable d'environnement : `ADMIN_API_KEY`

## Variables d'environnement

**API** (`api/.env`) :
```
PORT=3001
ADMIN_API_KEY=map-protect-hcs-m26
```

**Frontend** (`map-protect/.env`) :
```
VITE_API_URL=/api
VITE_ADMIN_API_KEY=map-protect-hcs-m26
```

## Fonctionnalités

- Carte interactive Leaflet (20 pays cliquables)
- Filtres par pays, région et thématique
- Arsenal juridique en 3 onglets (Femme / Enfant / VBG)
- Mode vulgarisation pour chaque loi
- Bouton SOS avec géolocalisation
- Back-office CMS + statistiques de consultation

## HCS-M26

Points focaux coordination :
- **Fanta Bayo LEVEQUE** — Pilotage et Coordination
- **Céline Nathalie Razafindehibe** — Ingénierie, Droits et Parité

*Manifeste Paris 2026 — Rapport d'Excellence 05 décembre 2026*
