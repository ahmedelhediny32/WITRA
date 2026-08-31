-- WITRA Marketing Solutions — manual Reports & Performance entry
-- Adds: who entered a report + full metric set (cpl, conversion) so the
-- auto-generated narrative can compare period-over-period, and a simple
-- "source" flag so we always know a report was WITRA-entered (manual).

PRAGMA foreign_keys = ON;

ALTER TABLE reports ADD COLUMN entered_by TEXT NOT NULL DEFAULT 'WITRA Team';
ALTER TABLE reports ADD COLUMN metric_cpl REAL NOT NULL DEFAULT 0;
ALTER TABLE reports ADD COLUMN metric_conversion REAL NOT NULL DEFAULT 0;
