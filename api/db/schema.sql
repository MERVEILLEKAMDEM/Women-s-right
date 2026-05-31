-- MAP-PROTECT PostgreSQL Schema
-- Manifeste Paris 2026

CREATE TABLE IF NOT EXISTS countries (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  focal_point VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS laws (
  id VARCHAR(50) PRIMARY KEY,
  country_id VARCHAR(10) NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  category VARCHAR(10) NOT NULL CHECK (category IN ('femme', 'enfant', 'vbg')),
  type VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  summary TEXT NOT NULL,
  full_text TEXT,
  themes TEXT[] NOT NULL DEFAULT '{}',
  pdf_url VARCHAR(500),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_laws_country ON laws(country_id);
CREATE INDEX IF NOT EXISTS idx_laws_category ON laws(category);
CREATE INDEX IF NOT EXISTS idx_laws_status ON laws(status);

CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID PRIMARY KEY,
  anonymous_id VARCHAR(20) NOT NULL,
  country_id VARCHAR(10) REFERENCES countries(id) ON DELETE SET NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  level VARCHAR(20) NOT NULL DEFAULT 'high' CHECK (level IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_emergency_status ON emergency_alerts(status);

CREATE TABLE IF NOT EXISTS admin_alerts (
  id SERIAL PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Urgence', 'Alerte', 'Info')),
  message TEXT NOT NULL,
  alert_date DATE NOT NULL DEFAULT CURRENT_DATE,
  level VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (level IN ('high', 'medium', 'low')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_stats (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total_visits INTEGER NOT NULL DEFAULT 0,
  unique_users INTEGER NOT NULL DEFAULT 0
);

INSERT INTO app_stats (id, total_visits, unique_users)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS theme_searches (
  theme VARCHAR(100) PRIMARY KEY,
  search_count INTEGER NOT NULL DEFAULT 0
);
