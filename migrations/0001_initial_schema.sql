-- WITRA Marketing Solutions — initial D1 schema
-- Reverse-engineered from every query in src/routes/* and src/lib/*
-- Apply with:
--   npx wrangler d1 migrations apply witra-marketing-production --local   (for local dev)
--   npx wrangler d1 migrations apply witra-marketing-production --remote (for production)

PRAGMA foreign_keys = ON;

-- ===================== PLANS & ENTITLEMENTS =====================

CREATE TABLE plans (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  price         TEXT NOT NULL DEFAULT '',
  cycle         TEXT NOT NULL DEFAULT 'month',
  entitlements  TEXT NOT NULL DEFAULT '[]',   -- JSON array of entitlement_labels.key
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entitlement_labels (
  key         TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ===================== CLIENTS =====================

CREATE TABLE clients (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  owner                 TEXT NOT NULL DEFAULT '—',
  industry              TEXT NOT NULL DEFAULT '—',
  location              TEXT NOT NULL DEFAULT '—',
  logo_color            TEXT NOT NULL DEFAULT '#74254E',
  logo_image            TEXT,
  plan_id               TEXT NOT NULL REFERENCES plans(id),
  mrr                   INTEGER NOT NULL DEFAULT 0,
  health                TEXT NOT NULL DEFAULT 'On Track',   -- 'On Track' | 'Needs Attention' | 'At Risk'
  health_reason         TEXT NOT NULL DEFAULT '',
  active_services       TEXT NOT NULL DEFAULT '[]',         -- JSON array of services.id
  renewal               TEXT,                                -- ISO date
  contract_value        INTEGER NOT NULL DEFAULT 0,
  last_activity         TEXT NOT NULL DEFAULT 'Just now',
  billing_status        TEXT NOT NULL DEFAULT 'Trial',
  kpi_leads             INTEGER NOT NULL DEFAULT 0,
  kpi_conversion        TEXT NOT NULL DEFAULT '0%',
  kpi_cpl               REAL NOT NULL DEFAULT 0,
  kpi_roas              REAL NOT NULL DEFAULT 0,
  exec_content_done     INTEGER NOT NULL DEFAULT 0,
  exec_content_planned  INTEGER NOT NULL DEFAULT 0,
  exec_stories_done     INTEGER NOT NULL DEFAULT 0,
  exec_stories_planned  INTEGER NOT NULL DEFAULT 0,
  exec_offline_done     INTEGER NOT NULL DEFAULT 0,
  exec_offline_planned  INTEGER NOT NULL DEFAULT 0,
  exec_note             TEXT NOT NULL DEFAULT '',
  social_links          TEXT NOT NULL DEFAULT '[]',         -- JSON array of {platform,url}
  internal_notes        TEXT NOT NULL DEFAULT '',
  archived              INTEGER NOT NULL DEFAULT 0,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_plan_id  ON clients(plan_id);
CREATE INDEX idx_clients_archived ON clients(archived);

-- ===================== USERS & SESSIONS =====================

CREATE TABLE users (
  id                TEXT PRIMARY KEY,
  email             TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  name              TEXT NOT NULL,
  user_type         TEXT NOT NULL CHECK (user_type IN ('witra','client')),
  role              TEXT NOT NULL DEFAULT 'Team Member',   -- 'Super Admin' | 'Team Member' | client-side: 'Owner' | 'Manager' | 'Editor' | 'Viewer'
  client_id         TEXT REFERENCES clients(id),           -- set only for user_type = 'client'
  assigned_clients  TEXT NOT NULL DEFAULT '[]',            -- JSON array of clients.id, for user_type = 'witra'
  avatar_image      TEXT,
  active            INTEGER NOT NULL DEFAULT 1,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_client_id ON users(client_id);
CREATE INDEX idx_users_user_type ON users(user_type);

CREATE TABLE sessions (
  token                     TEXT PRIMARY KEY,
  user_id                   TEXT NOT NULL REFERENCES users(id),
  impersonating_client_id   TEXT REFERENCES clients(id),
  expires_at                DATETIME NOT NULL,
  created_at                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- ===================== SERVICES =====================

CREATE TABLE services (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  category         TEXT NOT NULL DEFAULT '',
  headline         TEXT NOT NULL DEFAULT '',
  what_you_get     TEXT NOT NULL DEFAULT '[]',   -- JSON array of strings
  why_you_need_it  TEXT NOT NULL DEFAULT '',
  price            TEXT NOT NULL DEFAULT '',
  standalone       INTEGER NOT NULL DEFAULT 1,
  included_in      TEXT NOT NULL DEFAULT '[]',   -- JSON array of plan ids
  status           TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published'
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===================== SERVICE REQUESTS =====================

CREATE TABLE service_requests (
  id               TEXT PRIMARY KEY,
  client_id        TEXT NOT NULL REFERENCES clients(id),
  service_name     TEXT NOT NULL,
  requested_date   TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'Requested', -- 'Requested' | 'Reviewing' | 'Approved' | 'Rejected'
  notes            TEXT NOT NULL DEFAULT '',
  request_type     TEXT NOT NULL DEFAULT 'service',   -- 'service' | 'upgrade'
  target_plan_id   TEXT REFERENCES plans(id),
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_requests_client_id ON service_requests(client_id);
CREATE INDEX idx_service_requests_status    ON service_requests(status);

-- ===================== REPORTS =====================

CREATE TABLE reports (
  id                  TEXT PRIMARY KEY,
  client_id           TEXT NOT NULL REFERENCES clients(id),
  period              TEXT NOT NULL,               -- e.g. '2026-08'
  status              TEXT NOT NULL DEFAULT 'Draft', -- 'Draft' | 'Published'
  summary             TEXT NOT NULL DEFAULT '',
  metric_reach        INTEGER NOT NULL DEFAULT 0,
  metric_engagement   INTEGER NOT NULL DEFAULT 0,
  metric_leads        INTEGER NOT NULL DEFAULT 0,
  metric_roas         REAL NOT NULL DEFAULT 0,
  what_worked         TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
  what_didnt          TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
  recommendations     TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
  next_month          TEXT NOT NULL DEFAULT '',
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_client_id ON reports(client_id);

-- ===================== ACTIVITIES =====================

CREATE TABLE activities (
  id          TEXT PRIMARY KEY,
  client_id   TEXT NOT NULL REFERENCES clients(id),
  text        TEXT NOT NULL,   -- small HTML fragment, rendered as-is by the frontend
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activities_client_created ON activities(client_id, created_at);

-- ===================== NOTIFICATIONS =====================

CREATE TABLE notifications (
  id                 TEXT PRIMARY KEY,
  text               TEXT NOT NULL,
  target_user_type   TEXT NOT NULL DEFAULT 'witra',  -- 'witra' | 'client'
  read               INTEGER NOT NULL DEFAULT 0,
  client_id          TEXT REFERENCES clients(id),
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_target_created ON notifications(target_user_type, created_at);

-- ===================== SETTINGS (key/value, per scope) =====================

CREATE TABLE settings (
  scope        TEXT NOT NULL,   -- 'witra' | 'client:<client_id>'
  key          TEXT NOT NULL,
  value        TEXT NOT NULL DEFAULT '',
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (scope, key)
);

-- ===================== CONTENT OPS TRACKER (per-client blob state) =====================

CREATE TABLE content_ops_state (
  client_id    TEXT PRIMARY KEY REFERENCES clients(id),
  state_json   TEXT NOT NULL,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
