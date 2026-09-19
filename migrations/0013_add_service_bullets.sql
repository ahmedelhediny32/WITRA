-- Add bullet points (what_you_get) to the new services

-- Marketing Strategy
UPDATE services SET
  what_you_get = '["Market & Competitor Analysis", "Target Audience Definition", "Brand Positioning", "Growth Roadmaps & KPIs"]',
  what_you_get_ar = '["تحليل السوق والمنافسين", "تحديد الجمهور المستهدف", "بناء الـ Positioning", "وضع خطط نمو وKPIs"]'
WHERE id = 'marketing_strategy';

-- Marketing & Creative
UPDATE services SET
  what_you_get = '["Creative Design & Branding", "Content Creation", "Paid Advertising Campaigns", "Offline Marketing"]',
  what_you_get_ar = '["تصميم إبداعي", "صناعة المحتوى", "حملات إعلانية مدفوعة", "تسويق ميداني (Offline)"]'
WHERE id = 'marketing_creative';

-- Web & Mobile Development
UPDATE services SET
  what_you_get = '["Custom Websites", "E-commerce Stores", "Mobile Applications", "Performance & Security Optimization"]',
  what_you_get_ar = '["تصميم وتطوير المواقع", "متاجر إلكترونية (E-commerce)", "تطبيقات الموبايل", "تحسين الأداء وتجربة المستخدم"]'
WHERE id = 'web_mobile_dev';
