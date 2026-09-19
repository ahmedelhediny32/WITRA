INSERT INTO services (
  id, name, category, headline, what_you_get, why_you_need_it, price, standalone, included_in, status, name_ar, headline_ar, what_you_get_ar, why_you_need_it_ar
) VALUES (
  'business_consulting', 'Business Consulting', 'Consulting',
  'Marketing and commercial consulting, sales enablement, offer design, and business reviews focused on the numbers that matter.',
  '["Full Presence & Messaging Audit", "Competitor & Funnel Analysis", "Written Growth Diagnosis", "90-Day Action Plan"]', '', '8,000 - 15,000 (one-time)', 1, '[]', 'Active',
  'استشارات تجارية (نمو)',
  'استشارات تسويقية وتجارية، تطوير الـ Offers، دعم المبيعات، ومراجعات دورية تركز على الأرقام التي تؤثر في البيزنس.',
  '["مراجعة شاملة للتواجد والرسائل التسويقية", "تحليل المنافسين والمسار البيعي", "تشخيص مكتوب لفرص النمو", "خطة عمل لـ 90 يوم"]', ''
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  headline = excluded.headline,
  name_ar = excluded.name_ar,
  headline_ar = excluded.headline_ar,
  what_you_get = excluded.what_you_get,
  what_you_get_ar = excluded.what_you_get_ar,
  price = excluded.price,
  status = excluded.status;
