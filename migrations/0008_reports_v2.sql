-- 0008_reports_v2.sql
-- WITRA Marketing Solutions — Performance Report v2 overhaul
-- Adds: full metric set (impressions, conversions, ad spend, revenue,
-- engagement rate), report metadata (channel, service type, campaign,
-- visibility, notify), data quality tracking, versioning, structured
-- analysis storage, and comparison metadata.

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
ALTER TABLE reports ADD COLUMN visibility TEXT NOT NULL DEFAULT 'Client';
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

-- Brand-profile fields used by the client portal.
ALTER TABLE clients ADD COLUMN typography TEXT NOT NULL DEFAULT 'Inter';
ALTER TABLE clients ADD COLUMN brand_voice TEXT NOT NULL DEFAULT '';

-- Supports duplicate checks without risking a failed migration on an existing
-- database that may already contain legacy duplicate reports.
CREATE INDEX IF NOT EXISTS idx_reports_client_period_channel ON reports(client_id, period, channel);
