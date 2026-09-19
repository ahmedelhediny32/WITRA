-- Update existing services to match the public site descriptions
UPDATE services SET
  name = 'Business Consulting',
  headline = 'Marketing and commercial consulting, sales enablement, offer design, and business reviews focused on the numbers that matter.',
  name_ar = 'استشارات تجارية (نمو)',
  headline_ar = 'استشارات تسويقية وتجارية، تطوير الـ Offers، دعم المبيعات، ومراجعات دورية تركز على الأرقام التي تؤثر في البيزنس.'
WHERE id = 'business_consulting';

UPDATE services SET
  name = 'Branding & Identity',
  headline = 'Brand development, brand strategy, logo design, visual identity systems, and brand guidelines that make businesses recognizable and credible.',
  name_ar = 'الهوية والعلامة التجارية',
  headline_ar = 'بناء العلامة التجارية، الاستراتيجية، تصميم الـ Logo، الهوية البصرية، والـ Brand Guidelines.'
WHERE id = 'brand_identity';

-- Mark old granular services as Inactive so they don't show up in the new streamlined dashboard view
UPDATE services SET status = 'Inactive' 
WHERE id IN ('paid_ads', 'seo', 'video_production', 'content_marketing', 'social_media');

-- Insert the new broad services from the public site
INSERT INTO services (
  id, name, category, headline, what_you_get, why_you_need_it, price, standalone, included_in, status, name_ar, headline_ar, what_you_get_ar, why_you_need_it_ar
) VALUES (
  'marketing_strategy', 'Marketing Strategy', 'Strategy',
  'Market & competitor analysis, target-audience definition, positioning, and growth roadmaps built around real business goals.',
  '[]', '', 'Request a Quote', 1, '[]', 'Active',
  'استراتيجية التسويق',
  'تحليل السوق والمنافسين، تحديد الجمهور، بناء الـ Positioning، ووضع خطط نمو مرتبطة بأهداف البيزنس الحقيقية.',
  '[]', ''
),
(
  'marketing_creative', 'Marketing & Creative', 'Digital Marketing',
  'Integrated digital and offline marketing, creative design, content, and paid campaigns — built as one connected system to strengthen your brand, engage your audience, and drive measurable growth.',
  '[]', '', 'Request a Quote', 1, '[]', 'Active',
  'التسويق والإبداع',
  'تسويق رقمي وميداني متكامل، تصميم إبداعي، صناعة محتوى، وحملات مدفوعة — مبنية كمنظومة واحدة لتعزيز علامتك التجارية، التفاعل مع جمهورك، وتحقيق نمو حقيقي.',
  '[]', ''
),
(
  'web_mobile_dev', 'Web & Mobile Development', 'Development',
  'Websites, e-commerce stores, mobile applications, performance optimization, security, and conversion-focused digital experiences.',
  '[]', '', 'Request a Quote', 1, '[]', 'Active',
  'تطوير المواقع والتطبيقات',
  'تصميم وتطوير المواقع، متاجر الـ E-commerce، التطبيقات، وتحسين الأداء والأمان وتجربة المستخدم والتحويلات.',
  '[]', ''
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  headline = excluded.headline,
  name_ar = excluded.name_ar,
  headline_ar = excluded.headline_ar,
  status = excluded.status;
