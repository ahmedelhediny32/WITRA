-- WITRA Marketing Solutions — bilingual catalogue + renewal reminder tracking
-- Adds Arabic-language columns for services/plans/entitlement labels (fixes
-- the "English leaking into the Arabic UI" feedback for catalogue content,
-- which the generic locales.ar dictionary + auto-translator can never cover
-- since it is data stored in D1, not static UI chrome) and a column to track
-- when we last sent a client an "your subscription is about to end" notice
-- (so the new renewal-reminder sweep doesn't re-notify on every request).

PRAGMA foreign_keys = ON;

-- ===================== BILINGUAL CATALOGUE =====================

ALTER TABLE plans ADD COLUMN name_ar TEXT;

ALTER TABLE services ADD COLUMN name_ar TEXT;
ALTER TABLE services ADD COLUMN headline_ar TEXT;
ALTER TABLE services ADD COLUMN what_you_get_ar TEXT NOT NULL DEFAULT '[]';   -- JSON array, mirrors what_you_get
ALTER TABLE services ADD COLUMN why_you_need_it_ar TEXT;

ALTER TABLE entitlement_labels ADD COLUMN label_ar TEXT;

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
ALTER TABLE clients ADD COLUMN last_renewal_reminder TEXT;
