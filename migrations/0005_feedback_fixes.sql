-- WITRA Marketing Solutions — feedback-round schema changes
-- Adds: secondary brand color, subscription lifecycle (suspend on expiry),
-- a snapshot of active services taken at suspend time (to restore on renew),
-- and a request-based flow for clients adding their own team members.

PRAGMA foreign_keys = ON;

-- Secondary brand color (Business Profile > Brand)
ALTER TABLE clients ADD COLUMN secondary_color TEXT NOT NULL DEFAULT '#B7791F';

-- Subscription lifecycle: 'active' | 'suspended' (contract ended, services paused)
ALTER TABLE clients ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'active';

-- Snapshot of active_services taken the moment a client is suspended, so we
-- can restore exactly what they had when WITRA/the client resubscribes.
ALTER TABLE clients ADD COLUMN active_services_before_suspend TEXT NOT NULL DEFAULT '[]';

-- Date the client's current subscription/contract started — used to compute
-- "Total Contract Value" honestly (mrr * months actually elapsed), instead of
-- assuming a full year up front.
ALTER TABLE clients ADD COLUMN subscription_start TEXT;

-- Timestamp of the last time we sent a "your contract is about to expire" or
-- "your services have been suspended" notice, so we don't spam on every request.
ALTER TABLE clients ADD COLUMN last_expiry_notice TEXT;

UPDATE clients SET subscription_start = COALESCE(subscription_start, DATE(created_at)) WHERE subscription_start IS NULL;

-- ===================== TEAM MEMBER REQUESTS (client -> WITRA) =====================
-- A client wanting to add a teammate submits a request here instead of
-- creating the user directly. WITRA reviews it and, on approval, creates the
-- real `users` row themselves — so WITRA always knows every email/person
-- that has access to the platform.
CREATE TABLE team_requests (
  id               TEXT PRIMARY KEY,
  client_id        TEXT NOT NULL REFERENCES clients(id),
  email            TEXT NOT NULL,
  password_hash    TEXT NOT NULL,
  name             TEXT NOT NULL DEFAULT '',
  role             TEXT NOT NULL DEFAULT 'Viewer',   -- 'Manager' | 'Editor' | 'Viewer'
  status           TEXT NOT NULL DEFAULT 'Requested', -- 'Requested' | 'Approved' | 'Rejected'
  notes            TEXT NOT NULL DEFAULT '',
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_requests_client_id ON team_requests(client_id);
CREATE INDEX idx_team_requests_status    ON team_requests(status);
