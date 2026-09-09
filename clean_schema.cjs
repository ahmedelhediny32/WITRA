const fs=require('fs');
let sql = fs.readFileSync('setup_database.sql', 'utf8');

sql = sql.replace(/ALTER TABLE clients ADD COLUMN /g, '-- ');
sql = sql.replace(/ALTER TABLE plans ADD COLUMN /g, '-- ');
sql = sql.replace(/ALTER TABLE services ADD COLUMN /g, '-- ');
sql = sql.replace(/ALTER TABLE entitlement_labels ADD COLUMN /g, '-- ');

sql = sql.replace(/CREATE TABLE clients \(/, "CREATE TABLE clients (\n  secondary_color TEXT NOT NULL DEFAULT '#B7791F',\n  subscription_status TEXT NOT NULL DEFAULT 'active',\n  active_services_before_suspend TEXT NOT NULL DEFAULT '[]',\n  subscription_start TEXT,\n  last_expiry_notice TEXT,");
sql = sql.replace(/CREATE TABLE plans \(/, "CREATE TABLE plans (\n  name_ar TEXT,");
sql = sql.replace(/CREATE TABLE services \(/, "CREATE TABLE services (\n  name_ar TEXT,\n  headline_ar TEXT,\n  what_you_get_ar TEXT NOT NULL DEFAULT '[]',\n  why_you_need_it_ar TEXT,");
sql = sql.replace(/CREATE TABLE entitlement_labels \(/, "CREATE TABLE entitlement_labels (\n  label_ar TEXT,");

fs.writeFileSync('setup_database.sql', sql);
