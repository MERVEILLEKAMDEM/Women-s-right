# MAP-PROTECT

Plateforme interactive (Web) pour visualiser l'arsenal juridique protégeant les femmes et les enfants dans les **20 pays signataires** du Manifeste Paris 2026.

## Architecture

```
map-protect/
├── api/                # Backend REST (Express + TypeScript + PostgreSQL)
├── map-protect/        # Frontend (React + TypeScript + CSS)
└── docker-compose.yml  # PostgreSQL 16
```

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm run install:all

# 2. Démarrer PostgreSQL
npm run db:up

# 3. Créer les tables et insérer les données initiales
npm run db:setup

# 4. Copier la config API
cp api/.env.example api/.env

# 5. Lancer API + Frontend
npm run dev
```

- **Frontend** : http://localhost:5173
- **API** : http://localhost:3001/api/health
- **PostgreSQL** : `localhost:5432` (user: `mapprotect`, db: `map_protect`)

## Base de données PostgreSQL

### Schéma

| Table | Description |
|-------|-------------|
| `countries` | 20 pays signataires + points focaux |
| `laws` | Lois juridiques (Femme / Enfant / VBG) |
| `emergency_alerts` | Alertes SOS anonymisées |
| `admin_alerts` | Alertes administratives HCS-M26 |
| `app_stats` | Statistiques globales de consultation |
| `theme_searches` | Compteurs par thématique |

### Scripts DB

```bash
npm run db:up       # Démarrer PostgreSQL (Docker)
npm run db:down     # Arrêter PostgreSQL
npm run db:setup    # Migration + seed (20 pays, 60 lois)
npm run db:migrate --prefix api   # Schéma uniquement
npm run db:seed --prefix api      # Données initiales uniquement
```

## Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Santé du service + statut PostgreSQL |
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

## Variables d'environnement

**API** (`api/.env`) :
```
PORT=3001
DATABASE_URL=postgresql://mapprotect:mapprotect@localhost:5432/map_protect
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
- Persistance PostgreSQL (lois, alertes, statistiques)

## HCS-M26

Points focaux coordination :
- **Fanta Bayo LEVEQUE** — Pilotage et Coordination
- **Céline Nathalie Razafindehibe** — Ingénierie, Droits et Parité

*Manifeste Paris 2026 — Rapport d'Excellence 05 décembre 2026*
