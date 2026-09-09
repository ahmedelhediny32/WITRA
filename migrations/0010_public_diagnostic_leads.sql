-- Public website diagnostic requests.

CREATE TABLE diagnostic_leads (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  business_name  TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT NOT NULL,
  industry       TEXT NOT NULL DEFAULT '',
  team_size      TEXT NOT NULL DEFAULT '',
  challenge      TEXT NOT NULL,
  budget         TEXT NOT NULL DEFAULT '',
  preferred_time TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'New',
  source         TEXT NOT NULL DEFAULT 'public-website',
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_diagnostic_leads_status_created ON diagnostic_leads(status, created_at);