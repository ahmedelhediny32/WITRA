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
