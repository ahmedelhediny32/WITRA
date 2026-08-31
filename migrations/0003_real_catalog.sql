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
