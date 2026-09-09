-- 0001_initial_schema.sql
-- WITRA Marketing Solutions — initial D1 schema
-- Reverse-engineered from every query in src/routes/* and src/lib/*
-- Apply with:
--   npx wrangler d1 migrations apply witra-marketing-production --local   (for local dev)
--   npx wrangler d1 migrations apply witra-marketing-production --remote (for production)

PRAGMA foreign_keys = ON;

-- ===================== PLANS & ENTITLEMENTS =====================

CREATE TABLE plans (
  name_ar TEXT,
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
  label_ar TEXT,
  key         TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ===================== CLIENTS =====================

CREATE TABLE clients (
  secondary_color TEXT NOT NULL DEFAULT '#B7791F',
  subscription_status TEXT NOT NULL DEFAULT 'active',
  active_services_before_suspend TEXT NOT NULL DEFAULT '[]',
  subscription_start TEXT,
  last_expiry_notice TEXT,
  last_renewal_reminder TEXT,
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  owner                 TEXT NOT NULL DEFAULT '—',
  industry              TEXT NOT NULL DEFAULT '—',
  location              TEXT NOT NULL DEFAULT '—',
  logo_color            TEXT NOT NULL DEFAULT '#74254E',
  secondary_color       TEXT NOT NULL DEFAULT '#B7791F',
  typography            TEXT NOT NULL DEFAULT 'Inter',
  brand_voice           TEXT NOT NULL DEFAULT '',
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
  name_ar TEXT,
  headline_ar TEXT,
  what_you_get_ar TEXT NOT NULL DEFAULT '[]',
  why_you_need_it_ar TEXT,
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
  entered_by TEXT NOT NULL DEFAULT 'WITRA Team',
  metric_cpl REAL NOT NULL DEFAULT 0,
  metric_conversion REAL NOT NULL DEFAULT 0,
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


-- 0002_seed_data.sql
-- Minimum seed data so the platform is actually usable right after migration.
-- Edit names/prices/entitlements to match WITRA's real plan structure —
-- these are placeholders so `plan_id = 'core'` (the app's hardcoded default
-- when creating a client) resolves to a real row.

-- ===================== PLANS =====================
INSERT INTO plans (id, name, price, cycle, entitlements, sort_order) VALUES
  ('starter', 'Starter', '—',   'month', '[]',                                  1),
  ('core',    'Core',    '—',   'month', '["content_plan"]',                    2),
  ('growth',  'Growth',  '—',   'month', '["content_plan","priority_support"]', 3);

-- ===================== ENTITLEMENT LABELS =====================
-- Human-readable labels for the keys referenced inside plans.entitlements.
-- The frontend currently only checks "content_plan" (gates the Content Ops
-- Tracker tab) — add more rows here as you gate more features per plan.
INSERT INTO entitlement_labels (key, label, sort_order) VALUES
  ('content_plan',      'Content Ops Tracker', 1),
  ('priority_support',  'Priority Support',    2);

-- ===================== INITIAL SUPER ADMIN =====================
-- Login:  admin@witra.agency / WitraAdmin@2026
-- Change this password immediately after first login (Settings > Password).
INSERT INTO users (id, email, password_hash, name, user_type, role, assigned_clients, active) VALUES
  ('w_superadmin', 'admin@witra.agency',
   'pbkdf2$100000$a82e7a6eaf2c841d99ff775c29f71e23$6280230fb403edc881ab4e7fd619cff598b8794b1f9ad901026ad20f570b1904',
   'Ahmed', 'witra', 'Super Admin', '[]', 1);


-- 0003_real_catalog.sql
-- Real WITRA plans, entitlements and services catalogue
-- (extracted from the approved WITRA_Marketing_Solutions.html source of truth)

-- Reassign any clients / upgrade requests off the placeholder plans first
UPDATE clients SET plan_id = 'core' WHERE plan_id IN ('starter', 'growth');
UPDATE service_requests SET target_plan_id = 'core' WHERE target_plan_id IN ('starter', 'growth');
DELETE FROM plans WHERE id IN ('starter', 'growth');

-- ===================== PLANS =====================
INSERT INTO plans (id, name, price, cycle, entitlements, sort_order) VALUES
  ('core',    'Core',    '18,000', 'month', '["strategy","content_plan","creative_design","digital_marketing"]', 1),
  ('premium', 'Premium', '32,000', 'month', '["strategy","content_plan","creative_design","digital_marketing","branding_identity"]', 2),
  ('gold',    'Gold',    '52,000', 'month', '["strategy","content_plan","creative_design","digital_marketing","branding_identity","offline_campaigns"]', 3)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  price = excluded.price,
  cycle = excluded.cycle,
  entitlements = excluded.entitlements,
  sort_order = excluded.sort_order,
  updated_at = CURRENT_TIMESTAMP;

-- ===================== ENTITLEMENT LABELS =====================
DELETE FROM entitlement_labels;
INSERT INTO entitlement_labels (key, label, sort_order) VALUES
  ('strategy',          'Strategy',            1),
  ('content_plan',      'Content Plan',        2),
  ('creative_design',   'Creative & Design',   3),
  ('digital_marketing', 'Digital Marketing',   4),
  ('branding_identity', 'Branding & Identity', 5),
  ('offline_campaigns', 'Offline Campaigns',   6);

-- ===================== SERVICES =====================
INSERT INTO services (id, name, category, headline, what_you_get, why_you_need_it, price, standalone, included_in, status) VALUES
  ('business_consulting', 'Business Consulting (Diagnose)', 'Strategy',
   'Know exactly why your marketing isn''t working.',
   '["Full Presence & Messaging Audit","Competitor & Funnel Analysis","Written Growth Diagnosis","90-Day Action Plan"]',
   'A standalone diagnosis before any retainer — pinpoints exactly where growth is being lost.',
   '8,000 – 15,000 (one-time)', 1, '[]', 'Active'),

  ('paid_ads', 'Paid Advertising', 'Digital Marketing',
   'Turn your marketing into measurable growth.',
   '["Campaign Strategy","Audience Research","Ad Creative","Campaign Setup","Optimization","Retargeting","Performance Reports"]',
   'Your organic content is performing well, but you''re currently missing paid acquisition.',
   '15% of spend (min 10,000)', 1, '["premium","gold"]', 'Active'),

  ('brand_identity', 'Brand Identity', 'Branding & Identity',
   'Look like the company you want to become.',
   '["Logo System","Brand Palette & Typography","Brand Guidelines","Launch Content Kit"]',
   'Your visual identity isn''t consistent across platforms yet — this is usually the first thing prospects notice.',
   '25,000 – 60,000 (one-time)', 1, '["premium","gold"]', 'Active'),

  ('seo', 'SEO', 'Digital Marketing',
   'Increase organic visibility.',
   '["Technical Audit","Keyword Strategy","On-page Optimization","Monthly Ranking Reports"]',
   'Most of your traffic still depends on paid or referral — organic search is an untapped channel.',
   'Request a Quote', 1, '[]', 'Active'),

  ('video_production', 'Video Production', 'Creative & Design',
   'Create professional content.',
   '["Concept & Script","Shoot Day","Editing","Platform-ready Cuts"]',
   'Short-form video is outperforming static posts across your industry right now.',
   'Request a Quote', 1, '[]', 'Active'),

  ('content_marketing', 'Content Marketing', 'Digital Marketing',
   'A steady stream of content that sounds like you.',
   '["Content Calendar","Copywriting","Design & Production","Publishing & Community Replies"]',
   '',
   'Included in Core+', 0, '["core","premium","gold"]', 'Active'),

  ('social_media', 'Social Media Management', 'Digital Marketing',
   'Your channels, handled daily.',
   '["Daily Posting","Community Management","Monthly Performance Review"]',
   '',
   'Included in Core+', 0, '["core","premium","gold"]', 'Active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  category = excluded.category,
  headline = excluded.headline,
  what_you_get = excluded.what_you_get,
  why_you_need_it = excluded.why_you_need_it,
  price = excluded.price,
  standalone = excluded.standalone,
  included_in = excluded.included_in,
  status = excluded.status,
  updated_at = CURRENT_TIMESTAMP;


-- 0004_witra_tracker.sql
-- WITRA's own internal Content Ops Tracker state (single row, agency-wide)
CREATE TABLE IF NOT EXISTS witra_content_ops_state (
  id          INTEGER PRIMARY KEY CHECK (id = 1),
  state_json  TEXT NOT NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 0005_feedback_fixes.sql
-- WITRA Marketing Solutions — feedback-round schema changes
-- Adds: secondary brand color, subscription lifecycle (suspend on expiry),
-- a snapshot of active services taken at suspend time (to restore on renew),
-- and a request-based flow for clients adding their own team members.

PRAGMA foreign_keys = ON;

-- Secondary brand color (Business Profile > Brand)
-- secondary_color TEXT NOT NULL DEFAULT '#B7791F';

-- Subscription lifecycle: 'active' | 'suspended' (contract ended, services paused)
-- subscription_status TEXT NOT NULL DEFAULT 'active';

-- Snapshot of active_services taken the moment a client is suspended, so we
-- can restore exactly what they had when WITRA/the client resubscribes.
-- active_services_before_suspend TEXT NOT NULL DEFAULT '[]';

-- Date the client's current subscription/contract started — used to compute
-- "Total Contract Value" honestly (mrr * months actually elapsed), instead of
-- assuming a full year up front.
-- subscription_start TEXT;

-- Timestamp of the last time we sent a "your contract is about to expire" or
-- "your services have been suspended" notice, so we don't spam on every request.
-- last_expiry_notice TEXT;

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


-- 0006_bilingual_catalog_and_renewal.sql
-- WITRA Marketing Solutions — bilingual catalogue + renewal reminder tracking
-- Adds Arabic-language columns for services/plans/entitlement labels (fixes
-- the "English leaking into the Arabic UI" feedback for catalogue content,
-- which the generic locales.ar dictionary + auto-translator can never cover
-- since it is data stored in D1, not static UI chrome) and a column to track
-- when we last sent a client an "your subscription is about to end" notice
-- (so the new renewal-reminder sweep doesn't re-notify on every request).

PRAGMA foreign_keys = ON;

-- ===================== BILINGUAL CATALOGUE =====================

-- name_ar TEXT;

-- name_ar TEXT;
-- headline_ar TEXT;
-- what_you_get_ar TEXT NOT NULL DEFAULT '[]';   -- JSON array, mirrors what_you_get
-- why_you_need_it_ar TEXT;

-- label_ar TEXT;

-- Real Arabic translations for the seeded catalogue (migration 0003).

UPDATE plans SET name_ar = 'كور' WHERE id = 'core';
UPDATE plans SET name_ar = 'بريميوم' WHERE id = 'premium';
UPDATE plans SET name_ar = 'جولد' WHERE id = 'gold';

UPDATE entitlement_labels SET label_ar = 'استراتيجية' WHERE key = 'strategy';
UPDATE entitlement_labels SET label_ar = 'خطة محتوى' WHERE key = 'content_plan';
UPDATE entitlement_labels SET label_ar = 'تصميم إبداعي' WHERE key = 'creative_design';
UPDATE entitlement_labels SET label_ar = 'تسويق رقمي' WHERE key = 'digital_marketing';
UPDATE entitlement_labels SET label_ar = 'هوية العلامة التجارية' WHERE key = 'branding_identity';
UPDATE entitlement_labels SET label_ar = 'حملات أوفلاين' WHERE key = 'offline_campaigns';

UPDATE services SET
  name_ar = 'استشارات الأعمال',
  headline_ar = 'وضوح استراتيجي لنمو أعمالك',
  why_you_need_it_ar = 'يمنحك خطة واضحة قائمة على البيانات بدل التخمين، فتوجّه ميزانيتك وجهدك للأشياء اللي فعلاً تحرّك النتائج.'
WHERE id = 'business_consulting';

UPDATE services SET
  name_ar = 'إعلانات مدفوعة',
  headline_ar = 'وصول مستهدف يحقق نتائج قابلة للقياس',
  why_you_need_it_ar = 'يوصّل عرضك لأنسب جمهور في التوقيت المناسب، ويحوّل الميزانية الإعلانية لعملاء وطلبات حقيقية بدل مجرد ظهور.'
WHERE id = 'paid_ads';

UPDATE services SET
  name_ar = 'الهوية والعلامة التجارية',
  headline_ar = 'هوية بصرية متسقة يتعرف عليها عميلك',
  why_you_need_it_ar = 'يبني هوية موحّدة يتذكرها الناس ويثقوا بها، وتفرّق علامتك عن المنافسين في كل نقطة تواصل.'
WHERE id = 'brand_identity';

UPDATE services SET
  name_ar = 'تحسين محركات البحث (SEO)',
  headline_ar = 'ظهور أعلى في نتائج البحث بشكل مستدام',
  why_you_need_it_ar = 'يجذب عملاء يبحثون عنك بالفعل، ويبني حضورًا على جوجل يستمر في جلب طلبات حتى بعد توقف الإعلانات المدفوعة.'
WHERE id = 'seo';

UPDATE services SET
  name_ar = 'إنتاج الفيديو',
  headline_ar = 'محتوى فيديو يجذب ويحوّل',
  why_you_need_it_ar = 'الفيديو أكثر صيغة تفاعلاً على السوشيال ميديا؛ يعزز الثقة ويشرح عرضك بشكل أسرع من الصورة أو النص.'
WHERE id = 'video_production';

UPDATE services SET
  name_ar = 'تسويق المحتوى',
  headline_ar = 'محتوى مخطط يبني علاقة مستمرة مع جمهورك',
  why_you_need_it_ar = 'يحافظ على تواصل ثابت مع جمهورك، ويبني الوعي والثقة بالعلامة تدريجيًا شهرًا بعد شهر بدل الاعتماد على حملات متفرقة.'
WHERE id = 'content_marketing';

UPDATE services SET
  name_ar = 'إدارة السوشيال ميديا',
  headline_ar = 'حضور نشط ومتسق على كل المنصات',
  why_you_need_it_ar = 'يحافظ على نشاط صفحاتك يوميًا، ويبني علاقة مباشرة مع جمهورك بدون الحاجة لفريق داخلي.'
WHERE id = 'social_media';

-- ===================== RENEWAL REMINDER TRACKING =====================

-- Timestamp of the last "your subscription ends soon" reminder sent for the
-- CURRENT renewal cycle, so the lazy sweep (like checkAndSuspendExpired,
-- run on every dashboard/portal request — no cron on hosted deploy) fires
-- the notice exactly once per cycle instead of on every request.



-- 0007_manual_reports_and_kpis.sql
-- WITRA Marketing Solutions — manual Reports & Performance entry
-- Adds: who entered a report + full metric set (cpl, conversion) so the
-- auto-generated narrative can compare period-over-period, and a simple
-- "source" flag so we always know a report was WITRA-entered (manual).

PRAGMA foreign_keys = ON;


-- 0008_reports_v2.sql
-- WITRA Marketing Solutions — Performance Report v2 overhaul
-- Adds: full metric set, report metadata, data quality tracking,
-- versioning, structured analysis, and comparison metadata.

PRAGMA foreign_keys = ON;

-- ===================== NEW METRIC COLUMNS =====================

ALTER TABLE reports ADD COLUMN metric_impressions INTEGER;
ALTER TABLE reports ADD COLUMN metric_conversions INTEGER;
ALTER TABLE reports ADD COLUMN metric_ad_spend REAL;
ALTER TABLE reports ADD COLUMN metric_revenue REAL;
ALTER TABLE reports ADD COLUMN metric_engagement_rate REAL;

-- ===================== REPORT METADATA =====================

ALTER TABLE reports ADD COLUMN channel TEXT NOT NULL DEFAULT '';
ALTER TABLE reports ADD COLUMN service_type TEXT NOT NULL DEFAULT '';
ALTER TABLE reports ADD COLUMN campaign TEXT NOT NULL DEFAULT '';
ALTER TABLE reports ADD COLUMN visibility TEXT NOT NULL DEFAULT 'Internal';
ALTER TABLE reports ADD COLUMN notify_client INTEGER NOT NULL DEFAULT 0;

-- ===================== DATA QUALITY & ANALYSIS =====================

ALTER TABLE reports ADD COLUMN data_quality TEXT NOT NULL DEFAULT 'Verified';
ALTER TABLE reports ADD COLUMN anomalies TEXT NOT NULL DEFAULT '[]';
ALTER TABLE reports ADD COLUMN what_needs_attention TEXT NOT NULL DEFAULT '[]';

-- ===================== VERSIONING =====================

ALTER TABLE reports ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE reports ADD COLUMN published_at TEXT;
ALTER TABLE reports ADD COLUMN updated_by TEXT NOT NULL DEFAULT '';

-- ===================== STRUCTURED STRATEGY =====================

ALTER TABLE reports ADD COLUMN next_month_strategy TEXT NOT NULL DEFAULT '{}';

-- ===================== COMPARISON METADATA =====================

ALTER TABLE reports ADD COLUMN comparison_status TEXT NOT NULL DEFAULT 'Baseline';
ALTER TABLE reports ADD COLUMN previous_report_id TEXT;
ALTER TABLE reports ADD COLUMN mom_changes TEXT NOT NULL DEFAULT '{}';

-- Index for duplicate period detection
CREATE INDEX IF NOT EXISTS idx_reports_client_period ON reports(client_id, period, channel);

-- Client brand-profile fields used by the portal.
ALTER TABLE clients ADD COLUMN typography TEXT NOT NULL DEFAULT 'Inter';
ALTER TABLE clients ADD COLUMN brand_voice TEXT NOT NULL DEFAULT '';



