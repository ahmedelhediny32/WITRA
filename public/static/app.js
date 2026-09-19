(function () {
"use strict";

/* =====================================================================
   WITRA Marketing Solutions — Frontend Application
   Talks to the real Hono + D1 backend under /api/*. No mock data here —
   every read/write goes through the API defined in src/routes/*.
   ===================================================================== */

/* ===================== LOCALIZATION (BILINGUAL) ===================== */
var currentLang = localStorage.getItem("lang") || "en";
var locales = {
  en: {
    "Dashboard": "Dashboard",
    "Clients": "Clients",
    "Packages": "Packages",
    "Services": "Services",
    "Service Requests": "Service Requests",
    "Reports & Performance": "Reports & Performance",
    "Reports": "Reports",
    "Activities / Audit Log": "Activities / Audit Log",
    "Activities": "Activities",
    "Settings": "Settings",
    "Team": "Team",
    "Total Clients": "Total Clients",
    "Monthly Recurring Revenue": "Monthly Recurring Revenue",
    "Total Contract Value": "Total Contract Value",
    "Active Subscriptions": "Active Subscriptions",
    "client currently billed": "client currently billed",
    "clients currently billed": "clients currently billed",
    "Renewals Due Soon": "Renewals Due Soon",
    "Subscription renews on": "Subscription renews on",
    "View Client": "View Client",
    "Open Service Requests": "Open Service Requests",
    "Client Health Distribution": "Client Health Distribution",
    "Health is calculated automatically from this month's Content Ops Tracker execution: ≥70% done = On Track, 40–69% = Needs Attention, below 40% = At Risk. A client with no planned items yet shows as Onboarding.": "Health is calculated automatically from this month's Content Ops Tracker execution: ≥70% done = On Track, 40–69% = Needs Attention, below 40% = At Risk. A client with no planned items yet shows as Onboarding.",
    "Client Health Overview": "Client Health Overview",
    "Leads Generated": "Leads Generated",
    "Conversion Rate": "Conversion Rate",
    "Cost per Lead": "Cost per Lead",
    "ROAS": "ROAS",
    "Marketing ROI": "Marketing ROI",
    "Published Reports": "Published Reports",
    "Total Reach": "Total Reach",
    "Avg ROAS": "Avg ROAS",
    "Client Performance Breakdown": "Client Performance Breakdown",
    "Subscription": "Subscription",
    "Requests": "Requests",
    "New Report": "New Report",
    "Edit": "Edit",
    "Delete": "Delete",
    "New Performance Report": "New Performance Report",
    "Edit Report": "Edit Report",
    "e.g. August 2026": "e.g. August 2026",
    "Reach": "Reach",
    "Engagement": "Engagement",
    "Cost per Lead (EGP)": "Cost per Lead (EGP)",
    "Conversion Rate (%)": "Conversion Rate (%)",
    "ROAS (x)": "ROAS (x)",
    "Status": "Status",
    "Published": "Published",
    "Draft": "Draft",
    "The full report — executive summary, what worked, what didn't, and recommendations — is generated automatically from these numbers. Publishing notifies the client.": "The full report — executive summary, what worked, what didn't, and recommendations — is generated automatically from these numbers. Publishing notifies the client.",
    "Cancel": "Cancel",
    "Save Changes": "Save Changes",
    "Generate Report": "Generate Report",
    "Generating…": "Generating…",
    "Report generated": "Report generated",
    "Report updated": "Report updated",
    "Please choose a client.": "Please choose a client.",
    "Please enter a period, e.g. \"August 2026\".": "Please enter a period, e.g. \"August 2026\".",
    "Delete Report": "Delete Report",
    "Delete this draft report? This cannot be undone.": "Delete this draft report? This cannot be undone.",
    "Published reports cannot be deleted — edit it instead if the numbers were wrong.": "Published reports cannot be deleted — edit it instead if the numbers were wrong.",
    "Deleting…": "Deleting…",
    "Report deleted": "Report deleted",
    "Report": "Report",
    "Close": "Close",
    "Entered by": "Entered by",
    "Executive Summary": "Executive Summary",
    "What Worked": "What Worked",
    "What Didn't": "What Didn't",
    "Recommendations": "Recommendations",
    "Next Month Strategy": "Next Month Strategy",
    "Monthly Reports": "Monthly Reports",
    "Leads Trend": "Leads Trend",
    "No reports yet": "No reports yet",
    "Your first report will appear here once WITRA publishes it — usually early next month.": "Your first report will appear here once WITRA publishes it — usually early next month.",
    "under management": "under management",
    "lifetime value on the books": "lifetime value on the books",
    "awaiting review": "awaiting review",
    "all caught up": "all caught up",
    "Logout": "Logout",
    "Language": "Language",
    "No clients yet": "No clients yet",
    "Create your first client from the Clients page to get started.": "Create your first client from the Clients page to get started.",
    "Client": "Client",
    "Package": "Package",
    "MRR": "MRR",
    "Health": "Health",
    "Renewal": "Renewal",
    "Last Activity": "Last Activity"
  },
  ar: {
    "Current Plan": "الباقة الحالية",
    "renews": "يتجدد",
    "Included Services": "الخدمات المشمولة",
    "Next Step Up": "الباقة التالية",
    "Request Upgrade →": "طلب ترقية →",

    "Subscriptions": "الاشتراكات",
    "Subscription": "الاشتراك",
    "Subscription & Contract": "الاشتراك والعقد",
    "Client Subscriptions": "اشتراكات العملاء",
    "Billing Status": "حالة الفاتورة",
    "Contract Value": "قيمة العقد",
    "Recent Activity": "آخر النشاطات",
    "No recent activity.": "لا يوجد نشاط حديث.",
    "Internal Notes": "ملاحظات داخلية",
    "Internal only — never shown to client": "داخلي فقط — لا يظهر للعميل",
    "Save Notes": "حفظ الملاحظات",
    "Sales notes, delivery notes, risk/retention notes…": "ملاحظات المبيعات، التسليم، المخاطر...",
    "Plans": "الباقات",
    "Edit Plan": "تعديل الباقة",
    "Each tier includes everything in the one before it, plus what's listed. Content Plan (the Content Ops Tracker) unlocks starting at Core.": "كل باقة تتضمن كل ما في الباقة السابقة، بالإضافة للمذكور. خطة المحتوى (متتبع عمليات المحتوى) تبدأ من باقة Core.",
    "Standalone Service": "خدمة مستقلة",
    "Resubscribe": "إعادة الاشتراك",
    "Remove client": "إزالة العميل",
    "client currently billed": "عميل مُفوتر حالياً",
    "clients currently billed": "عملاء مُفوترين حالياً",
    "awaiting review": "بانتظار المراجعة",
    "all caught up": "لا يوجد طلبات",
    "Subscription renews on": "الاشتراك يتجدد في",
    "View Client": "عرض العميل",
    "Upcoming Renewals": "التجديدات القادمة",

    "Suspended": "موقوف",
    "This archives the client and deactivates their portal login. Historical data is kept.": "سيتم أرشفة العميل وإلغاء تفعيل تسجيل دخوله. سيتم الاحتفاظ بالبيانات السابقة.",
    "Client removed": "تم إزالة العميل",
    "Client resubscribed — services reactivated": "تم تجديد الاشتراك — تم تفعيل الخدمات",
    "Requested Access": "الصلاحية المطلوبة",
    "Approving creates their real portal account immediately, using the password the client already set for them. Rejecting just notifies the client — no account is created.": "عند الموافقة، سيتم إنشاء حساب حقيقي لهم فوراً باستخدام الرقم السري الذي حدده العميل. عند الرفض، سيتم إشعار العميل فقط ولن يتم إنشاء حساب.",
    "Review Team Request": "مراجعة طلب الفريق",
    "Request approved — account created": "تمت الموافقة على الطلب — تم إنشاء الحساب",
    "Client Team Requests": "طلبات فريق العميل",
    "pending": "قيد الانتظار",
    "No client team requests yet — these appear here whenever a client asks to add a teammate.": "لا توجد طلبات انضمام للفريق بعد — ستظهر هنا عندما يطلب العميل إضافة عضو جديد لفريقه.",
    "Review": "مراجعة",
    "Add Team Member": "إضافة عضو للفريق",
    "Set by WITRA — this is what they'll use to log in.": "تم تحديده بواسطة WITRA — سيتم استخدامه لتسجيل الدخول.",
    "Team Members only see the clients checked here. Super Admins automatically see everyone.": "أعضاء الفريق يرون فقط العملاء المحددين هنا. المدراء يرون الجميع تلقائياً.",
    "Add to Team": "إضافة للفريق",
    "(overview — open Content Planner for the full calendar)": "(نظرة عامة — افتح مخطط المحتوى للتقويم الكامل)",
    "Add Link": "إضافة رابط",
    "Secondary Color": "اللون الثانوي",
    "Social links saved": "تم حفظ روابط التواصل الاجتماعي",
    "Secondary color updated": "تم تحديث اللون الثانوي",
    "Why you need it": "سبب الأهمية",
    "Adding a teammate is a request — WITRA reviews it and creates their account, so every person who ever gets access is on record.": "إضافة عضو جديد هو طلب — تقوم WITRA بمراجعته وإنشاء حسابه، لضمان تسجيل كل من يحصل على صلاحية الدخول.",
    "Request Team Member": "طلب عضو فريق",
    "Access Level": "مستوى الصلاحية",
    "They'll use this to log in once WITRA approves the request.": "سيستخدمونه لتسجيل الدخول بمجرد موافقة WITRA على الطلب.",
    "Submit Request": "إرسال الطلب",
    "Active Team": "الفريق الفعال",
    "Renewed": "مُجدد",
    "Expired": "منتهي",
    "Cancelled": "ملغى",
    "Active": "نشط",

    "Status": "الحالة",
    "Last Activity": "آخر النشاطات",
    "Service Requests": "طلبات الخدمة",
    "New": "جديد",
    "Catalog": "الخدمات",
    "Activities / Audit Log": "النشاطات / السجل",
    "Activities": "النشاطات",
    "Feed": "السجل",
    "Team request for": "طلب انضمام للفريق من",
    "Viewer": "مشاهد",
    "Manager": "مدير",
    "Notification": "إشعار",
    "Notifications": "الإشعارات",
    "Nothing to see here yet.": "لا يوجد شيء لعرضه حتى الآن.",
    "Mark all as read": "تحديد الكل كمقروء",
    "Client": "العميل",
    "Package": "الباقة",
    "MRR": "العائد المتكرر",
    "Health": "حالة العميل",
    "Renewal": "التجديد",
    "Active Services": "الخدمات الفعالة",
    "Business": "النشاط التجاري",
    "Owner": "المالك",
    "Service": "الخدمة",
    "Requested": "تاريخ الطلب",
    "Notes": "ملاحظات",
    "Period": "الفترة",
    "Reach": "الوصول",
    "Engagement": "التفاعل",
    "Leads": "العملاء المحتملين",
    "ROAS": "العائد على الإعلانات",
    "Access": "الصلاحية",
    "Name": "الاسم",
    "Email": "الإيميل",
    "Role": "الصلاحية",

    "e.g. Sunrise Bakery": "مثل: مخبز الشروق",
    "e.g. Retail": "مثل: تجزئة",
    "Min. 6 characters": "بحد أدنى 6 أحرف",
    "Business Name *": "اسم النشاط التجاري *",
    "Owner Name": "اسم المالك",
    "Industry": "مجال العمل",
    "Location": "الموقع",
    "Portal Email": "إيميل بوابة العميل",
    "Portal Password": "رقم السر لبوابة العميل",
    "Plan": "الباقة",
    "Monthly Recurring Revenue (EGP)": "العائد الشهري المتكرر (جنيه)",

    "Why it matters": "سبب الأهمية",
    "One-time · Sold independently of any plan": "خدمة لمرة واحدة · تُباع بشكل مستقل عن الباقات",
    "Request a Quote": "اطلب تسعير",
    "Included in Core+": "مشمولة في Core+",
    "Included in: ": "مشمولة في: ",
    "Standalone only": "خدمة مستقلة فقط",
    "Standalone only:": "خدمة مستقلة فقط:",
    "+Included in Core": "+ مشمولة في باقة Core",
    "of spend (min 10,000) 15%": "من الميزانية الإعلانية (بحد أدنى 10,000) 15%",
    "15% of spend (min 10,000)": "15% من الميزانية (بحد أدنى 10,000)",
    "8,000 – 15,000 (one-time)": "8,000 - 15,000 (لمرة واحدة)",
    "25,000 – 60,000 (one-time)": "25,000 - 60,000 (لمرة واحدة)",
    "Full Presence & Messaging Audit": "مراجعة شاملة للظهور والرسائل",
    "Competitor & Funnel Analysis": "تحليل المنافسين ومسار المبيعات",
    "Written Growth Diagnosis": "تقرير مكتوب لتشخيص النمو",
    "90-Day Action Plan": "خطة عمل لمدة 90 يومًا",
    "Campaign Strategy": "استراتيجية الحملات",
    "Audience Research": "دراسة الجمهور المستهدف",
    "Ad Creative": "تصميمات الإعلانات",
    "Campaign Setup": "إعداد الحملات",
    "Optimization": "تحسين مستمر للأداء",
    "Retargeting": "إعادة الاستهداف",
    "Performance Reports": "تقارير الأداء",
    "Logo System": "تصميم شعار متكامل",
    "Brand Palette & Typography": "ألوان وخطوط الهوية البصرية",
    "Brand Guidelines": "دليل استخدام الهوية (Brand Guidelines)",
    "Launch Content Kit": "حزمة محتوى الانطلاق",
    "Technical Audit": "مراجعة تقنية",
    "Keyword Strategy": "استراتيجية الكلمات المفتاحية",
    "On-page Optimization": "تحسين صفحات الموقع",
    "Monthly Ranking Reports": "تقارير تصدر شهرية",
    "Concept & Script": "الفكرة وكتابة السيناريو",
    "Shoot Day": "يوم التصوير",
    "Editing": "المونتاج",
    "Platform-ready Cuts": "نسخ جاهزة لمنصات التواصل",
    "Content Calendar": "خطة المحتوى",
    "Copywriting": "كتابة المحتوى",
    "Design & Production": "التصميم والإنتاج",
    "Publishing & Community Replies": "النشر والرد على المتابعين",
    "Daily Posting": "نشر يومي",
    "Community Management": "إدارة المجتمع والردود",
    "Monthly Performance Review": "مراجعة شهرية للأداء",
    "Owner": "مالك",
    "Manager": "مدير",
    "Viewer": "مُشاهد",
    "Pending": "قيد المراجعة",
    "Approved": "مقبول",
    "Rejected": "مرفوض",
    "Upgrade to Gold": "ترقية إلى ذهبي",
    "Upgrade to Premium": "ترقية إلى بريميوم",
    "Active": "مُفعل",
    "Expired": "منتهي",
    "Renewed": "مُجدد",
    "Cancelled": "ملغي",
    "Update Billing Status": "تحديث حالة الاشتراك",
    "Status updated": "تم تحديث الحالة بنجاح",
    "Save": "حفظ",

    "Dashboard": "لوحة التحكم",
    "Clients": "العملاء",
    "Packages": "الباقات",
    "Services": "الخدمات",
    "Service Requests": "طلبات الخدمة",
    "Reports & Performance": "التقارير والأداء",
    "Reports": "التقارير",
    "Activities / Audit Log": "النشاطات / السجل",
    "Activities": "النشاطات",
    "Settings": "الإعدادات",
    "Team": "فريق العمل",
    "Total Clients": "إجمالي العملاء",
    "Monthly Recurring Revenue": "الإيرادات الشهرية",
    "Total Contract Value": "إجمالي قيمة العقود",
    "Active Subscriptions": "الاشتراكات النشطة",
    "client currently billed": "عميل يُفوتر حاليًا",
    "clients currently billed": "عملاء يُفوترون حاليًا",
    "Renewals Due Soon": "اشتراكات قريبة من الانتهاء",
    "Subscription renews on": "الاشتراك يتجدد في",
    "View Client": "عرض العميل",
    "Open Service Requests": "طلبات الخدمة المفتوحة",
    "Client Health Distribution": "توزيع حالة العملاء",
    "Health is calculated automatically from this month's Content Ops Tracker execution: ≥70% done = On Track, 40–69% = Needs Attention, below 40% = At Risk. A client with no planned items yet shows as Onboarding.": "يتم حساب حالة العميل تلقائيًا بناءً على نسبة تنفيذ محتوى الشهر الحالي في متتبع العمليات: ٧٠٪ أو أكثر = على المسار الصحيح، ٤٠–٦٩٪ = يحتاج اهتمام، أقل من ٤٠٪ = في خطر. العميل الذي لا يحتوي على عناصر مخططة بعد يظهر كـ «قيد التهيئة».",
    "Client Health Overview": "نظرة عامة على حالة العملاء",
    "Leads Generated": "العملاء المحتملين",
    "Conversion Rate": "معدل التحويل",
    "Cost per Lead": "تكلفة العميل المحتمل",
    "ROAS": "العائد على الإعلانات",
    "Marketing ROI": "عائد الاستثمار التسويقي",
    "Published Reports": "التقارير المنشورة",
    "Total Reach": "إجمالي الوصول",
    "How these numbers are sourced": "من أين تأتي هذه الأرقام",
    "Reports & Performance numbers are entered manually by the WITRA team based on each platform's native analytics (Meta Business Suite, Google Ads, etc). Each report shows who entered it and when, so the number always has a clear source.": "يتم إدخال أرقام التقارير والأداء يدويًا من فريق WITRA بناءً على تحليلات كل منصة (Meta Business Suite، Google Ads، إلخ). كل تقرير يوضح من قام بإدخاله ومتى، لذا يكون للرقم دائمًا مصدر واضح.",
    "Super Admin / Owner": "مدير أعلى / مالك",
    "WITRA Team Member": "عضو فريق WITRA",
    "Client Owner": "مالك الحساب",
    "Client Manager": "مدير الحساب",
    "Client Editor": "محرر الحساب",
    "Client Viewer": "مشاهد فقط",
    "All clients, services, subscriptions, users, settings, billing, audit logs": "كل العملاء، الخدمات، الاشتراكات، المستخدمين، الإعدادات، الفواتير، سجلات التدقيق",
    "Manage assigned clients' services, content and reports": "إدارة خدمات ومحتوى وتقارير العملاء المعينين",
    "Full access to their own business, team, services, subscription and reports": "صلاحية كاملة على أعماله وفريقه وخدماته واشتراكه وتقاريره",
    "Marketing / content / performance access — no billing or team management": "صلاحية على التسويق/المحتوى/الأداء فقط — بدون الفواتير أو إدارة الفريق",
    "Manage permitted operational items only": "إدارة العناصر التشغيلية المسموح بها فقط",
    "Read-only access": "صلاحية عرض فقط",
    "This matrix reflects the fixed platform role model and is informational only.": "هذا الجدول يعرض نموذج الأدوار الثابت في المنصة، لغرض المعلومة فقط.",
    "Report published": "تم نشر تقرير",
    "Service request submitted": "تم إرسال طلب خدمة",
    "Service activated": "تم تفعيل خدمة",
    "Renewal approaching": "اقتراب موعد التجديد",
    "Payment received / failed": "تم استلام الدفع / فشل الدفع",
    "New team member invited": "تمت دعوة عضو فريق جديد",
    "In-app": "داخل التطبيق",
    "Connected": "متصل",
    "Not connected": "غير متصل",
    "Avg ROAS": "متوسط العائد",
    "Client Performance Breakdown": "تفصيل أداء العملاء",
    "Subscription": "الاشتراك",
    "Requests": "الطلبات",
    "New Report": "تقرير جديد",
    "Edit": "تعديل",
    "Delete": "حذف",
    "New Performance Report": "تقرير أداء جديد",
    "Edit Report": "تعديل التقرير",
    "e.g. August 2026": "مثال: أغسطس 2026",
    "Reach": "الوصول",
    "Engagement": "التفاعل",
    "Cost per Lead (EGP)": "تكلفة العميل المحتمل (جنيه)",
    "Conversion Rate (%)": "معدل التحويل (%)",
    "ROAS (x)": "العائد على الإعلانات",
    "Status": "الحالة",
    "Published": "منشور",
    "Draft": "مسودة",
    "The full report — executive summary, what worked, what didn't, and recommendations — is generated automatically from these numbers. Publishing notifies the client.": "يتم إنشاء التقرير الكامل — الملخص التنفيذي وما نجح وما لم ينجح والتوصيات — تلقائيًا من هذه الأرقام. النشر يرسل إشعارًا للعميل.",
    "Cancel": "إلغاء",
    "Save Changes": "حفظ التعديلات",
    "Generate Report": "إنشاء التقرير",
    "Generating…": "جارٍ الإنشاء…",
    "Report generated": "تم إنشاء التقرير",
    "Report updated": "تم تحديث التقرير",
    "Please choose a client.": "يرجى اختيار عميل.",
    "Please enter a period, e.g. \"August 2026\".": "يرجى إدخال الفترة، مثال: \"أغسطس 2026\".",
    "Delete Report": "حذف التقرير",
    "Delete this draft report? This cannot be undone.": "حذف هذه المسودة؟ لا يمكن التراجع عن هذا الإجراء.",
    "Published reports cannot be deleted — edit it instead if the numbers were wrong.": "لا يمكن حذف التقارير المنشورة — قم بتعديلها إذا كانت الأرقام خاطئة.",
    "Deleting…": "جارٍ الحذف…",
    "Report deleted": "تم حذف التقرير",
    "Report": "تقرير",
    "Close": "إغلاق",
    "Entered by": "أدخله",
    "Executive Summary": "الملخص التنفيذي",
    "What Worked": "ما نجح",
    "What Didn't": "ما لم ينجح",
    "Recommendations": "التوصيات",
    "Next Month Strategy": "استراتيجية الشهر القادم",
    "Monthly Reports": "التقارير الشهرية",
    "Leads Trend": "اتجاه العملاء المحتملين",
    "No reports yet": "لا توجد تقارير بعد",
    "Your first report will appear here once WITRA publishes it — usually early next month.": "سيظهر أول تقرير لك هنا بعد نشره من فريق WITRA — عادةً في بداية الشهر التالي.",
    "under management": "تحت الإدارة",
    "lifetime value on the books": "القيمة الدائمة",
    "awaiting review": "بانتظار المراجعة",
    "all caught up": "مكتمل",
    "Logout": "تسجيل الخروج",
    "Language": "اللغة",
    "No clients yet": "لا يوجد عملاء بعد",
    "Create your first client from the Clients page to get started.": "قم بإنشاء العميل الأول من صفحة العملاء للبدء.",
    "Client": "العميل",
    "Package": "الباقة",
    "MRR": "الإيرادات",
    "Health": "الحالة",
    "Renewal": "التجديد",
    "Last Activity": "آخر نشاط",
    "Command Center": "مركز القيادة",
    "Client Management": "إدارة العملاء",
    "Marketing": "التسويق",
    "Analytics": "التحليلات",
    "Business": "الأعمال",
    "Subscriptions": "الاشتراكات",
    "WITRA Team": "فريق WITRA",
    "Manage": "إدارة",
    "Owner": "المالك",
    "Active Services": "الخدمات النشطة",
    "Plan": "الخطة",
    "Status": "الحالة",
    "Service": "الخدمة",
    "Requested": "مُقدَّم",
    "Requested Date": "تاريخ الطلب",
    "Notes": "ملاحظات",
    "Period": "الفترة",
    "Reach": "الوصول",
    "Engagement": "التفاعل",
    "Leads": "العملاء المحتملين",
    "Name": "الاسم",
    "Email": "البريد الإلكتروني",
    "Role": "الدور",
    "Assigned Clients": "العملاء المعينين",
    "Key Permissions": "الصلاحيات الأساسية",
    "Access": "الوصول",
    "Gold": "ذهبي",
    "Premium": "مميز",
    "Core": "أساسي",
    "On Track": "على المسار",
    "Needs Attention": "يحتاج انتباه",
    "At Risk": "في خطر",
    "Onboarding": "بدء التعامل",
    "Active": "نشط",
    "Trial": "تجريبي",
    "Past Due": "متأخر",
    "WITRA Company Profile": "ملف شركة WITRA",
    "Internal Team Members": "أعضاء الفريق الداخلي",
    "Roles & Permissions": "الأدوار والصلاحيات",
    "Service Catalogue Defaults": "إعدادات كتالوج الخدمات",
    "Notification Settings": "إعدادات الإشعارات",
    "Email Templates": "قوالب البريد الإلكتروني",
    "Security Settings": "إعدادات الأمان",
    "Audit Log": "سجل التدقيق",
    "Data Export & Retention": "تصدير البيانات والاحتفاظ بها",
    "Logo, brand, legal details": "الشعار، العلامة التجارية، التفاصيل القانونية",
    "Add or remove WITRA staff": "إضافة أو إزالة موظفي WITRA",
    "Configure what each role can access": "تكوين ما يمكن لكل دور الوصول إليه",
    "Default pricing and entitlement rules": "التسعير الافتراضي وقواعد الاستحقاق",
    "Email and in-app notification preferences": "تفضيلات الإشعارات عبر البريد والتطبيق",
    "Invitation, reset, and alert wording": "صياغة الدعوات، إعادة التعيين، والتنبيهات",
    "Session policy, MFA readiness": "سياسة الجلسة، جاهزية المصادقة الثنائية",
    "Full privileged-action history": "سجل كامل للإجراءات ذات الصلاحيات",
    "Connected accounts and API access": "الحسابات المرتبطة ووصول API",
    "Invoicing and payment provider settings": "إعدادات الفوترة ومزود الدفع",
    "Export or archive tenant data": "تصدير أو أرشفة بيانات المستأجر",
    "Portfolio Performance Snapshot": "لمحة عن أداء المحفظة",
    "No reports yet": "لا توجد تقارير بعد",
    "Reports will appear here once published for any client.": "ستظهر التقارير هنا بعد نشرها لأي عميل.",
    "Latest Period": "آخر فترة",
    "Latest ROAS": "آخر عائد على الإعلانات",
    "Leads Trend — All Clients": "اتجاه العملاء المحتملين — كل العملاء",
    "All Reports": "كل التقارير",
    "All clients": "كل العملاء",
    "All statuses": "كل الحالات",
    "Published": "منشور",
    "Draft": "مسودة",
    "Client Subscriptions": "اشتراكات العملاء",

    "WITRA Ops Tracker": "متتبع سوشيال WITRA",
    "Content Ops Tracker": "متتبع عمليات المحتوى",
    "My Services": "خدماتي",
    "Performance": "الأداء",
    "Business Profile": "ملف النشاط التجاري",
    "My Business": "نشاطي التجاري",
    "My Marketing": "تسويقي",
    "Account": "الحساب",
    "WITRA Command Center": "مركز قيادة WITRA",
    "Recent Activity": "آخر النشاطات",
    "No recent activity.": "لا يوجد نشاط حديث.",
    "Search clients…": "ابحث عن عميل…",
    "All industries": "كل المجالات",
    "All health": "كل الحالات",
    "⇩ Export": "⇩ تصدير",
    "+ Create Client": "+ إنشاء عميل",
    "No clients found": "لا يوجد عملاء مطابقون",
    "Try adjusting your filters, or create a new client.": "جرّب تعديل الفلاتر أو أنشئ عميلًا جديدًا.",
    "Exporting client list…": "جارٍ تصدير قائمة العملاء…",
    "Create Client": "إنشاء عميل",
    "Business Name *": "اسم النشاط التجاري *",
    "Owner Name": "اسم المالك",
    "Industry": "المجال",
    "Location": "الموقع",
    "Portal Email": "بريد الدخول للبوابة",
    "Monthly Recurring Revenue (EGP)": "الإيراد الشهري المتكرر (جنيه)",
    "Cancel": "إلغاء",
    "Client created": "تم إنشاء العميل",
    "← Back to Clients": "→ الرجوع إلى العملاء",
    "👁 Preview Client Portal →": "👁 معاينة بوابة العميل",
    "This Month's Execution": "تنفيذ هذا الشهر",
    "Content": "المحتوى",
    "Stories": "الستوريز",
    "Offline / Field": "أوفلاين / ميداني",
    "What's happening": "ماذا يحدث الآن",
    "No active services yet.": "لا توجد خدمات نشطة بعد.",
    "(read-only — client's own view)": "(للعرض فقط — نفس ما يراه العميل)",
    "Subscription & Contract": "الاشتراك والتعاقد",
    "Contract Value": "قيمة العقد",
    "Billing Status": "حالة الفوترة",
    "Internal Notes": "ملاحظات داخلية",
    "Internal only — never shown to client": "داخلي فقط — لا يظهر للعميل أبدًا",
    "Save Notes": "حفظ الملاحظات",
    "Notes saved": "تم حفظ الملاحظات",
    "Sales notes, delivery notes, risk/retention notes…": "ملاحظات مبيعات، تسليم، مخاطر/احتفاظ…",
    "Standalone Service": "خدمة مستقلة",
    "Plans": "الباقات",
    "Edit Plan": "تعديل الباقة",
    "Edit": "تعديل",
    "Plan Name": "اسم الباقة",
    "Price (EGP / month)": "السعر (جنيه / شهر)",
    "Included Entitlements": "المزايا المتضمنة",
    "Save Changes": "حفظ التغييرات",
    "Plan updated": "تم تحديث الباقة",
    "Each tier includes everything in the one before it, plus what's listed. Content Plan (the Content Ops Tracker) unlocks starting at Core.": "كل باقة تشمل كل ما في الباقة السابقة بالإضافة إلى المذكور. خطة المحتوى (متتبع عمليات المحتوى) تُفعَّل بدءًا من باقة Core.",
    "Marketing Strategy (Diagnose) — sold on its own, independent of any monthly plan. Usually the first thing a new prospect buys before committing to a retainer.": "استراتيجية التسويق (تشخيص) — تُباع بشكل مستقل عن أي باقة شهرية، وغالبًا أول ما يشتريه العميل الجديد قبل الالتزام بباقة.",
    "No requests yet": "لا توجد طلبات بعد",
    "Requests will show up here as clients explore locked services.": "ستظهر الطلبات هنا عندما يستكشف العملاء الخدمات المقفولة.",
    "Review →": "مراجعة",
    "Review Service Request": "مراجعة طلب الخدمة",
    "Internal note": "ملاحظة داخلية",
    "Approve": "موافقة",
    "Reject": "رفض",
    "Request approved": "تمت الموافقة على الطلب",
    "Request rejected": "تم رفض الطلب",
    "Reviewing": "قيد المراجعة",
    "Approved": "مقبول",
    "Rejected": "مرفوض",
    "View full client profile →": "عرض ملف العميل كاملًا",
    "+ Add Service": "+ إضافة خدمة",
    "Add Service": "إضافة خدمة",
    "Edit Service": "تعديل الخدمة",
    "Standalone only": "مستقلة فقط",
    "Category": "الفئة",
    "Headline": "العنوان التعريفي",
    "What You'll Get (one per line)": "ماذا ستحصل عليه (سطر لكل بند)",
    "Price": "السعر",
    "Service updated": "تم تحديث الخدمة",
    "Service added": "تمت إضافة الخدمة",
    "No reports match": "لا توجد تقارير مطابقة",
    "Try adjusting the filters above.": "جرّب تعديل الفلاتر بالأعلى.",
    "View": "عرض",
    "Executive Summary": "الملخص التنفيذي",
    "What Worked": "ما نجح",
    "What Didn't": "ما لم ينجح",
    "Recommendations": "التوصيات",
    "Next Month Strategy": "استراتيجية الشهر القادم",
    "Close": "إغلاق",
    "No activity yet.": "لا يوجد نشاط بعد.",
    "No activity yet": "لا يوجد نشاط بعد",
    "Activity records are immutable audit entries — timestamp, actor, affected client, object, and action.": "سجلات النشاط قيود تدقيق غير قابلة للتعديل — التوقيت، المنفّذ، العميل المتأثر، والإجراء.",
    "+ Add Team Member": "+ إضافة عضو فريق",
    "Send Invite": "إرسال دعوة",
    "Remove": "إزالة",
    "Team member removed": "تمت إزالة عضو الفريق",
    "Everyone here logs into this same platform with their own email and password, scoped to the clients they're assigned.": "كل عضو هنا يسجّل الدخول لنفس المنصة ببريده وكلمة مروره، بصلاحيات مقصورة على العملاء المعينين له.",
    "None yet": "لا يوجد بعد",
    "Profile": "الملف الشخصي",
    "Your name, email, and photo": "اسمك وبريدك وصورتك",
    "Edit under My Business": "يتم التعديل من نشاطي التجاري",
    "Team Members": "أعضاء الفريق",
    "Manage under Team": "تُدار من صفحة الفريق",
    "Notification Preferences": "تفضيلات الإشعارات",
    "Email and in-app alerts": "تنبيهات البريد والتطبيق",
    "Sign In": "تسجيل الدخول",
    "Your Business. Your Marketing. Your Growth.": "نشاطك. تسويقك. نموّك.",
    "Password": "كلمة المرور",
    "Your email": "بريدك الإلكتروني",
    "Forgot password?": "نسيت كلمة المرور؟",
    "Please enter both email and password.": "من فضلك أدخل البريد وكلمة المرور.",
    "Please contact your WITRA account manager to reset your password.": "من فضلك تواصل مع مدير حسابك في WITRA لإعادة تعيين كلمة المرور.",
    "What We're Working On This Month": "ما نعمل عليه هذا الشهر",
    "Your Active Services": "خدماتك النشطة",
    "Explore More": "استكشف المزيد",
    "🔒 Locked": "🔒 مقفولة",
    "Locked": "مقفولة",
    "Request Service →": "طلب الخدمة",
    "Why you need it —": "لماذا تحتاجها —",
    "Service requested — WITRA will follow up shortly": "تم إرسال طلب الخدمة — سيتواصل معك فريق WITRA قريبًا",
    "Upgrade requested — WITRA will be in touch": "تم إرسال طلب الترقية — سيتواصل معك فريق WITRA",
    "Current Plan": "الباقة الحالية",
    "Included Services": "الخدمات المتضمنة",
    "Next Step Up": "الخطوة التالية",
    "Request Upgrade →": "طلب ترقية",
    "Trend": "الاتجاه",
    "Social Accounts": "حسابات التواصل",
    "Add the links to your own pages — WITRA reports pull from these.": "أضف روابط صفحاتك — تقارير WITRA تعتمد عليها.",
    "+ Add Link": "+ إضافة رابط",
    "Brand": "الهوية البصرية",
    "Primary Color": "اللون الأساسي",
    "Logo": "الشعار",
    "Click to upload": "اضغط للرفع",
    "Click to upload — used as your dashboard icon": "اضغط للرفع — يُستخدم كأيقونة لوحتك",
    "Uploaded": "تم الرفع",
    "Click to update": "اضغط للتحديث",
    "Profile saved": "تم حفظ الملف",
    "Brand color updated": "تم تحديث لون الهوية",
    "Logo updated — this now appears as your dashboard icon": "تم تحديث الشعار — أصبح أيقونة لوحتك الآن",
    "+ Invite Team Member": "+ دعوة عضو فريق",
    "Your first report will appear here once WITRA publishes it — usually early next month.": "سيظهر تقريرك الأول هنا بمجرد أن ينشره فريق WITRA — عادة أوائل الشهر القادم.",
    "Updates on your account will show up here.": "ستظهر تحديثات حسابك هنا.",
    "Explore services you don't have yet from My Services.": "استكشف الخدمات غير المفعّلة من صفحة خدماتي.",
    "Plan every Story, post and field activation in one calendar — and know exactly what shipped versus what didn't, every month.": "خطّط كل ستوري ومنشور ونشاط ميداني في تقويم واحد — واعرف بالضبط ما تم تنفيذه وما لم يتم، كل شهر.",
    "Story & content calendars, day by day": "تقويمات الستوري والمحتوى يومًا بيوم",
    "Status tracking — Planned → Posted / Published": "تتبع الحالة — مخطط ← منشور",
    "Automatic monthly execution reports": "تقارير تنفيذ شهرية تلقائية",
    "One shared calendar your whole team can see": "تقويم مشترك واحد يراه فريقك كله",
    "Right now your content plan lives in someone's head or a WhatsApp thread. This turns it into something you can actually see progress on.": "حاليًا خطة المحتوى موجودة في رأس أحدهم أو في شات واتساب. هذه الأداة تحوّلها إلى شيء يمكنك متابعة تقدمه فعليًا.",
    "Included from the": "متاحة بدءًا من باقة",
    "plan and up": "فما فوق",
    "👁 Viewing client portal (WITRA Admin view)": "👁 أنت تعرض بوابة العميل (وضع مشرف WITRA)",
    "← Back to WITRA Admin": "→ الرجوع إلى لوحة WITRA",
    "Notifications": "الإشعارات",
    "Mark all read": "تعليم الكل كمقروء",
    "No notifications yet.": "لا توجد إشعارات بعد.",
    "Connected": "متصل",
    "Not connected": "غير متصل",
    "Just now": "الآن",
    "Just onboarded — no execution data yet.": "انضم حديثًا — لا توجد بيانات تنفيذ بعد.",
    "Onboarding in progress — no content calendar set up yet.": "جارٍ التجهيز — لم يتم إعداد تقويم المحتوى بعد.",
    "Working…": "جارٍ التنفيذ…",
    "Saving…": "جارٍ الحفظ…",
    "Creating…": "جارٍ الإنشاء…",
    "Signing in…": "جارٍ تسجيل الدخول…",
    "Something went wrong": "حدث خطأ ما",
    "Something went wrong. Please try again.": "حدث خطأ ما. حاول مرة أخرى.",
    "Try Again": "إعادة المحاولة",
    "Network error — please check your connection and try again.": "خطأ في الشبكة — تأكد من اتصالك وحاول مرة أخرى.",
    "WITRA's own social media calendar — plan and track the agency's stories, content and offline activity here.": "تقويم سوشيال ميديا WITRA نفسها — خطّط وتابع ستوريز ومحتوى وأنشطة الوكالة من هنا.",
    "Business Consulting (Diagnose)": "استشارات الأعمال (تشخيص)",
    "Paid Advertising": "الإعلانات المدفوعة",
    "Brand Identity": "الهوية البصرية",
    "SEO": "تحسين محركات البحث",
    "Video Production": "إنتاج الفيديو",
    "Content Marketing": "تسويق المحتوى",
    "Social Media Management": "إدارة السوشيال ميديا",
    "Strategy": "الاستراتيجية",
    "Content Plan": "خطة المحتوى",
    "Creative & Design": "الإبداع والتصميم",
    "Digital Marketing": "التسويق الرقمي",
    "Branding & Identity": "العلامة والهوية",
    "Offline Campaigns": "حملات أوفلاين",
    "Know exactly why your marketing isn't working.": "اعرف بالضبط لماذا لا يعمل تسويقك.",
    "Turn your marketing into measurable growth.": "حوّل تسويقك إلى نمو قابل للقياس.",
    "Look like the company you want to become.": "اظهر بمظهر الشركة التي تريد أن تصبح عليها.",
    "Increase organic visibility.": "زد ظهورك المجاني في البحث.",
    "Create professional content.": "أنتج محتوى احترافيًا.",
    "A steady stream of content that sounds like you.": "تدفق مستمر من المحتوى بصوت علامتك.",
    "Your channels, handled daily.": "قنواتك تُدار يوميًا.",
    "Attachments": "المرفقات",
    "Business Documents": "مستندات الأعمال",
    "Strategy, SWOT Analysis, Marketing Plans and other business documents uploaded by WITRA.": "الاستراتيجية وتحليل SWOT وخطط التسويق ومستندات الأعمال الأخرى المرفوعة من WITRA.",
    "No attachments yet": "لا توجد مرفقات بعد",
    "Your business documents will appear here once WITRA uploads them.": "ستظهر مستندات أعمالك هنا بمجرد أن يرفعها فريق WITRA.",
    "Download": "تحميل",
    "Uploaded by": "رفع بواسطة",
    "Upload Attachment": "رفع مرفق",
    "Category": "الفئة",
    "Choose file": "اختر ملف",
    "Upload": "رفع",
    "Uploading…": "جارٍ الرفع…",
    "Attachment uploaded": "تم رفع المرفق",
    "Attachment deleted": "تم حذف المرفق",
    "Delete this attachment?": "حذف هذا المرفق؟",
    "Strategy": "الاستراتيجية",
    "SWOT Analysis": "تحليل SWOT",
    "Marketing Plan": "خطة التسويق",
    "Business Plan": "خطة العمل",
    "Brand Guidelines": "دليل الهوية",
    "Other": "أخرى",
    "Client Attachments": "مرفقات العميل",
    "Upload business documents for this client — visible on their portal.": "ارفع مستندات الأعمال لهذا العميل — ستكون مرئية على بوابته."
  }
};

function t(key) {
  if (currentLang === "ar" && typeof key === "string") {
    if (locales.ar && locales.ar[key]) return locales.ar[key];
    
    // Dynamic Replacements for Activities
    if (key.includes("Team request for")) {
      return key.replace(/Team request for (.+?) was rejected/, "تم رفض طلب الانضمام للفريق من $1")
                .replace(/Team request for (.+?) was approved/, "تم قبول طلب الانضمام للفريق من $1");
    }
    if (key.includes("A draft performance report for")) {
      return key.replace(/A (?:draft|final) performance report for (.+?) was entered/, "تم إدخال تقرير الأداء لشهر $1");
    }
    if (key.includes("was added as a new client")) {
      return key.replace(/<b>(.+?)<\/b> was added as a new client./, "تمت إضافة <b>$1</b> كعميل جديد.");
    }
    if (key.includes("was removed by WITRA")) {
      return key.replace(/<b>(.+?)<\/b> was removed by WITRA./, "تمت إزالة <b>$1</b> بواسطة WITRA.");
    }
    if (key.includes("Subscription") && (key.includes("services") || key.includes("expired") || key.includes("renewed"))) {
      let s = key.replace("Subscription manually set to", "تم تعيين حالة الاشتراك يدوياً إلى")
                 .replace("Subscription <b>expired</b>", "<b>انتهى</b> الاشتراك")
                 .replace("Subscription <b>renewed</b>", "<b>تم تجديد</b> الاشتراك")
                 .replace("— services suspended.", "— وتم إيقاف الخدمات.")
                 .replace("— services active.", "— والخدمات الآن فعالة.")
                 .replace("- services reactivated.", "- وتم إعادة تفعيل الخدمات.")
                 .replace("— services suspended until renewal.", "— تم إيقاف الخدمات حتى التجديد.");
      return s;
    }
    
    
    // Health statuses and reasons
    if (key.includes("Execution is falling behind")) {
      return key.replace(/Execution is falling behind [\-—] just (\d+)% of planned work done \((\d+)\/(\d+)\)\./, "التنفيذ متأخر — تم إنجاز $1% فقط من العمل المخطط ($2/$3).");
    }
    if (key.includes("planned work is executed so far")) {
      return key.replace(/Only (\d+)% of this month's planned work is executed so far \((\d+)\/(\d+)\)\./, "يحتاج انتباه — تم إنجاز $1% من العمل المخطط هذا الشهر ($2/$3).");
    }
    if (key.includes("planned work is executed")) {
      return key.replace(/(\d+)% of this month's planned work is executed \((\d+)\/(\d+)\)\./, "على المسار الصحيح — تم إنجاز $1% من العمل المخطط هذا الشهر ($2/$3).");
    }
    if (key.includes("Just onboarded")) {
      return "بدأ حديثاً — سيتم حساب الحالة بعد بدء التنفيذ.";
    }
    if (key.includes("No execution data yet")) {
      return "لا توجد بيانات تنفيذ بعد — سيتم حساب الحالة بمجرد إضافة مهام لخطة المحتوى.";
    }

    // Dynamic Replacements for Notifications
    if (key.includes("Your subscription")) {
      return key.replace("Your subscription status was changed to", "تم تغيير حالة اشتراكك إلى")
                .replace("Your subscription status is now", "حالة اشتراكك الآن هي")
                .replace("and your services have been paused.", "وتم إيقاف خدماتك مؤقتاً.")
                .replace("and your services are active.", "وخدماتك الآن قيد التفعيل.")
                .replace("has been renewed - your services are active again. Welcome back!", "تم تجديده - خدماتك أصبحت فعالة من جديد. مرحباً بك!");
    }
    if (key.includes("contract has ended")) {
      return key.replace("Your subscription contract has ended and your services have been paused. Please contact WITRA to resubscribe and reactivate your account.", "انتهى عقد اشتراكك وتم إيقاف الخدمات. يرجى التواصل مع WITRA لتجديد الاشتراك وتفعيل حسابك.");
    }
  }
  return (locales[currentLang] && locales[currentLang][key]) || key;
}

// Bilingual catalogue helper: services/plans/entitlement_labels are stored
// in D1 (not static UI chrome), so the locales dictionary / auto-translator
// above can never cover them — this picks the *_ar field the backend now
// serializes (migration 0006) when the UI is in Arabic, falling back to the
// English value if no Arabic translation exists for that row yet.
function trF(enVal, arVal) {
  return (currentLang === "ar" && arVal) ? arVal : enVal;
}

window.toggleLang = function() {
  currentLang = currentLang === "en" ? "ar" : "en";
  localStorage.setItem("lang", currentLang);
  location.reload();
};

document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
if (currentLang === "ar") document.documentElement.classList.add("rtl");
else document.documentElement.classList.remove("rtl");

/* ---- Full-coverage Arabic localizer ----
   Many renderers emit raw English strings. Instead of wrapping every single
   string in t(), a MutationObserver translates every rendered text node
   (and placeholder) through the ar dictionary + the pattern rules below.
   <option> values are preserved before translating their labels so all
   filter/compare logic keeps working against the English stored values. */
var AR_PATTERNS = [
  [/^Good (morning|afternoon|evening), (.+)$/, function (m) { return (m[1] === "morning" ? "صباح الخير" : "مساء الخير") + "، " + m[2]; }],
  [/^(\d+) active$/, "$1 نشطة"],
  [/^Included in: (.+)$/, "متضمنة في: $1"],
  [/^across (\d+) active subscriptions?$/, "عبر $1 اشتراك نشط"],
  [/^Synced from Content Ops Tracker — (.+)$/, "مُزامَن من متتبع عمليات المحتوى — $1"],
  [/^Report — (.+)$/, "تقرير — $1"],
  [/^Edit (.+) Plan$/, "تعديل باقة $1"],
  [/^(\d+) mins? ago$/, "منذ $1 دقيقة"],
  [/^(\d+) hours? ago$/, "منذ $1 ساعة"],
  [/^(\d+) days? ago$/, "منذ $1 يوم"],
  [/^EGP (.+) \/ (month|year) · renews (.+)$/, "EGP $1 / شهر · يتجدد $3"],
  [/^\/ (month|year)$/, "/ شهريًا"],
  [/^Invitation sent to (.+)$/, "تم إرسال الدعوة إلى $1"],
  [/^(\d+) team members currently have access\.$/, "$1 من أعضاء الفريق لديهم وصول حاليًا."],
  [/^(.+) saved$/, "تم حفظ $1"]
];
function arTranslate(sRaw) {
  var s = String(sRaw == null ? "" : sRaw);
  var trimmed = s.trim();
  if (!trimmed) return s;
  var d = locales.ar;
  if (d[trimmed]) return s.replace(trimmed, d[trimmed]);
  for (var i = 0; i < AR_PATTERNS.length; i++) {
    var m = trimmed.match(AR_PATTERNS[i][0]);
    if (m) {
      var rep = AR_PATTERNS[i][1];
      var out = typeof rep === "function" ? rep(m) : trimmed.replace(AR_PATTERNS[i][0], rep);
      return s.replace(trimmed, out);
    }
  }
  return s;
}
function arLocalizeTextNode(node) {
  var p = node.parentNode;
  if (!p || p.nodeName === "SCRIPT" || p.nodeName === "STYLE" || p.nodeName === "TEXTAREA") return;
  var translated = arTranslate(node.textContent);
  if (translated === node.textContent) return;
  if (p.nodeName === "OPTION" && !p.hasAttribute("value")) p.setAttribute("value", node.textContent.trim());
  node.textContent = translated;
}
function arLocalizeTree(root) {
  if (root.nodeType === 3) { arLocalizeTextNode(root); return; }
  if (root.nodeType !== 1) return;
  if (root.hasAttribute && root.hasAttribute("placeholder")) root.setAttribute("placeholder", arTranslate(root.getAttribute("placeholder")));
  if (root.querySelectorAll) root.querySelectorAll("[placeholder]").forEach(function (el) { el.setAttribute("placeholder", arTranslate(el.getAttribute("placeholder"))); });
  var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
  while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(arLocalizeTextNode);
}
if (currentLang === "ar") {
  new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      if (m.type === "characterData") { arLocalizeTextNode(m.target); return; }
      m.addedNodes.forEach(function (n) { arLocalizeTree(n); });
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
}

/* ===================== LOW-LEVEL API HELPER ===================== */
var SESSION_EXPIRED = false;

function apiFetch(path, options) {
  options = options || {};
  var opts = {
    method: options.method || "GET",
    headers: Object.assign({ "Accept": "application/json" }, options.headers || {}),
    credentials: "same-origin"
  };
  if (options.body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(options.body);
  }
  return fetch(path, opts).then(function (res) {
    var isJson = (res.headers.get("Content-Type") || "").indexOf("application/json") !== -1;
    return (isJson ? res.json() : res.text()).catch(function () { return {}; }).then(function (data) {
      if (!res.ok) {
        if (res.status === 401 && path !== "/api/auth/me") {
          SESSION_EXPIRED = true;
        }
        var msg = (data && data.error) ? data.error : ("Request failed (" + res.status + ")");
        var err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
      }
      return data;
    });
  }).catch(function (err) {
    if (err instanceof TypeError) {
      var netErr = new Error("Network error — please check your connection and try again.");
      netErr.status = 0;
      throw netErr;
    }
    throw err;
  });
}

var api = {
  auth: {
    me: function () { return apiFetch("/api/auth/me"); },
    login: function (email, password) { return apiFetch("/api/auth/login", { method: "POST", body: { email: email, password: password } }); },
    logout: function () { return apiFetch("/api/auth/logout", { method: "POST" }); },
    impersonate: function (clientId) { return apiFetch("/api/auth/impersonate/" + clientId, { method: "POST" }); },
    exitImpersonation: function () { return apiFetch("/api/auth/impersonate/exit", { method: "POST" }); }
  },
  dashboard: { get: function () { return apiFetch("/api/dashboard"); } },
  clients: {
    list: function () { return apiFetch("/api/clients"); },
    get: function (id) { return apiFetch("/api/clients/" + id); },
    create: function (payload) { return apiFetch("/api/clients", { method: "POST", body: payload }); },
    saveNotes: function (id, notes) { return apiFetch("/api/clients/" + id + "/notes", { method: "PUT", body: { notes: notes } }); },
    exportCsvUrl: function () { return "/api/clients/export/csv"; },
    archive: function (id) { return apiFetch("/api/clients/" + id, { method: "DELETE" }); },
    resubscribe: function (id) { return apiFetch("/api/clients/" + id + "/resubscribe", { method: "POST" }); }
  },
  plans: {
    list: function () { return apiFetch("/api/plans"); },
    entitlements: function () { return apiFetch("/api/plans/entitlements"); },
    update: function (id, payload) { return apiFetch("/api/plans/" + id, { method: "PUT", body: payload }); }
  },
  services: {
    list: function () { return apiFetch("/api/services"); },
    create: function (payload) { return apiFetch("/api/services", { method: "POST", body: payload }); },
    update: function (id, payload) { return apiFetch("/api/services/" + id, { method: "PUT", body: payload }); }
  },
  requests: {
    list: function () { return apiFetch("/api/requests"); },
    update: function (id, payload) { return apiFetch("/api/requests/" + id, { method: "PUT", body: payload }); },
    mine: function () { return apiFetch("/api/requests/mine"); },
    requestService: function (serviceId) { return apiFetch("/api/requests/service", { method: "POST", body: { serviceId: serviceId } }); },
    requestUpgrade: function (targetPlanId) { return apiFetch("/api/requests/upgrade", { method: "POST", body: { targetPlanId: targetPlanId } }); }
  },
  reports: {
    list: function () { return apiFetch("/api/reports"); },
    mine: function () { return apiFetch("/api/reports/mine"); },
    get: function (id) { return apiFetch("/api/reports/" + id); },
    create: function (payload) { return apiFetch("/api/reports", { method: "POST", body: payload }); },
    update: function (id, payload) { return apiFetch("/api/reports/" + id, { method: "PUT", body: payload }); },
    remove: function (id) { return apiFetch("/api/reports/" + id, { method: "DELETE" }); }
  },
  activities: {
    list: function () { return apiFetch("/api/activities"); },
    mine: function () { return apiFetch("/api/activities/mine"); }
  },
  notifications: {
    list: function () { return apiFetch("/api/notifications"); },
    markAllRead: function () { return apiFetch("/api/notifications/read-all", { method: "PUT" }); },
    mine: function () { return apiFetch("/api/notifications/mine"); },
    markMineRead: function () { return apiFetch("/api/notifications/mine/read-all", { method: "PUT" }); }
  },
  team: {
    witraList: function () { return apiFetch("/api/team/witra"); },
    witraAdd: function (payload) { return apiFetch("/api/team/witra", { method: "POST", body: payload }); },
    witraRemove: function (id) { return apiFetch("/api/team/witra/" + id, { method: "DELETE" }); },
    clientList: function () { return apiFetch("/api/team/client"); },
    clientAdd: function (payload) { return apiFetch("/api/team/client", { method: "POST", body: payload }); },
    clientRequests: function () { return apiFetch("/api/team/client/requests"); },
    requests: function () { return apiFetch("/api/team/requests"); },
    reviewRequest: function (id, status) { return apiFetch("/api/team/requests/" + id, { method: "PUT", body: { status: status } }); }
  },
  contentOps: {
    ofClient: function (clientId) { return apiFetch("/api/content-ops/client/" + clientId); },
    witraGet: function () { return apiFetch("/api/content-ops/witra"); },
    witraPut: function (state) { return apiFetch("/api/content-ops/witra", { method: "PUT", body: { state: state } }); }
  },
  portal: {
    client: function () { return apiFetch("/api/portal/client"); },
    saveBusiness: function (payload) { return apiFetch("/api/portal/business", { method: "PUT", body: payload }); },
    saveSocialLinks: function (links) { return apiFetch("/api/portal/social-links", { method: "PUT", body: { socialLinks: links } }); },
    saveBrand: function (payload) { return apiFetch("/api/portal/brand", { method: "PUT", body: payload }); },
    attachments: function () { return apiFetch("/api/attachments/portal"); },
    downloadAttachment: function (id) { return apiFetch("/api/attachments/portal/" + id + "/download"); }
  },
  attachments: {
    ofClient: function (clientId) { return apiFetch("/api/attachments/client/" + clientId); },
    upload: function (clientId, payload) { return apiFetch("/api/attachments/client/" + clientId, { method: "POST", body: payload }); },
    remove: function (id) { return apiFetch("/api/attachments/" + id, { method: "DELETE" }); }
  },
  reportsMeta: {
    methodologyNote: "Reports & Performance numbers are entered manually by the WITRA team based on each platform's native analytics (Meta Business Suite, Google Ads, etc). Each report shows who entered it and when, so the number always has a clear source."
  },
  settings: {
    witraGet: function () { return apiFetch("/api/settings/witra"); },
    witraSave: function (payload) { return apiFetch("/api/settings/witra", { method: "PUT", body: payload }); },
    clientGet: function () { return apiFetch("/api/settings/client"); },
    clientSave: function (payload) { return apiFetch("/api/settings/client", { method: "PUT", body: payload }); },
    changePassword: function (currentPassword, newPassword) { return apiFetch("/api/settings/password", { method: "PUT", body: { currentPassword: currentPassword, newPassword: newPassword } }); },
    saveProfile: function (name) { return apiFetch("/api/settings/profile", { method: "PUT", body: { name: name } }); }
  }
};

/* ===================== GENERAL HELPERS ===================== */
function esc(v) { if (v === undefined || v === null) return ""; return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function inlineBillingStatusSelect(c) {
  return '<select data-inline-billing-status="' + c.id + '" class="status-badge ' + healthClass(c.billingStatus) + '" style="border:none; outline:none; cursor:pointer; appearance:menulist; padding-right:4px; font-family:inherit; font-weight:600; font-size:12px;">' +
    '<option value="Active"' + (c.billingStatus === 'Active' ? ' selected' : '') + '>' + esc(t("Active")) + '</option>' +
    '<option value="Renewed"' + (c.billingStatus === 'Renewed' ? ' selected' : '') + '>' + esc(t("Renewed")) + '</option>' +
    '<option value="Expired"' + (c.billingStatus === 'Expired' ? ' selected' : '') + '>' + esc(t("Expired")) + '</option>' +
    '<option value="Cancelled"' + (c.billingStatus === 'Cancelled' ? ' selected' : '') + '>' + esc(t("Cancelled")) + '</option>' +
  '</select>';
}

function healthClass(h) { return "status-" + String(h || "").toLowerCase().replace(/ /g, "-"); }
function initials(name) { return (name || "?").split(" ").map(function (w) { return w[0] || ""; }).slice(0, 2).join("").toUpperCase() || "?"; }
function fmtMoney(n) { var num = Number(n) || 0; return num.toLocaleString("en-US"); }
function todayIso() { return new Date().toISOString().slice(0, 10); }
function currentMonthKey() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
function planNameFromList(plans, id) { var p = (plans || []).filter(function (p) { return p.id === id; })[0]; return p ? p.name : id; }
function clientHasEntitlement(plans, client, key) {
  var plan = (plans || []).filter(function (p) { return p.id === client.planId; })[0];
  return !!(plan && plan.entitlements.indexOf(key) !== -1);
}
function timeAgo(iso) {
  if (!iso) return "";
  var t = new Date(iso.replace(" ", "T") + (iso.indexOf("Z") === -1 && iso.indexOf("+") === -1 ? "Z" : ""));
  if (isNaN(t.getTime())) return esc(iso);
  var diffMs = Date.now() - t.getTime();
  var mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return mins + " min" + (mins === 1 ? "" : "s") + " ago";
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + " hour" + (hrs === 1 ? "" : "s") + " ago";
  var days = Math.floor(hrs / 24);
  if (days < 7) return days + " day" + (days === 1 ? "" : "s") + " ago";
  return t.toISOString().slice(0, 10);
}
// Content Ops Tracker iframes post their real content height back to us
// (see content-ops.html's embed auto-resize script) so we can size the
// iframe to fit exactly — no fixed box, no inner scrollbar, no "floating
// slider" look. One listener handles every tracker iframe on the page.
window.addEventListener("message", function (e) {
  if (!e.data || e.data.source !== "witra-content-ops" || e.data.type !== "resize") return;
  document.querySelectorAll(".tracker-frame-wrap iframe, .tracker-frame-full iframe").forEach(function (f) {
    if (f.contentWindow === e.source) f.style.height = Math.max(320, e.data.height) + "px";
  });
});

function debounce(fn, wait) {
  var t;
  return function () {
    var args = arguments, ctx = this;
    clearTimeout(t);
    t = setTimeout(function () { fn.apply(ctx, args); }, wait);
  };
}

/* ===================== STATE ===================== */
var state = {
  booted: false,
  view: "login",              // "login" | "admin" | "client"
  currentUser: null,          // { id, email, name, userType, role, clientId, assignedClients, avatarImage }
  impersonatingClientId: null,
  adminSection: "dashboard",
  clientSection: "dashboard",
  adminViewingClientId: null, // client id shown on admin's client-profile page
  viewingClientId: null,      // resolved client id for the client-portal view
  sidebarOpen: false,
  _witraInviteOpen: false,
  _inviteFormOpen: false
};

/* small in-memory caches, invalidated on relevant mutations */
var CACHE = { plans: null, entitlements: null, services: null };
function invalidateCache(keys) { (keys || Object.keys(CACHE)).forEach(function (k) { CACHE[k] = null; }); }
function getPlans() { if (CACHE.plans) return Promise.resolve(CACHE.plans); return api.plans.list().then(function (r) { CACHE.plans = r.plans; return r.plans; }); }
function getEntitlements() { if (CACHE.entitlements) return Promise.resolve(CACHE.entitlements); return api.plans.entitlements().then(function (r) { CACHE.entitlements = r.entitlements; return r.entitlements; }); }
function getServices() { if (CACHE.services) return Promise.resolve(CACHE.services); return api.services.list().then(function (r) { CACHE.services = r.services; return r.services; }); }

/* ===================== MODAL + TOAST ===================== */
function openModal(title, bodyHtml, footHtml) {
  closeModal();
  var wrap = document.createElement("div");
  wrap.className = "modal-overlay";
  wrap.id = "activeModal";
  wrap.innerHTML = '<div class="modal-box"><div class="modal-head"><h3>' + esc(title) + '</h3><button class="modal-close" data-close-modal="1">✕</button></div>' +
    '<div class="modal-body">' + bodyHtml + '</div>' +
    (footHtml ? '<div class="modal-foot">' + footHtml + '</div>' : '') +
    '</div>';
  document.body.appendChild(wrap);
  wrap.addEventListener("click", function (e) { if (e.target === wrap) closeModal(); });
  wrap.querySelectorAll("[data-close-modal]").forEach(function (b) { b.addEventListener("click", closeModal); });
}
function closeModal() {
  var m = document.getElementById("activeModal");
  if (m) m.remove();
}
function toast(msg, type) {
  var old = document.getElementById("activeToast");
  if (old) old.remove();
  var t = document.createElement("div");
  t.className = "toast" + (type === "error" ? " toast-error" : type === "success" ? " toast-success" : "");
  t.id = "activeToast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function () { if (t.parentNode) t.remove(); }, 2600);
}
function errorToast(err) { toast((err && err.message) || "Something went wrong. Please try again.", "error"); }

function setButtonLoading(btn, loading, labelWhenLoading) {
  if (!btn) return;
  if (loading) {
    btn.dataset._label = btn.innerHTML;
    btn.innerHTML = '<span class="inline-spinner"></span>' + (labelWhenLoading || "Working…");
    btn.disabled = true;
  } else {
    if (btn.dataset._label) btn.innerHTML = btn.dataset._label;
    btn.disabled = false;
  }
}

/* ===================== ROOT RENDER / BOOT ===================== */
function showAppLoading() {
  document.getElementById("root").innerHTML = '<div class="app-loading"><div class="spinner"></div></div>';
}

function boot() {
  showAppLoading();
  api.auth.me().then(function (res) {
    state.booted = true;
    if (res.authenticated) {
      state.currentUser = res.user;
      state.impersonatingClientId = res.impersonatingClientId;
      if (res.view === "client") {
        state.view = "client";
        state.viewingClientId = res.user.clientId;
        state.clientSection = "dashboard";
      } else {
        state.view = "admin";
        state.adminSection = "dashboard";
      }
    } else {
      state.view = window.location.pathname === "/login" ? "login" : "public";
    }
    render();
  }).catch(function () {
    state.booted = true;
    state.view = window.location.pathname === "/login" ? "login" : "public";
    render();
  });
}

function render() {
  var root = document.getElementById("root");
  if (state.view === "public") { window.renderPublicSite(); return; }
  if (state.view === "login") { root.innerHTML = loginHtml(); bindLoginEvents(); return; }
  if (state.view === "admin") { root.innerHTML = shellHtml("admin"); bindShellEvents(); renderAdminSection(); return; }
  if (state.view === "client") { root.innerHTML = shellHtml("client"); bindShellEvents(); renderClientSection(); return; }
}

/* ===================== LOGIN ===================== */
function loginHtml(errorMsg) {
  return '<div class="login-screen"><div class="login-card">' +
    '<img class="login-mark" alt="WITRA" src="/static/img/witra-mark.png">' +
    '<h1>WITRA Marketing Solutions</h1>' +
    '<div class="login-tag">Your Business. Your Marketing. Your Growth.</div>' +
    (errorMsg ? '<div class="login-error">' + esc(errorMsg) + '</div>' : '') +
    '<div class="login-field"><label>Email</label><input type="email" id="loginEmail" placeholder="Your email" autocomplete="username"></div>' +
    '<div class="login-field"><label>Password</label><input type="password" id="loginPassword" placeholder="••••••••••••" autocomplete="current-password"></div>' +
    '<button class="login-submit" id="loginSubmit">Sign In</button>' +
    '<a class="login-forgot" href="#" id="loginForgot">Forgot password?</a>' +
    '</div></div>';
}
function bindLoginEvents() {
  var submitBtn = document.getElementById("loginSubmit");
  var emailInput = document.getElementById("loginEmail");
  var passInput = document.getElementById("loginPassword");
  function doLogin() {
    var email = (emailInput.value || "").trim();
    var password = passInput.value || "";
    if (!email || !password) {
      renderLoginError("Please enter both email and password.");
      return;
    }
    setButtonLoading(submitBtn, true, "Signing in…");
    api.auth.login(email, password).then(function (res) {
      state.currentUser = res.user;
      state.impersonatingClientId = null;
      if (res.view === "client") {
        state.view = "client";
        state.viewingClientId = res.user.clientId;
        state.clientSection = "dashboard";
      } else {
        state.view = "admin";
        state.adminSection = "dashboard";
      }
      render();
    }).catch(function (err) {
      setButtonLoading(submitBtn, false);
      renderLoginError(err.message);
    });
  }
  submitBtn.addEventListener("click", doLogin);
  passInput.addEventListener("keydown", function (e) { if (e.key === "Enter") doLogin(); });
  emailInput.addEventListener("keydown", function (e) { if (e.key === "Enter") doLogin(); });
  var forgot = document.getElementById("loginForgot");
  if (forgot) forgot.addEventListener("click", function (e) {
    e.preventDefault();
    toast("Please contact your WITRA account manager to reset your password.");
  });
}
function renderLoginError(msg) {
  var card = document.querySelector(".login-card");
  if (!card) return;
  var existing = card.querySelector(".login-error");
  if (existing) { existing.textContent = msg; return; }
  var div = document.createElement("div");
  div.className = "login-error";
  div.textContent = msg;
  var tag = card.querySelector(".login-tag");
  tag.insertAdjacentElement("afterend", div);
}

/* ===================== SHELL (sidebar + topbar) ===================== */
var ADMIN_NAV = [
  { group: "Command Center", items: [{ id: "dashboard", label: "Dashboard", icon: "◆" }] },
  { group: "Client Management", items: [
    { id: "clients", label: "Clients", icon: "◈" },
    { id: "diagnostic-leads", label: "Diagnostic Leads", icon: "◇" },
    { id: "subscriptions", label: "Subscriptions", icon: "◇" },
    { id: "requests", label: "Service Requests", icon: "✎" }
  ]},
  { group: "Marketing", items: [
    { id: "services", label: "Services", icon: "✦" },
    { id: "witra-ops", label: "WITRA Ops Tracker", icon: "▧" }
  ]},
  { group: "Analytics", items: [{ id: "reports", label: "Reports & Performance", icon: "▤" }] },
  { group: "Business", items: [
    { id: "activities", label: "Activities / Audit Log", icon: "≡" },
    { id: "witra-team", label: "WITRA Team", icon: "◉" }
  ]},
  { group: "", items: [{ id: "settings", label: "Settings", icon: "⚙" }] }
];
var CLIENT_NAV = [
  { group: "", items: [{ id: "dashboard", label: "Dashboard", icon: "◆" }] },
  { group: "My Business", items: [
    { id: "business", label: "Business Profile", icon: "◈" },
    { id: "attachments", label: "Attachments", icon: "◫" }
  ]},
  { group: "My Marketing", items: [
    { id: "content-planner", label: "Content Ops Tracker", icon: "▧" },
    { id: "services", label: "My Services", icon: "✦" },
    { id: "reports", label: "Reports & Performance", icon: "▤" }
  ]},
  { group: "Account", items: [
    { id: "subscription", label: "Subscription", icon: "◇" },
    { id: "activities", label: "Activities", icon: "≡" },
    { id: "requests", label: "Requests", icon: "✎" },
    { id: "team", label: "Team", icon: "◉" },
    { id: "settings", label: "Settings", icon: "⚙" }
  ]}
];

function shellHtml(mode) {
  var nav = mode === "admin" ? ADMIN_NAV : CLIENT_NAV;
  var activeId = mode === "admin" ? state.adminSection : state.clientSection;

  var navHtml = nav.map(function (g) {
    var groupLabel = g.group ? '<div class="sidebar-group-label">' + esc(t(g.group)) + '</div>' : '';
    var items = g.items.map(function (it) {
      var effectiveActive = mode === "admin" && state.adminSection === "client-profile" ? "clients" : activeId;
      return '<a class="sidebar-link ' + (it.id === effectiveActive ? 'active' : '') + '" data-nav="' + it.id + '"><span class="icon">' + it.icon + '</span>' + esc(t(it.label)) + '</a>';
    }).join('');
    return '<div class="sidebar-group">' + groupLabel + items + '</div>';
  }).join('');

  var brandName = mode === "admin" ? "WITRA" : "…";
  var brandSub = mode === "admin" ? "Marketing Solutions" : "powered by WITRA";

  var userBlock = mode === "admin"
    ? '<div class="sidebar-user"><div class="avatar">' + initials(state.currentUser ? state.currentUser.name : "") + '</div><div class="who"><b>' + esc(state.currentUser ? state.currentUser.name : "") + '</b><span>' + esc(state.currentUser ? state.currentUser.role : "") + '</span></div></div>'
    : '<div class="sidebar-user"><div class="avatar" id="clientSidebarAvatar">…</div><div class="who"><b id="clientSidebarName">…</b><span>Client</span></div></div>';

  var banner = "";
  if (mode === "client" && state.impersonatingClientId) {
    banner = '<div class="impersonation-banner"><span>👁 Viewing client portal (WITRA Admin view)</span><a data-nav="exit-impersonation">← Back to WITRA Admin</a></div>';
  }

  // The bell used to only render for "admin" — the client portal had no
  // notification UI at all, so even once the backend fires notifications,
  // a client user (or WITRA impersonating one) had nowhere to see them.
  var bellHtml = '<div class="notif-wrap" id="notifWrap"><button class="bell-btn" id="bellBtn">🔔<span id="bellDotSlot"></span></button></div>';

  // Admin mode uses the wide horizontal lockup; client mode uses the compact
  // near-square mark so it renders crisp at small sidebar sizes (the wide
  // lockup squished into a tiny box used to look blurry/distorted).
  var markSrc = mode === "client" ? "/static/img/witra-mark-square.png" : "/static/img/witra-logo-new.png";

  // Client sidebar brand: show uploaded logo (PNG, no bg) or fallback initials
  var clientBrandHtml = '';
  if (mode === "client") {
    clientBrandHtml = '<div id="sidebarClientLogo" class="client-logo-fallback" style="background:var(--accent);"><span>…</span></div>' +
      '<div class="client-brand-info"><div class="name" id="sidebarBrandName">' + esc(brandName) + '</div>' +
      '<div class="sub"><span class="powered-by-tag">⚡ ' + esc(brandSub) + '</span></div></div>';
  }

  return '<div class="app-shell">' +
    '<div class="sidebar-overlay" id="sidebarOverlay"></div>' +
    '<div class="sidebar" id="sidebar">' +
    '<div class="sidebar-brand' + (mode === "client" ? " sidebar-brand-client" : "") + '">' +
    (mode === "admin" ? '<img class="mark" alt="WITRA" src="' + markSrc + '">' : clientBrandHtml) +
    '</div>' +
    '<div style="flex:1;overflow-y:auto;">' + navHtml + '</div>' +
    '<div class="sidebar-footer">' + userBlock + '<a class="sidebar-logout" data-nav="logout">' + esc(t("Logout")) + '</a></div>' +
    '</div>' +
    '<div class="main">' +
    banner +
    '<div class="topbar"><button class="sidebar-toggle-btn" id="sidebarToggleBtn">☰</button><h2 id="topbarTitle"></h2>' +
    '<div class="topbar-right"><button onclick="window.toggleLang()" class="btn" style="padding:4px 10px; margin-right: 12px; font-weight: bold; background: var(--canvas); border: 1px solid var(--line); border-radius: 8px;">' + (currentLang === "en" ? "Ar" : "En") + '</button>' + bellHtml + '</div>' +
    '</div>' +
    '<div class="content" id="content"><div class="content-loading"><div class="spinner"></div></div></div>' +
    '</div>' +
    '</div>';
}

function bindShellEvents() {
  var toggleBtn = document.getElementById("sidebarToggleBtn");
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("sidebarOverlay");
  if (toggleBtn) toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
  });
  if (overlay) overlay.addEventListener("click", function () {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  });

  if (state.view === "client") {
    api.portal.client().then(function (res) {
      var c = res.client;
      // Update brand name
      var brandNameEl = document.getElementById("sidebarBrandName");
      if (brandNameEl) brandNameEl.textContent = c.name;
      // Update sidebar logo: use uploaded PNG or fallback to initials with brand color
      var logoSlot = document.getElementById("sidebarClientLogo");
      if (logoSlot) {
        if (c.logoImage) {
          logoSlot.outerHTML = '<img id="sidebarClientLogo" class="client-logo-img" src="' + c.logoImage + '" alt="' + esc(c.name) + '">';
        } else {
          logoSlot.style.background = c.logoColor || 'var(--accent)';
          logoSlot.innerHTML = initials(c.name);
        }
      }
      var nameEl = document.getElementById("clientSidebarName");
      if (nameEl) nameEl.textContent = c.owner;
      var avatarEl = document.getElementById("clientSidebarAvatar");
      if (avatarEl) avatarEl.textContent = initials(c.owner);
    }).catch(function () { /* non-fatal */ });
  }

  refreshBellDot();
}

// Notification calls used to be hardcoded to the admin (WITRA-wide) list —
// this picks the right feed depending on which shell is showing.
function notifApiForView() {
  return state.view === "client" ? { list: api.notifications.mine, markAllRead: api.notifications.markMineRead } : { list: api.notifications.list, markAllRead: api.notifications.markAllRead };
}

function refreshBellDot() {
  notifApiForView().list().then(function (res) {
    var hasUnread = res.notifications.some(function (n) { return !n.read; });
    var slot = document.getElementById("bellDotSlot");
    if (slot) slot.innerHTML = hasUnread ? '<span class="bell-dot"></span>' : '';
  }).catch(function () { /* non-fatal */ });
}

function notifPanelHtml(notifications) {
  var unread = notifications.filter(function(n) { return !n.read; });
  return '<div class="notif-panel" id="notifPanel">' +
    '<div class="notif-panel-head">' + esc(t("Notifications")) + '</div>' +
    (unread.length ? unread.map(function (n) {
      return '<div class="notif-item"><div class="dot"></div><div><div>' + t(n.text) + '</div><div class="time">' + timeAgo(n.time) + '</div></div></div>';
    }).join('') : '<div class="notif-item"><div>' + esc(t("No new notifications.")) + '</div></div>') +
    '</div>';
}

/* ===================== SHARED RENDER HELPERS ===================== */
var KPI_ICONS = { "Total Clients": "◈", "On Track": "●", "Needs Attention": "▲", "At Risk": "■", "Active Subscriptions": "◇", "MRR": "$", "Total Contract Value": "Σ", "Open Service Requests": "✎", "Leads Generated": "◈", "Conversion Rate": "%", "Cost per Lead": "$", "ROAS": "×", "Marketing ROI": "↑", "Published Reports": "▦", "Stories": "▧", "Content": "▤" };
function kpi(label, val, deltaClass) {
  var icon = KPI_ICONS[label] || "◆";
  return '<div class="kpi-card"><div class="top-row"><div class="icon">' + icon + '</div></div><div class="lbl">' + esc(label) + '</div><div class="val">' + esc(String(val)) + '</div>' + (deltaClass ? '<div class="delta ' + deltaClass + '">●</div>' : '') + '</div>';
}
function kpiHero(icon, label, val, footnote) {
  return '<div class="kpi-hero"><div class="kpi-hero-icon">' + icon + '</div><div class="kpi-hero-body">' +
    '<div class="kpi-hero-lbl">' + esc(label) + '</div><div class="kpi-hero-val">' + esc(String(val)) + '</div>' +
    (footnote ? '<div class="kpi-hero-foot">' + esc(footnote) + '</div>' : '') + '</div></div>';
}
function activityRow(a) {
  return '<div class="activity-row"><div class="activity-dot"></div><div style="flex:1;"><div class="activity-text">' + t(a.text) + '</div></div><div class="activity-time">' + timeAgo(a.time) + '</div></div>';
}
function emptyState(emoji, title, desc) {
  return '<div class="empty-state"><div class="emoji">' + emoji + '</div><h4>' + esc(title) + '</h4><p>' + esc(desc) + '</p></div>';
}
function errorState(err, retryFn) {
  return '<div class="page-error-state"><div class="emoji">⚠️</div><h4>Something went wrong</h4><p class="cell-sub">' + esc(err && err.message) + '</p>' +
    '<button class="btn btn-sm" id="pageRetryBtn">Try Again</button></div>';
}
function bindRetry(retryFn) {
  var btn = document.getElementById("pageRetryBtn");
  if (btn) btn.addEventListener("click", retryFn);
}
function svgLineChart(data, opts) {
  opts = opts || {};
  var height = opts.height || 160; var color = opts.color || "#74254E";
  var n = data.length; var padL = 12, padR = 12, padT = 22, padB = 24;
  var plotW = Math.max(220, (n - 1) * 60); var chartW = plotW + padL + padR; var plotH = height - padT - padB;
  var maxV = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
  var ceiling = Math.ceil(maxV * 1.2);
  function xAt(i) { return n === 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW; }
  function yAt(v) { return padT + plotH - (v / ceiling) * plotH; }
  var pts = data.map(function (d, i) { return xAt(i) + "," + yAt(d.value); }).join(" ");
  var svg = '<svg width="100%" height="' + height + '" viewBox="0 0 ' + chartW + ' ' + height + '" preserveAspectRatio="xMinYMid meet">';
  svg += '<line x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (padL + plotW) + '" y2="' + (padT + plotH) + '" stroke="#E9DFC8"></line>';
  if (n > 1) svg += '<polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2.5"></polyline>';
  data.forEach(function (d, i) {
    var x = xAt(i), y = yAt(d.value);
    svg += '<circle cx="' + x + '" cy="' + y + '" r="3.5" fill="' + color + '"></circle>';
    svg += '<text x="' + x + '" y="' + (y - 8) + '" text-anchor="middle" font-family="IBM Plex Mono" font-size="11" fill="#2B1420">' + d.value + '</text>';
    svg += '<text x="' + x + '" y="' + (padT + plotH + 16) + '" text-anchor="middle" font-family="IBM Plex Sans" font-size="10.5" fill="#715762">' + esc(d.label) + '</text>';
  });
  svg += '</svg>';
  return svg;
}

/* ===================== ADMIN SECTIONS ===================== */
function renderAdminSection() {
  var navActive = state.adminSection === "client-profile" ? "clients" : state.adminSection;
  document.querySelectorAll(".sidebar-link").forEach(function (el) { el.classList.toggle("active", el.getAttribute("data-nav") === navActive); });
  var titles = { dashboard: "WITRA Command Center", clients: "Clients", subscriptions: t("Subscriptions"),
    requests: "Service Requests", "diagnostic-leads": "Diagnostic Leads", services: "Services", "witra-ops": "WITRA Ops Tracker", reports: "Reports & Performance", activities: "Activities / Audit Log",
    "witra-team": "WITRA Team", settings: "Settings" };
  var title = titles[state.adminSection] || "";
  document.getElementById("topbarTitle").textContent = t(title);
  var c = document.getElementById("content");
  c.innerHTML = '<div class="content-loading"><div class="spinner"></div></div>';

  var fn = {
    dashboard: renderAdminDashboard, clients: renderAdminClients,
    subscriptions: renderAdminSubscriptions, requests: renderAdminRequests, "diagnostic-leads": renderAdminDiagnosticLeads, services: renderAdminServices,
    "witra-ops": renderAdminWitraOps,
    reports: renderAdminReports, activities: renderAdminActivities, "witra-team": renderAdminTeam, settings: renderAdminSettings,
    "client-profile": renderAdminClientProfile
  }[state.adminSection];
  if (fn) fn(c); else c.innerHTML = "";
}

function healthBarWidget(counts, total) {
  var segs = [["On Track", "on-track", "var(--green)"], ["Needs Attention", "needs-attention", "var(--amber)"], ["At Risk", "at-risk", "var(--rose)"], ["Onboarding", "onboarding", "var(--grey)"]];
  var bar = segs.map(function (s) {
    var n = counts[s[0]] || 0;
    var pct = total ? Math.round((n / total) * 100) : 0;
    return pct > 0 ? '<div class="health-bar-seg" style="width:' + pct + '%;background:' + s[2] + ';" title="' + esc(t(s[0])) + ': ' + n + '"></div>' : '';
  }).join('');
  var legend = segs.map(function (s) {
    var n = counts[s[0]] || 0;
    var pct = total ? Math.round((n / total) * 100) : 0;
    return '<div class="health-legend-item"><span class="health-dot ' + s[1] + '"></span>' + esc(t(s[0])) + '<b>' + n + '</b><span class="cell-sub">(' + pct + '%)</span></div>';
  }).join('');
  return '<div class="panel-card health-widget"><div class="section-title" style="margin-top:0;">' + esc(t("Client Health Distribution")) + '</div>' +
    '<div class="health-bar-wrap"><div class="health-bar">' + bar + '</div></div>' +
    '<div class="health-legend">' + legend + '</div>' +
    '<p class="cell-sub health-legend-note">' + esc(t("Health is calculated automatically from this month's Content Ops Tracker execution: ≥70% done = On Track, 40–69% = Needs Attention, below 40% = At Risk. A client with no planned items yet shows as Onboarding.")) + '</p></div>';
}


function renderAdminDiagnosticLeads(container) {
  apiFetch("/api/public/diagnostic").then(function (res) {
    var leads = res.leads || [];
    var html = '<div class="section-title">' + esc(t("Diagnostic Leads")) + '</div>';
    html += '<div class="panel-card"><p class="cell-sub" style="margin-top:0;margin-bottom:14px;">New requests from the public WITRA website.</p>';
    if (!leads.length) {
      html += '<div class="cell-sub">No diagnostic requests yet.</div>';
    } else {
      html += '<div class="table-wrap diagnostic-leads-table-wrap"><table class="data-table diagnostic-leads-table"><colgroup><col class="lead-col-name"><col class="lead-col-business"><col class="lead-col-contact"><col class="lead-col-challenge"><col class="lead-col-status"><col class="lead-col-received"></colgroup><thead><tr><th>Name</th><th>Business</th><th>Contact</th><th>Challenge</th><th>Status</th><th>Received</th></tr></thead><tbody>';
      html += leads.map(function (lead) {
        return '<tr><td><div class="cell-main">' + esc(lead.name) + '</div><div class="cell-sub">' + esc(lead.industry || "") + '</div></td>' +
          '<td><div class="lead-cell-text">' + esc(lead.business_name) + '</div></td>' +
          '<td><div class="lead-cell-text">' + esc(lead.email) + '</div><div class="cell-sub lead-phone">' + esc(lead.phone) + '</div></td>' +
          '<td><div class="lead-challenge">' + esc(lead.challenge) + '</div></td>' +
          '<td><select class="status-badge lead-status-select" data-diagnostic-status="' + esc(lead.id) + '">' + ["New", "Contacted", "Qualified", "Diagnostic Booked", "Won", "Lost"].map(function (status) { return '<option' + (lead.status === status ? ' selected' : '') + '>' + esc(status) + '</option>'; }).join('') + '</select></td>' +
          '<td class="mono lead-received">' + esc(String(lead.created_at || "").replace("T", " ").slice(0, 16)) + '</td></tr>';
      }).join("");
      html += '</tbody></table></div>';
    }
    html += '</div>';
    container.innerHTML = html;
    container.querySelectorAll("[data-diagnostic-status]").forEach(function (select) {
      select.addEventListener("change", function () {
        apiFetch("/api/public/diagnostic/" + select.getAttribute("data-diagnostic-status"), { method: "PUT", body: { status: select.value } }).then(function () { toast("Lead status updated", "success"); }).catch(function (err) { errorToast(err); });
      });
    });
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminDiagnosticLeads(container); });
  });
}
function renderAdminDashboard(container) {
  api.dashboard.get().then(function (d) {
    var activeSubs = d.activeSubscriptions != null ? d.activeSubscriptions : d.clients.filter(function (c) { return c.billingStatus === "Active"; }).length;
    var onTrackPct = d.clients.length ? Math.round(((d.counts["On Track"] || 0) / d.clients.length) * 100) : 0;
    var upcoming = d.upcomingRenewals || [];
    var html = '<div class="kpi-hero-row">' +
      kpiHero("◈", "Total Clients", d.clients.length, d.clients.length + " " + t("under management")) +
      kpiHero("$", "Monthly Recurring Revenue", "EGP " + fmtMoney(d.mrr), "across " + activeSubs + " active subscription" + (activeSubs === 1 ? "" : "s")) +
      kpiHero("◇", "Active Subscriptions", activeSubs, activeSubs === 1 ? t("client currently billed") : t("clients currently billed")) +
      kpiHero("✎", "Open Service Requests", d.openRequests, d.openRequests ? t("awaiting review") : t("all caught up")) +
      '</div>';

    if (upcoming.length) {
      html += '<div class="section-title">' + esc(t("Renewals Due Soon")) + '</div>' +
        '<div class="panel-card renewal-reminder-card"><div class="settings-list">' +
        upcoming.map(function (r) {
          return '<div class="settings-row"><div><div class="lbl">' + esc(r.name) + '</div><div class="desc">' + esc(t("Subscription renews on")) + ' <b class="mono">' + esc(r.renewal) + '</b></div></div>' +
            '<button class="btn btn-sm" data-view-profile="' + esc(r.id) + '">' + esc(t("View Client")) + '</button></div>';
        }).join('') + '</div></div>';
    }

    if (d.clients.length === 0) {
      html += emptyState("◈", "No clients yet", "Create your first client from the Clients page to get started.");
      container.innerHTML = html;
      return;
    }

    html += healthBarWidget(d.counts, d.clients.length);

    getPlans().then(function (plans) {
      html += '<div class="section-title">Client Health Overview</div><div class="panel-card">' +
        '<table class="data-table"><thead><tr><th>' + esc(t("Client")) + '</th><th>' + esc(t("Package")) + '</th><th>' + esc(t("MRR")) + '</th><th>' + esc(t("Health")) + '</th><th>' + esc(t("Renewal")) + '</th><th>' + esc(t("Last Activity")) + '</th></tr></thead><tbody>' +
        d.clients.map(function (c) {
          // Intentionally not clickable here — this is a quick health
          // snapshot on the Dashboard, not a navigation list. Use the
          // Clients page (which is clickable) to open a client's profile.
          return '<tr><td class="cell-main">' + esc(c.name) + '</td><td>' + esc(planNameFromList(plans, c.planId)) + '</td>' +
            '<td class="mono">EGP ' + fmtMoney(c.mrr) + '</td>' +
            '<td><div style="display: flex; align-items: center; gap: 6px;"><span class="health-dot ' + c.health.toLowerCase().replace(/ /g, "-") + '" style="margin:0;"></span><span>' + esc(t(c.health)) + '</span></div></td>' +
            '<td class="mono">' + esc(c.renewal) + '</td><td class="cell-sub">' + esc(c.lastActivity) + '</td></tr>';
        }).join('') + '</tbody></table></div>';

      html += '<div class="section-title">Status</div>';
      html += '<div class="service-grid">' + d.clients.map(function (c) {
        return '<div class="panel-card" style="margin-bottom:0;"><div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
          '<div><b>' + esc(c.name) + '</b><div class="cell-sub" style="margin-top:4px;">' + esc(t(c.healthReason)) + '</div></div>' +
          '<span class="status-badge ' + healthClass(c.health) + '">' + esc(t(c.health)) + '</span></div></div>';
      }).join('') + '</div>';

      html += '<div class="section-title">' + esc(t("Recent Activity")) + '</div><div class="panel-card"><div class="activity-feed">' +
        (d.recentActivities.length ? d.recentActivities.map(activityRow).join('') : '<div class="cell-sub">' + esc(t("No recent activity.")) + '</div>') + '</div></div>';

      container.innerHTML = html;
      bindContentDelegation(container);
    });
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminDashboard(container); });
  });
}

function renderAdminClients(container) {
  Promise.all([api.clients.list(), getPlans()]).then(function (r) {
    var clientsList = r[0].clients, plans = r[1];
    var html = '<div class="toolbar">' +
      '<input type="search" id="clientSearchInput" placeholder="Search clients…">' +
      '<select id="clientIndustryFilter"><option value="">All industries</option></select>' +
      '<select id="clientHealthFilter"><option value="">All health</option><option>On Track</option><option>Needs Attention</option><option>At Risk</option></select>' +
      '<span style="flex:1;"></span>' +
      '<button class="btn btn-sm" id="exportClientsBtn">⇩ Export</button>' +
      '<button class="btn btn-primary btn-sm" id="addClientBtn">+ Create Client</button>' +
      '</div>';
    html += '<div id="clientsTableWrap"></div>';
    container.innerHTML = html;

    var industries = Array.from(new Set(clientsList.map(function (c) { return c.industry; }).filter(Boolean)));
    var industrySelect = document.getElementById("clientIndustryFilter");
    industries.forEach(function (ind) { industrySelect.insertAdjacentHTML("beforeend", '<option>' + esc(ind) + '</option>'); });

    function renderTable() {
      var q = (document.getElementById("clientSearchInput").value || "").toLowerCase();
      var ind = document.getElementById("clientIndustryFilter").value;
      var health = document.getElementById("clientHealthFilter").value;
      var filtered = clientsList.filter(function (c) {
        if (q && c.name.toLowerCase().indexOf(q) === -1 && c.owner.toLowerCase().indexOf(q) === -1) return false;
        if (ind && c.industry !== ind) return false;
        if (health && c.health !== health) return false;
        return true;
      });
      var wrap = document.getElementById("clientsTableWrap");
      if (filtered.length === 0) {
        wrap.innerHTML = emptyState("◈", "No clients found", "Try adjusting your filters, or create a new client.");
        return;
      }
      wrap.innerHTML = '<div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Business")) + '</th><th>' + esc(t("Owner")) + '</th><th>' + esc(t("Package")) + '</th><th>' + esc(t("MRR")) + '</th><th>' + esc(t("Health")) + '</th><th>' + esc(t("Active Services")) + '</th><th>' + esc(t("Renewal")) + '</th><th>' + esc(t("Last Activity")) + '</th><th></th></tr></thead><tbody>' +
        filtered.map(function (c) {
          var suspended = c.subscriptionStatus === "suspended";
          var rowAction = suspended
            ? '<button class="btn-icon" data-resubscribe-client="' + c.id + '" title="' + esc(t("Resubscribe")) + '">↻</button>'
            : '<button class="btn-icon row-remove" data-archive-client="' + c.id + '" data-client-name="' + esc(c.name) + '" title="' + esc(t("Remove client")) + '">✕</button>';
          var avatarStyle = c.logoImage ? 'background-image:url(' + c.logoImage + ');background-size:cover;background-position:center;' : 'background:' + c.logoColor + '22;color:' + c.logoColor + ';';
          return '<tr class="clickable client-row" data-view-profile="' + c.id + '">' +
            '<td><div style="display:flex;align-items:center;gap:10px;"><div class="avatar-sm" style="' + avatarStyle + '">' + (c.logoImage ? '' : initials(c.name)) + '</div><div><div class="cell-main">' + esc(c.name) + (suspended ? ' <span class="status-badge status-suspended" style="margin-left:6px;">' + esc(t("Suspended")) + '</span>' : '') + '</div><div class="cell-sub">' + esc(c.industry) + '</div></div></div></td>' +
            '<td>' + esc(c.owner) + '</td><td>' + esc(planNameFromList(plans, c.planId)) + '</td><td class="mono">EGP ' + fmtMoney(c.mrr) + '</td>' +
            '<td><span class="status-badge ' + healthClass(c.health) + '">' + esc(t(c.health)) + '</span></td>' +
            '<td class="cell-sub">' + c.activeServices.length + ' active</td><td class="mono">' + esc(c.renewal) + '</td><td class="cell-sub">' + esc(c.lastActivity) + '</td>' +
            '<td class="row-action-cell">' + rowAction + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      bindContentDelegation(wrap);
      wrap.querySelectorAll("[data-archive-client]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var id = btn.getAttribute("data-archive-client");
          var name = btn.getAttribute("data-client-name");
          if (!confirm(t("Remove") + " " + name + "? " + t("This archives the client and deactivates their portal login. Historical data is kept.")) ) return;
          api.clients.archive(id).then(function () {
            toast(t("Client removed"), "success");
            renderAdminClients(container);
          }).catch(function (err) { toast(err.message, "error"); });
        });
      });
      wrap.querySelectorAll("[data-resubscribe-client]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var id = btn.getAttribute("data-resubscribe-client");
          api.clients.resubscribe(id).then(function () {
            toast(t("Client resubscribed — services reactivated"), "success");
            renderAdminClients(container);
          }).catch(function (err) { toast(err.message, "error"); });
        });
      });
    }
    renderTable();
    document.getElementById("clientSearchInput").addEventListener("input", debounce(renderTable, 150));
    document.getElementById("clientIndustryFilter").addEventListener("change", renderTable);
    document.getElementById("clientHealthFilter").addEventListener("change", renderTable);
    document.getElementById("exportClientsBtn").addEventListener("click", function () { window.open(api.clients.exportCsvUrl(), "_blank"); toast("Exporting client list…"); });
    document.getElementById("addClientBtn").addEventListener("click", function () { createClientModal(plans); });
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminClients(container); });
  });
}

function createClientModal(plans) {
  var body = '<div class="form-grid">' +
    '<div class="form-field"><label>' + esc(t("Business Name *")) + '</label><input type="text" id="ncName" placeholder="' + esc(t("e.g. Sunrise Bakery")) + '"></div>' +
    '<div class="form-field"><label>' + esc(t("Owner Name")) + '</label><input type="text" id="ncOwner"></div>' +
    '</div><div class="form-grid">' +
    '<div class="form-field"><label>' + esc(t("Industry")) + '</label><input type="text" id="ncIndustry" placeholder="' + esc(t("e.g. Retail")) + '"></div>' +
    '<div class="form-field"><label>' + esc(t("Location")) + '</label><input type="text" id="ncLocation"></div>' +
    '</div><div class="form-grid">' +
    '<div class="form-field"><label>' + esc(t("Portal Email")) + '</label><input type="email" id="ncEmail" placeholder="owner@business.com"></div>' +
    '<div class="form-field"><label>' + esc(t("Portal Password")) + '</label><input type="password" id="ncPassword" placeholder="' + esc(t("Min. 6 characters")) + '" autocomplete="new-password"></div>' +
    '</div><div class="form-grid">' +
    '<div class="form-field"><label>' + esc(t("Plan")) + '</label><select id="ncPlan">' + plans.map(function (p) { return '<option value="' + p.id + '">' + esc(t(p.name)) + '</option>'; }).join('') + '</select></div>' +
    '<div class="form-field"><label>' + esc(t("Monthly Recurring Revenue (EGP)")) + '</label><input type="text" id="ncMrr" placeholder="18000"></div>' +
    '</div>' +
    '<div class="form-error" id="ncFormError"></div>';
  var foot = '<button class="btn btn-sm" data-close-modal="1">Cancel</button><button class="btn btn-primary btn-sm" id="ncSaveBtn">Create Client</button>';
  openModal("Create Client", body, foot);

  document.getElementById("ncSaveBtn").addEventListener("click", function () {
    var btn = this;
    var name = document.getElementById("ncName").value.trim();
    var errEl = document.getElementById("ncFormError");
    errEl.textContent = "";
    if (!name) { errEl.textContent = "Business name is required."; return; }
    var pw = document.getElementById("ncPassword").value.trim();
    var portalEmail = document.getElementById("ncEmail").value.trim();
    if (portalEmail && pw.length < 6) { errEl.textContent = "A portal password of at least 6 characters is required when adding portal access."; return; }
    if (!portalEmail && pw) { errEl.textContent = "Enter a portal email before setting a password."; return; }
    setButtonLoading(btn, true, "Creating…");
    api.clients.create({
      name: name,
      owner: document.getElementById("ncOwner").value,
      industry: document.getElementById("ncIndustry").value,
      location: document.getElementById("ncLocation").value,
      portalEmail: portalEmail,
      portalPassword: pw,
      planId: document.getElementById("ncPlan").value,
      mrr: parseInt(document.getElementById("ncMrr").value, 10) || 0
    }).then(function () {
      closeModal();
      state.adminSection = "clients";
      renderAdminSection();
      toast("Client created", "success");
    }).catch(function (err) {
      setButtonLoading(btn, false);
      errEl.textContent = err.message;
    });
  });
}

function renderAdminClientProfile(container) {
  var clientId = state.adminViewingClientId;
  if (!clientId) { container.innerHTML = emptyState("◈", "Client not found", "Go back to the Clients list and pick a client."); return; }

  Promise.all([api.clients.get(clientId), getPlans(), getServices(), api.activities.list()]).then(function (r) {
    var c = r[0].client, plans = r[1], services = r[2], allActivities = r[3].activities;
    document.getElementById("topbarTitle").textContent = c.name;

    var e = c.execution;
    var contentPct = e.contentPlanned ? Math.round((e.contentDone / e.contentPlanned) * 100) : 0;
    var storiesPct = e.storiesPlanned ? Math.round((e.storiesDone / e.storiesPlanned) * 100) : 0;
    var offlinePct = e.offlinePlanned ? Math.round((e.offlineDone / e.offlinePlanned) * 100) : 100;

    var html = '<a class="cell-sub" data-nav="clients" style="cursor:pointer;display:inline-block;margin-bottom:14px;">← Back to Clients</a>';

    var logoStyle = c.logoImage ? 'background-image:url(' + c.logoImage + ');background-size:cover;background-position:center;' : 'background:' + c.logoColor + ';';
    html += '<div class="profile-hero"><div class="logo" style="' + logoStyle + '"></div>' +
      '<div><h1>' + esc(c.name) + '</h1><div class="meta">' + esc(c.owner) + ' · ' + esc(c.industry) + ' · ' + esc(c.location) + '</div></div>' +
      '<div class="right"><span class="status-badge ' + healthClass(c.health) + '">' + esc(t(c.health)) + '</span>' +
      '<button class="btn btn-sm" id="previewPortalBtn">👁 Preview Client Portal →</button></div></div>';

    html += '<div class="health-callout ' + c.health.toLowerCase().replace(/ /g, "-") + '"><div class="dot"></div><div><b>' + esc(t(c.health)) + '</b><p>' + esc(t(c.healthReason)) + '</p></div></div>';

    html += '<div class="section-title">This Month\'s Execution</div>';
    html += '<div class="exec-grid">' +
      '<div class="exec-card"><div class="lbl">Content</div><div class="val">' + e.contentDone + ' / ' + e.contentPlanned + '</div><div class="meter"><div style="width:' + contentPct + '%;"></div></div></div>' +
      '<div class="exec-card"><div class="lbl">Stories</div><div class="val">' + e.storiesDone + ' / ' + e.storiesPlanned + '</div><div class="meter"><div style="width:' + storiesPct + '%;"></div></div></div>' +
      '<div class="exec-card"><div class="lbl">Offline / Field</div><div class="val">' + e.offlineDone + ' / ' + e.offlinePlanned + '</div><div class="meter"><div style="width:' + offlinePct + '%;"></div></div></div>' +
      '</div>';
    html += '<div class="panel-card"><b>What\'s happening</b><p class="exec-reason" style="margin-top:6px;">' + esc(e.note) + '</p></div>';

    html += '<div class="section-title">Active Services</div><div class="panel-card"><div class="service-pill-row">' +
      (c.activeServices.length ? c.activeServices.map(function (sid) {
        var s = services.filter(function (x) { return x.id === sid; })[0];
        return s ? '<div class="service-pill"><span class="dot"></span>' + esc(s.name) + '</div>' : '';
      }).join('') : '<span class="cell-sub">No active services yet.</span>') + '</div></div>';

    if (clientHasEntitlement(plans, c, "content_plan")) {
      html += '<div class="section-title">' + esc(t("Content Ops Tracker")) + ' <span class="cell-sub">' + esc(t("(read-only — client's own view)")) + '</span></div>' +
        '<div class="tracker-frame-wrap" style="margin-bottom:16px;"><iframe src="/static/content-ops.html?clientId=' + encodeURIComponent(c.id) + '&readonly=1&embed=1&view=dashboard' + (currentLang === "ar" ? '&lang=ar' : '') + '" style="width:100%;height:420px;border:0;display:block;" title="Content Ops Tracker (read-only)"></iframe></div>';
    }

    html += '<div class="section-title">' + esc(t("Subscription & Contract")) + '</div><div class="panel-card"><div class="form-grid">' +
      '<div><div class="cell-sub">' + esc(t("Plan")) + '</div><div class="cell-main">' + esc(planNameFromList(plans, c.planId)) + '</div></div>' +
      '<div><div class="cell-sub">' + esc(t("MRR")) + '</div><div class="cell-main mono">EGP ' + fmtMoney(c.mrr) + '</div></div>' +
      '<div><div class="cell-sub">' + esc(t("Contract Value")) + '</div><div class="cell-main mono">EGP ' + fmtMoney(c.contractValue) + '</div></div>' +
      '<div><div class="cell-sub">' + esc(t("Renewal")) + '</div><div class="cell-main mono">' + esc(c.renewal) + '</div></div>' +
      '<div><div class="cell-sub">' + esc(t("Billing Status")) + '</div><div>' + inlineBillingStatusSelect(c) + '</div></div>' +
      '</div></div>';

    var acts = allActivities.filter(function (a) { return a.clientId === c.id; });
    html += '<div class="section-title">Recent Activity</div><div class="panel-card"><div class="activity-feed">' +
      (acts.length ? acts.map(activityRow).join('') : '<div class="cell-sub">No recent activity.</div>') + '</div></div>';

    html += '<div class="section-title">' + esc(t("Internal Notes")) + '</div><div class="panel-card"><span class="internal-note-tag">Internal only — never shown to client</span>' +
      '<textarea class="notes-area" id="internalNotesArea" placeholder="' + esc(t("Sales notes, delivery notes, risk/retention notes…")) + '">' + esc(c.internalNotes || "") + '</textarea>' +
      '<div style="margin-top:10px;text-align:right;"><button class="btn btn-primary btn-sm" id="saveNotesBtn">Save Notes</button></div></div>';

    /* ── Client Attachments section (admin upload) ── */
    html += '<div class="section-title">' + esc(t("Client Attachments")) + '</div>';
    html += '<div class="panel-card"><p class="cell-sub" style="margin-bottom:12px;">' + esc(t("Upload business documents for this client — visible on their portal.")) + '</p>';
    html += '<div id="adminAttachmentsList"><div class="content-loading"><div class="spinner"></div></div></div>';
    html += '<div class="attachment-upload-zone" id="attachmentUploadZone">' +
      '<div class="attachment-upload-form">' +
      '<select id="attachLabel" class="form-input" style="min-width:160px;">' +
      '<option value="Strategy">' + esc(t("Strategy")) + '</option>' +
      '<option value="SWOT Analysis">' + esc(t("SWOT Analysis")) + '</option>' +
      '<option value="Marketing Plan">' + esc(t("Marketing Plan")) + '</option>' +
      '<option value="Business Plan">' + esc(t("Business Plan")) + '</option>' +
      '<option value="Brand Guidelines">' + esc(t("Brand Guidelines")) + '</option>' +
      '<option value="Other">' + esc(t("Other")) + '</option>' +
      '</select>' +
      '<label class="btn btn-sm" style="cursor:pointer;">' + esc(t("Choose file")) + '<input type="file" id="attachFileInput" style="display:none;" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.svg"></label>' +
      '<span id="attachFileName" class="cell-sub" style="flex:1;"></span>' +
      '<button class="btn btn-primary btn-sm" id="attachUploadBtn" disabled>' + esc(t("Upload")) + '</button>' +
      '</div></div></div>';

    container.innerHTML = html;
    bindContentDelegation(container);

    document.getElementById("previewPortalBtn").addEventListener("click", function () {
      api.auth.impersonate(c.id).then(function () {
        state.impersonatingClientId = c.id;
        state.viewingClientId = c.id;
        state.view = "client";
        state.clientSection = "dashboard";
        render();
      }).catch(errorToast);
    });
    document.getElementById("saveNotesBtn").addEventListener("click", function () {
      var btn = this;
      setButtonLoading(btn, true, "Saving…");
      api.clients.saveNotes(c.id, document.getElementById("internalNotesArea").value).then(function () {
        setButtonLoading(btn, false);
        toast("Notes saved", "success");
      }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });
    });
    // Load admin attachments list and bind upload
    loadAdminAttachments(c.id);
    var _attachFile = null;
    document.getElementById("attachFileInput").addEventListener("change", function (e) {
      _attachFile = e.target.files && e.target.files[0];
      document.getElementById("attachFileName").textContent = _attachFile ? _attachFile.name : "";
      document.getElementById("attachUploadBtn").disabled = !_attachFile;
    });
    document.getElementById("attachUploadBtn").addEventListener("click", function () {
      if (!_attachFile) return;
      if (_attachFile.size > 10000000) { toast("File is too large (max ~10 MB).", "error"); return; }
      var btn = this;
      setButtonLoading(btn, true, t("Uploading\u2026"));
      var reader = new FileReader();
      reader.onload = function (evt) {
        api.attachments.upload(c.id, {
          label: document.getElementById("attachLabel").value,
          filename: _attachFile.name,
          mimeType: _attachFile.type,
          fileSize: _attachFile.size,
          fileData: evt.target.result
        }).then(function () {
          setButtonLoading(btn, false);
          toast(t("Attachment uploaded"), "success");
          _attachFile = null;
          document.getElementById("attachFileName").textContent = "";
          document.getElementById("attachUploadBtn").disabled = true;
          document.getElementById("attachFileInput").value = "";
          loadAdminAttachments(c.id);
        }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });
      };
      reader.readAsDataURL(_attachFile);
    });
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminClientProfile(container); });
  });
}

function renderAdminSubscriptions(container) {
  Promise.all([getPlans(), getEntitlements(), getServices(), api.clients.list()]).then(function (r) {
    var plans = r[0], entLabels = r[1], services = r[2], clientsList = r[3].clients;
    var html = '<div class="section-title">' + esc(t("Standalone Service")) + '</div>';
    var bc = services.filter(function (s) { return s.id === "business_consulting"; })[0];
    if (bc) {
      html += '<div class="standalone-service-card">' +
        '<div class="head"><div class="badge-eyebrow">' + esc(t("One-time · Sold independently of any plan")) + '</div>' +
        '<div class="title-row"><h3>' + esc(trF(bc.name, bc.nameAr)) + '</h3><div class="price">' + esc(bc.price) + '</div></div>' +
        '<p class="headline">' + esc(trF(bc.headline, bc.headlineAr) || t("Know exactly why your marketing isn't working.")) + '</p></div>' +
        (bc.whatYouGet && bc.whatYouGet.length ? '<ul class="deliverables">' + (trF(bc.whatYouGet, bc.whatYouGetAr) || bc.whatYouGet).map(function (w) { return '<li>' + esc(t(w)) + '</li>'; }).join('') + '</ul>' : '') +
        (bc.whyYouNeedIt ? '<div class="why"><b>' + esc(t("Why it matters")) + ' —</b> ' + esc(trF(bc.whyYouNeedIt, bc.whyYouNeedItAr)) + '</div>' : '') +
        '<div class="foot"><button class="btn btn-sm" data-edit-service="business_consulting">' + esc(t("Edit")) + '</button></div></div>';
    }

    html += '<div class="section-title">' + esc(t("Plans")) + '</div><div class="plan-card-row">' +
      plans.map(function (p, i) {
        return '<div class="plan-card' + (i === 1 ? ' featured' : '') + '"><div class="name">' + esc(trF(p.name, p.nameAr)) + '</div><div class="price">EGP ' + esc(p.price) + ' <span>/ ' + esc(p.cycle) + '</span></div>' +
          '<ul>' + entLabels.map(function (e) { return '<li class="' + (p.entitlements.indexOf(e.key) === -1 ? 'off' : '') + '">' + esc(trF(e.label, e.labelAr)) + '</li>'; }).join('') + '</ul>' +
          '<div style="margin-top:14px;"><button class="btn btn-sm" data-edit-plan="' + p.id + '">Edit Plan</button></div></div>';
      }).join('') + '</div>';
    html += '<p class="cell-sub" style="margin:-8px 0 20px;">' + esc(t("Each tier includes everything in the one before it, plus what's listed. Content Plan (the Content Ops Tracker) unlocks starting at Core.")) + '</p>';

    html += '<div class="section-title">' + esc(t("Client Subscriptions")) + '</div><div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Client")) + '</th><th>' + esc(t("Plan")) + '</th><th>' + esc(t("Status")) + '</th><th>' + esc(t("Renewal")) + '</th><th>' + esc(t("MRR")) + '</th></tr></thead><tbody>' +
      clientsList.map(function (c) {
        return '<tr class="clickable" data-view-profile="' + c.id + '"><td class="cell-main">' + esc(c.name) + '</td><td>' + esc(planNameFromList(plans, c.planId)) + '</td>' +
          '<td>' + inlineBillingStatusSelect(c) + '</td>' +
          '<td class="mono">' + esc(c.renewal) + '</td><td class="mono">EGP ' + fmtMoney(c.mrr) + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    container.innerHTML = html;
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminSubscriptions(container); });
  });
}

function editPlanModal(planId) {
  var p = (CACHE.plans || []).filter(function (x) { return x.id === planId; })[0];
  if (!p) { errorToast(new Error("Plan not found.")); return; }
  getEntitlements().then(function (entLabels) {
    var body = '<div class="form-grid">' +
      '<div class="form-field"><label>Plan Name</label><input type="text" id="planName" value="' + esc(p.name) + '"></div>' +
      '<div class="form-field"><label>Price (EGP / month)</label><input type="text" id="planPrice" value="' + esc(p.price) + '"></div>' +
      '</div>' +
      '<div class="form-field"><label>Included Entitlements</label><div class="service-pill-row">' +
      entLabels.map(function (e) {
        var checked = p.entitlements.indexOf(e.key) !== -1;
        return '<label style="display:flex;align-items:center;gap:6px;background:var(--canvas);border:1px solid var(--line);border-radius:14px;padding:6px 12px;font-size:12.5px;cursor:pointer;"><input type="checkbox" class="planEntKey" value="' + e.key + '" ' + (checked ? 'checked' : '') + '> ' + esc(e.label) + '</label>';
      }).join('') + '</div></div>' +
      '<div class="form-error" id="planFormError"></div>';
    var foot = '<button class="btn btn-sm" data-close-modal="1">Cancel</button><button class="btn btn-primary btn-sm" id="planSaveBtn">Save Changes</button>';
    openModal("Edit " + p.name + " Plan", body, foot);

    document.getElementById("planSaveBtn").addEventListener("click", function () {
      var btn = this;
      var name = document.getElementById("planName").value.trim();
      var price = document.getElementById("planPrice").value.trim();
      var entitlements = Array.prototype.slice.call(document.querySelectorAll(".planEntKey:checked")).map(function (el) { return el.value; });
      setButtonLoading(btn, true, "Saving…");
      api.plans.update(p.id, { name: name, price: price, entitlements: entitlements }).then(function () {
        invalidateCache(["plans"]);
        closeModal();
        renderAdminSection();
        toast("Plan updated", "success");
      }).catch(function (err) {
        setButtonLoading(btn, false);
        document.getElementById("planFormError").textContent = err.message;
      });
    });
  }).catch(errorToast);
}

/* ===================== ADMIN — SERVICE REQUESTS ===================== */
var _requestsCache = [];

function renderAdminRequests(container) {
  Promise.all([api.requests.list(), api.clients.list()]).then(function (r) {
    _requestsCache = r[0].requests;
    var clientsList = r[1].clients;
    function findClientName(id) {
      var c = clientsList.filter(function (x) { return x.id === id; })[0];
      return c ? c.name : "";
    }
    if (_requestsCache.length === 0) {
      container.innerHTML = emptyState("✎", "No requests yet", "Requests will show up here as clients explore locked services.");
      return;
    }
    var html = '<div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Client")) + '</th><th>' + esc(t("Service")) + '</th><th>' + esc(t("Requested")) + '</th><th>' + esc(t("Status")) + '</th><th>' + esc(t("Notes")) + '</th><th></th></tr></thead><tbody>' +
      _requestsCache.map(function (req) {
        return '<tr><td class="cell-main">' + esc(findClientName(req.clientId)) + '</td><td>' + esc(req.service) + '</td><td class="mono">' + esc(req.requestedDate) + '</td>' +
          '<td><span class="status-badge ' + healthClass(req.status) + '">' + esc(req.status) + '</span></td><td class="cell-sub">' + esc(req.notes || "") + '</td>' +
          '<td>' + (req.status === "Requested" || req.status === "Reviewing" ? '<button class="btn btn-sm" data-review-request="' + req.id + '">Review →</button>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    container.innerHTML = html;
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminRequests(container); });
  });
}

function reviewRequestModal(reqId) {
  var r = _requestsCache.filter(function (x) { return x.id === reqId; })[0];
  if (!r) { errorToast(new Error("Request not found.")); return; }
  api.clients.list().then(function (res) {
    var c = res.clients.filter(function (x) { return x.id === r.clientId; })[0];
    var body = '<p><b>Client:</b> ' + esc(c ? c.name : "") + '</p>' +
      '<p><b>Service:</b> ' + esc(r.service) + '</p>' +
      '<p><b>Requested:</b> ' + esc(r.requestedDate) + '</p>' +
      '<div class="form-field" style="margin-top:14px;"><label>Internal note</label><textarea id="reviewNote" placeholder="Why approve or reject…">' + esc(r.notes || "") + '</textarea></div>' +
      (c ? '<a class="cell-sub" data-close-modal="1" data-view-profile="' + c.id + '" style="cursor:pointer;display:inline-block;margin-top:10px;">View full client profile →</a>' : '');
    var foot = '<button class="btn btn-sm" data-close-modal="1">Cancel</button>' +
      '<button class="btn btn-sm" id="reqRejectBtn" style="border-color:var(--rose);color:var(--rose);">Reject</button>' +
      '<button class="btn btn-primary btn-sm" id="reqApproveBtn">Approve</button>';
    openModal("Review Service Request", body, foot);

    function submitDecision(status, btn) {
      setButtonLoading(btn, true, "Saving…");
      var notes = document.getElementById("reviewNote").value;
      api.requests.update(r.id, { status: status, notes: notes }).then(function () {
        closeModal();
        renderAdminSection();
        toast(status === "Approved" ? "Request approved" : "Request rejected", "success");
      }).catch(function (err) {
        setButtonLoading(btn, false);
        errorToast(err);
      });
    }
    document.getElementById("reqApproveBtn").addEventListener("click", function () { submitDecision("Approved", this); });
    document.getElementById("reqRejectBtn").addEventListener("click", function () { submitDecision("Rejected", this); });
  }).catch(errorToast);
}

/* ===================== ADMIN — SERVICES ===================== */
function renderAdminServices(container) {
  Promise.all([getServices(), getPlans()]).then(function (r) {
    var services = r[0], plans = r[1];
    var html = '<div class="toolbar"><span style="flex:1;"></span><button class="btn btn-primary btn-sm" id="addServiceBtn">+ Add Service</button></div>';
    html += '<div class="service-grid">' + services.map(function (s) {
      return '<div class="service-card"><div class="head"><h4>' + esc(trF(s.name, s.nameAr)) + '</h4><span class="status-badge status-active">' + esc(s.status) + '</span></div>' +
        '<div class="headline">' + esc(trF(s.headline, s.headlineAr)) + '</div>' +
        '<div class="price">' + esc(s.price) + '</div>' +
        '<ul>' + s.whatYouGet.slice(0, 4).map(function (w) { return '<li>' + esc(t(w)) + '</li>'; }).join('') + '</ul>' +
        '<div class="cell-sub">' + esc(t("Included in: ")) + (s.includedIn.length ? s.includedIn.map(function (pid) { return planNameFromList(plans, pid); }).join(", ") : t("Standalone only")) + '</div>' +
        '<div style="margin-top:auto;"><button class="btn btn-sm" data-edit-service="' + s.id + '">Edit</button></div></div>';
    }).join('') + '</div>';
    container.innerHTML = html;
    document.getElementById("addServiceBtn").addEventListener("click", function () { serviceFormModal(null); });
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminServices(container); });
  });
}

function serviceFormModal(serviceId) {
  var s = serviceId ? (CACHE.services || []).filter(function (x) { return x.id === serviceId; })[0] : null;
  var body = '<div class="form-grid">' +
    '<div class="form-field"><label>Name</label><input type="text" id="svcName" value="' + esc(s ? s.name : "") + '"></div>' +
    '<div class="form-field" style="margin-bottom:14px;"><label>Headline</label><input type="text" id="svcHeadline" value="' + esc(s ? s.headline : "") + '"></div>' +
    '<div class="form-field" style="margin-bottom:14px;"><label>What You\'ll Get (one per line)</label><textarea id="svcWhatYouGet" style="min-height:80px;">' + esc(s ? s.whatYouGet.join("\n") : "") + '</textarea></div>' +
    '<div class="form-field"><label>Price</label><input type="text" id="svcPrice" value="' + esc(s ? s.price : "") + '"></div>' +
    '<div class="form-error" id="svcFormError"></div>';
  var foot = '<button class="btn btn-sm" data-close-modal="1">Cancel</button>' +
    '<button class="btn btn-primary btn-sm" id="svcSaveBtn">' + (s ? "Save Changes" : "Add Service") + '</button>';
  openModal(s ? "Edit Service" : "Add Service", body, foot);

  document.getElementById("svcSaveBtn").addEventListener("click", function () {
    var btn = this;
    var name = document.getElementById("svcName").value.trim();
    if (!name) { document.getElementById("svcFormError").textContent = "Service name is required."; return; }
    var fields = {
      name: name,
      category: s ? s.category : "Services",
      headline: document.getElementById("svcHeadline").value,
      whatYouGet: document.getElementById("svcWhatYouGet").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean),
      price: document.getElementById("svcPrice").value
    };
    setButtonLoading(btn, true, "Saving…");
    var req = s ? api.services.update(s.id, fields) : api.services.create(fields);
    req.then(function () {
      invalidateCache(["services"]);
      closeModal();
      renderAdminSection();
      toast(s ? "Service updated" : "Service added", "success");
    }).catch(function (err) {
      setButtonLoading(btn, false);
      document.getElementById("svcFormError").textContent = err.message;
    });
  });
}

/* ===================== ADMIN — WITRA OPS TRACKER ===================== */
function renderAdminWitraOps(container) {
  container.innerHTML =
    '<p class="cell-sub" style="margin-bottom:12px;padding:0 32px;">' + esc(t("WITRA's own social media calendar — plan and track the agency's stories, content and offline activity here.")) + '</p>' +
    '<div class="tracker-frame-wrap tracker-frame-full"><iframe src="/static/content-ops.html?witra=1&embed=1' + (currentLang === "ar" ? '&lang=ar' : '') + '" style="width:100%;height:600px;border:0;display:block;" title="WITRA Ops Tracker"></iframe></div>';
}

/* ===================== ADMIN — REPORTS ===================== */
var _reportsCache = [];
var _reportsFilter = { client: "", status: "" };

function parseRoasNum(v) { return parseFloat(String(v || "0").replace(/[^\d.]/g, "")) || 0; }
function parseReachNum(v) {
  var s = String(v || "0").trim().toUpperCase();
  var mult = 1;
  if (s.indexOf("K") !== -1) { mult = 1000; s = s.replace("K", ""); }
  else if (s.indexOf("M") !== -1) { mult = 1000000; s = s.replace("M", ""); }
  return (parseFloat(s) || 0) * mult;
}

function reportMetricInputValue(value) {
  return value === null || value === undefined ? "" : value;
}

function reportMetricNumber(id) {
  var value = document.getElementById(id).value.trim();
  return value === "" ? null : Number(value);
}

// Manual report entry: WITRA only ever types in the raw numbers (reach,
// engagement, leads, cost per lead, conversion rate, ROAS). The narrative —
// executive summary, what worked, what didn't, recommendations, next month
// strategy — is always generated automatically on the backend from those
// numbers compared against the client's previous report, so the report
// content is never hand-written and always traces back to real metrics.
function reportFormModal(reportId, presetClientId) {
  var rp = reportId ? (_reportsCache || []).filter(function (x) { return x.id === reportId; })[0] : null;
  api.clients.list().then(function (res) {
    var clientsList = res.clients;
    var clientOptions = clientsList.map(function (c) {
      var sel = (rp ? rp.clientId === c.id : presetClientId === c.id) ? " selected" : "";
      return '<option value="' + c.id + '"' + sel + '>' + esc(c.name) + '</option>';
    }).join('');
    var m = rp ? rp.metrics : {
      reach: "", impressions: "", engagement: "", engagementRate: "", leads: "", conversions: "",
      conversionRate: "", adSpend: "", revenue: "", cpl: "", roas: ""
    };
    var visibility = rp ? (rp.visibility || "Client") : "Client";
    var notifyClient = rp ? !!rp.notifyClient : true;

    var body = '<div class="form-grid">' +
      '<div class="form-field"><label>' + esc(t("Client")) + '</label><select id="rpClient"' + (rp ? " disabled" : "") + '>' + clientOptions + '</select></div>' +
      '<div class="form-field"><label>' + esc(t("Period")) + '</label><input type="text" id="rpPeriod" placeholder="' + esc(t("e.g. August 2026")) + '" value="' + esc(rp ? rp.period : "") + '"></div>' +
      '</div>' +
      '<div class="form-grid" style="margin-top:14px;">' +
      '<div class="form-field"><label>' + esc(t("Reach")) + '</label><input type="number" min="0" id="rpReach" value="' + esc(reportMetricInputValue(m.reach)) + '"></div>' +
      '<div class="form-field"><label>Impressions</label><input type="number" min="0" id="rpImpressions" value="' + esc(reportMetricInputValue(m.impressions)) + '"></div>' +
      '<div class="form-field"><label>' + esc(t("Engagement")) + '</label><input type="number" min="0" id="rpEngagement" value="' + esc(reportMetricInputValue(m.engagement)) + '"></div>' +
      '<div class="form-field"><label>Engagement Rate (%)</label><input type="number" min="0" step="0.01" id="rpEngagementRate" value="' + esc(reportMetricInputValue(m.engagementRate)) + '"></div>' +
      '</div><div class="form-grid" style="margin-top:14px;">' +
      '<div class="form-field"><label>' + esc(t("Leads Generated")) + '</label><input type="number" min="0" step="1" id="rpLeads" value="' + esc(reportMetricInputValue(m.leads)) + '"></div>' +
      '<div class="form-field"><label>Conversions</label><input type="number" min="0" step="1" id="rpConversions" value="' + esc(reportMetricInputValue(m.conversions)) + '"></div>' +
      '<div class="form-field"><label>' + esc(t("Conversion Rate (%)")) + '</label><input type="number" min="0" step="0.01" id="rpConversionRate" value="' + esc(reportMetricInputValue(m.conversionRate !== undefined ? m.conversionRate : m.conversion)) + '"></div>' +
      '<div class="form-field"><label>Ad Spend (EGP)</label><input type="number" min="0" step="0.01" id="rpAdSpend" value="' + esc(reportMetricInputValue(m.adSpend)) + '"></div>' +
      '</div><div class="form-grid" style="margin-top:14px;">' +
      '<div class="form-field"><label>Revenue (EGP)</label><input type="number" min="0" step="0.01" id="rpRevenue" value="' + esc(reportMetricInputValue(m.revenue)) + '"></div>' +
      '<div class="form-field"><label>' + esc(t("Cost per Lead (EGP)")) + '</label><input type="number" min="0" step="0.01" id="rpCpl" value="' + esc(reportMetricInputValue(m.cpl)) + '"></div>' +
      '<div class="form-field"><label>' + esc(t("ROAS (x)")) + '</label><input type="number" min="0" step="0.01" id="rpRoas" value="' + esc(reportMetricInputValue(m.roas)) + '"></div>' +
      '</div><div class="form-grid" style="margin-top:14px;">' +
      '<div class="form-field"><label>Channel</label><input type="text" id="rpChannel" value="' + esc(rp ? rp.channel || "" : "") + '" placeholder="Meta, Google, Instagram…"></div>' +
      '<div class="form-field"><label>Service Type</label><input type="text" id="rpServiceType" value="' + esc(rp ? rp.serviceType || "" : "") + '" placeholder="Paid Ads, SEO…"></div>' +
      '<div class="form-field"><label>Campaign</label><input type="text" id="rpCampaign" value="' + esc(rp ? rp.campaign || "" : "") + '"></div>' +
      '</div>' +
      '<div class="form-grid" style="margin-top:14px;"><div class="form-field"><label>Visibility</label><select id="rpVisibility"><option value="Client"' + (visibility === "Client" ? " selected" : "") + '>Client</option><option value="Internal"' + (visibility === "Internal" ? " selected" : "") + '>Internal</option></select></div>' +
      '<div class="form-field"><label>' + esc(t("Status")) + '</label><select id="rpStatus">' +
      '<option value="Draft"' + (rp && rp.status === "Draft" ? " selected" : "") + '>' + esc(t("Draft")) + '</option>' +
      '<option value="Published"' + (rp && rp.status === "Published" ? " selected" : "") + '>' + esc(t("Published")) + '</option><option value="Archived"' + (rp && rp.status === "Archived" ? " selected" : "") + '>Archived</option></select></div></div>' +
      '<label class="cell-sub" style="display:flex;gap:8px;align-items:center;margin-top:12px;"><input type="checkbox" id="rpNotifyClient"' + (notifyClient ? " checked" : "") + '> Notify client when this report is published</label>' +
      '<p class="cell-sub" style="margin-top:10px;">' + esc(t("The full report — executive summary, what worked, what didn't, and recommendations — is generated automatically from these numbers.")) + '</p>' +
      '<div class="form-error" id="rpFormError"></div>';
    var foot = '<button class="btn btn-sm" data-close-modal="1">' + esc(t("Cancel")) + '</button>' +
      '<button class="btn btn-primary btn-sm" id="rpSaveBtn">' + (rp ? esc(t("Save Changes")) : esc(t("Generate Report"))) + '</button>';
    openModal(rp ? t("Edit Report") : t("New Performance Report"), body, foot);

    document.getElementById("rpSaveBtn").addEventListener("click", function () {
      var btn = this;
      var errEl = document.getElementById("rpFormError");
      var clientId = rp ? rp.clientId : document.getElementById("rpClient").value;
      var period = document.getElementById("rpPeriod").value.trim();
      if (!clientId) { errEl.textContent = t("Please choose a client."); return; }
      if (!period) { errEl.textContent = t("Please enter a period, e.g. \"August 2026\"."); return; }
      var payload = {
        clientId: clientId,
        period: period,
        status: document.getElementById("rpStatus").value,
        channel: document.getElementById("rpChannel").value.trim(),
        serviceType: document.getElementById("rpServiceType").value.trim(),
        campaign: document.getElementById("rpCampaign").value.trim(),
        visibility: document.getElementById("rpVisibility").value,
        notifyClient: document.getElementById("rpNotifyClient").checked,
        metrics: {
          reach: reportMetricNumber("rpReach"),
          impressions: reportMetricNumber("rpImpressions"),
          engagement: reportMetricNumber("rpEngagement"),
          engagementRate: reportMetricNumber("rpEngagementRate"),
          leads: reportMetricNumber("rpLeads"),
          conversions: reportMetricNumber("rpConversions"),
          conversionRate: reportMetricNumber("rpConversionRate"),
          adSpend: reportMetricNumber("rpAdSpend"),
          revenue: reportMetricNumber("rpRevenue"),
          cpl: reportMetricNumber("rpCpl"),
          roas: reportMetricNumber("rpRoas")
        }
      };
      setButtonLoading(btn, true, t("Generating…"));
      var req = rp ? api.reports.update(rp.id, payload) : api.reports.create(payload);
      req.then(function (r) {
        closeModal();
        renderAdminSection();
        toast(rp ? t("Report updated") : t("Report generated"), "success");
        if (r && r.report) { _reportsCache = _reportsCache.filter(function (x) { return x.id !== r.report.id; }).concat([r.report]); reportViewModal(r.report.id); }
      }).catch(function (err) {
        setButtonLoading(btn, false);
        errEl.textContent = err.message;
      });
    });
  }).catch(errorToast);
}

function reportDeleteConfirm(reportId) {
  var rp = (_reportsCache || []).filter(function (x) { return x.id === reportId; })[0];
  if (!rp) return;
  if (rp.status === "Published") { errorToast(new Error(t("Published reports cannot be deleted — edit it instead if the numbers were wrong."))); return; }
  var body = '<p>' + esc(t("Delete this draft report? This cannot be undone.")) + '</p>';
  var foot = '<button class="btn btn-sm" data-close-modal="1">' + esc(t("Cancel")) + '</button>' +
    '<button class="btn btn-primary btn-sm" id="rpDeleteConfirmBtn" style="background:var(--rose);border-color:var(--rose);">' + esc(t("Delete")) + '</button>';
  openModal(t("Delete Report"), body, foot);
  document.getElementById("rpDeleteConfirmBtn").addEventListener("click", function () {
    var btn = this;
    setButtonLoading(btn, true, t("Deleting…"));
    api.reports.remove(reportId).then(function () {
      closeModal();
      renderAdminSection();
      toast(t("Report deleted"), "success");
    }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });
  });
}

function renderAdminReports(container) {
  Promise.all([api.reports.list(), api.requests.list(), api.clients.list()]).then(function (r) {
    _reportsCache = r[0].reports;
    var allRequests = r[1].requests;
    var clientsList = r[2].clients;
    function findClientName(id) {
      var c = clientsList.filter(function (x) { return x.id === id; })[0];
      return c ? c.name : id;
    }
    var published = _reportsCache.filter(function (rp) { return rp.status === "Published"; });
    var avgRoas = published.length ? (published.reduce(function (s, rp) { return s + parseRoasNum(rp.metrics.roas); }, 0) / published.length).toFixed(1) : "0";
    var totalLeads = published.reduce(function (s, rp) { return s + (rp.metrics.leads || 0); }, 0);
    var totalReach = published.reduce(function (s, rp) { return s + parseReachNum(rp.metrics.reach); }, 0);
    var openReq = allRequests.filter(function (rq) { return rq.status === "Requested" || rq.status === "Reviewing"; }).length;

    var html = '<div class="methodology-banner"><span class="ico">ℹ</span><div><b>' + esc(t("How these numbers are sourced")) + '</b><p>' + esc(t(api.reportsMeta.methodologyNote)) + '</p></div></div>';
    html += '<div class="section-title">' + esc(t("Portfolio Performance Snapshot")) + '</div>';
    html += '<div class="kpi-grid">' +
      kpi("Published Reports", published.length) +
      kpi("Total Reach", totalReach >= 1000 ? (totalReach / 1000).toFixed(1) + "K" : totalReach) +
      kpi("Leads Generated", totalLeads) +
      kpi("Avg ROAS", avgRoas + "x") +
      kpi("Open Service Requests", openReq) +
      '</div>';

    if (_reportsCache.length === 0) {
        container.innerHTML = html + '<div style="text-align:right; margin-bottom: 16px;"><button class="btn btn-primary btn-sm" id="addReportBtnEmpty">+ ' + esc(t("New Report")) + '</button></div>' + emptyState("📊", t("No reports yet"), t("Reports will appear here once published for any client."));
        document.getElementById("addReportBtnEmpty").addEventListener("click", function () { reportFormModal(null, null); });
        return;
      }

    // Per-client rollup: latest report + trend
    var byClient = {};
    _reportsCache.forEach(function (rp) {
      (byClient[rp.clientId] = byClient[rp.clientId] || []).push(rp);
    });
    html += '<div class="section-title">' + esc(t("Client Performance Breakdown")) + '</div><div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Client")) + '</th><th>' + esc(t("Reports")) + '</th><th>' + esc(t("Latest Period")) + '</th><th>' + esc(t("Leads Generated")) + '</th><th>' + esc(t("Latest ROAS")) + '</th><th>' + esc(t("Avg ROAS")) + '</th><th>' + esc(t("Marketing ROI")) + '</th></tr></thead><tbody>' +
      Object.keys(byClient).map(function (cid) {
        var list = byClient[cid];
        var latest = list[0];
        var pub = list.filter(function (x) { return x.status === "Published"; });
        var avg = pub.length ? (pub.reduce(function (s, x) { return s + parseRoasNum(x.metrics.roas); }, 0) / pub.length).toFixed(1) : "—";
        var latestRoasNum = parseRoasNum(latest.metrics.roas);
        var roi = Math.round((latestRoasNum - 1) * 100) + "%";
        var roiClass = latestRoasNum >= 2 ? "status-published" : (latestRoasNum >= 1 ? "status-needs-attention" : "status-at-risk");
        return '<tr class="clickable" data-view-report="' + latest.id + '"><td class="cell-main">' + esc(findClientName(cid)) + '</td>' +
          '<td class="mono">' + list.length + '</td><td>' + esc(latest.period) + '</td>' +
          '<td class="mono">' + latest.metrics.leads + '</td><td class="mono">' + esc(latest.metrics.roas) + '</td>' +
          '<td class="mono">' + (avg === "—" ? avg : avg + "x") + '</td>' +
          '<td><span class="status-badge ' + roiClass + '">' + roi + '</span></td></tr>';
      }).join('') + '</tbody></table></div>';

    // Trend across all published reports, oldest → newest, by period
    if (published.length > 1) {
      var byPeriod = {};
      published.forEach(function (rp) { (byPeriod[rp.period] = byPeriod[rp.period] || []).push(rp); });
      var periods = Object.keys(byPeriod);
      var trendData = periods.map(function (p) {
        var list = byPeriod[p];
        var leadsSum = list.reduce(function (s, x) { return s + (x.metrics.leads || 0); }, 0);
        return { label: p.split(" ")[0].slice(0, 3), value: leadsSum };
      });
      html += '<div class="section-title">' + esc(t("Leads Trend — All Clients")) + '</div><div class="panel-card">' + svgLineChart(trendData, { color: "var(--accent)" }) + '</div>';
    }

    html += '<div class="section-title">' + esc(t("All Reports")) + '</div>';
    html += '<div class="toolbar">' +
      '<select id="repClientFilter"><option value="">' + esc(t("All clients")) + '</option>' + clientsList.map(function (c) { return '<option value="' + c.id + '"' + (c.id === _reportsFilter.client ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select>' +
      '<select id="repStatusFilter"><option value="">' + esc(t("All statuses")) + '</option><option' + (_reportsFilter.status === "Published" ? ' selected' : '') + '>' + esc(t("Published")) + '</option><option' + (_reportsFilter.status === "Draft" ? ' selected' : '') + '>' + esc(t("Draft")) + '</option></select>' +
      '<span style="flex:1;"></span><button class="btn btn-primary btn-sm" id="addReportBtn">+ ' + esc(t("New Report")) + '</button></div>';
    html += '<div id="repTableWrap"></div>';
    container.innerHTML = html;

    function renderRepTable() {
      var filtered = _reportsCache.filter(function (rp) {
        if (_reportsFilter.client && rp.clientId !== _reportsFilter.client) return false;
        if (_reportsFilter.status && rp.status !== _reportsFilter.status) return false;
        return true;
      });
      var wrap = document.getElementById("repTableWrap");
      if (filtered.length === 0) { wrap.innerHTML = emptyState("▦", "No reports match", "Try adjusting the filters above."); return; }
      wrap.innerHTML = '<div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Client")) + '</th><th>' + esc(t("Period")) + '</th><th>' + esc(t("Reach")) + '</th><th>' + esc(t("Engagement")) + '</th><th>' + esc(t("Leads")) + '</th><th>' + esc(t("ROAS")) + '</th><th>' + esc(t("Status")) + '</th><th></th></tr></thead><tbody>' +
        filtered.map(function (rp) {
          return '<tr><td class="cell-main">' + esc(findClientName(rp.clientId)) + '</td><td>' + esc(rp.period) + '</td>' +
            '<td class="mono">' + esc(rp.metrics.reach) + '</td><td class="mono">' + esc(rp.metrics.engagement) + '</td><td class="mono">' + rp.metrics.leads + '</td><td class="mono">' + esc(rp.metrics.roas) + '</td>' +
            '<td><span class="status-badge ' + healthClass(rp.status) + '">' + esc(rp.status) + '</span></td>' +
            '<td style="white-space:nowrap;"><button class="btn btn-sm" data-view-report="' + rp.id + '">' + esc(t("View")) + '</button> ' +
            '<button class="btn btn-sm" data-edit-report="' + rp.id + '">' + esc(t("Edit")) + '</button>' +
            (rp.status === "Draft" ? ' <button class="btn btn-sm" data-delete-report="' + rp.id + '" style="color:var(--rose);border-color:var(--rose);">' + esc(t("Delete")) + '</button>' : '') +
            '</td></tr>';
        }).join('') + '</tbody></table></div>';
      bindContentDelegation(wrap);
    }
    document.getElementById("addReportBtn").addEventListener("click", function () { reportFormModal(null, _reportsFilter.client || null); });
    renderRepTable();
    document.getElementById("repClientFilter").addEventListener("change", function () { _reportsFilter.client = this.value; renderRepTable(); });
    document.getElementById("repStatusFilter").addEventListener("change", function () { _reportsFilter.status = this.value; renderRepTable(); });
    bindContentDelegation(container);
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminReports(container); });
  });
}

function reportViewModal(reportId) {
  var rp = (_reportsCache || []).concat(window._reportsCacheClient || []).filter(function (x) { return x.id === reportId; })[0];
  if (!rp) { errorToast(new Error("Report not found.")); return; }
  var isAdmin = state.view === "admin";
  (isAdmin ? api.clients.list() : Promise.resolve({ clients: [] })).then(function (res) {
    var c = res.clients.filter(function (x) { return x.id === rp.clientId; })[0];
    var metrics = rp.metrics || {};
    function metricCard(label, value, suffix) {
      var display = value === null || value === undefined || value === "" ? "N/A" : String(value) + (suffix || "");
      return '<div class="exec-card"><div class="lbl">' + esc(t(label)) + '</div><div class="val">' + esc(display) + '</div></div>';
    }
    var body = (isAdmin ? '<p><b>' + esc(t("Client")) + ':</b> ' + esc(c ? c.name : "") + ' &nbsp;·&nbsp; ' : '') +
      '<b>' + esc(t("Period")) + ':</b> ' + esc(rp.period) + ' &nbsp;·&nbsp; <span class="status-badge ' + healthClass(rp.status) + '">' + esc(t(rp.status)) + '</span></p>' +
      (isAdmin ? '<p class="cell-sub">' + esc(t("Entered by")) + ' ' + esc(rp.enteredBy || "WITRA Team") + (rp.createdAt ? ' · ' + esc(rp.createdAt) : '') + '</p>' : '') +
      '<div class="exec-grid" style="margin-top:12px;">' +
      metricCard("Reach", metrics.reach) +
      metricCard("Impressions", metrics.impressions) +
      metricCard("Engagement", metrics.engagement) +
      metricCard("Engagement Rate", metrics.engagementRate, "%") +
      metricCard("Leads Generated", metrics.leads) +
      metricCard("Conversions", metrics.conversions) +
      metricCard("Conversion Rate", metrics.conversionRate !== undefined ? metrics.conversionRate : metrics.conversion, "%") +
      metricCard("Ad Spend", metrics.adSpend === null || metrics.adSpend === undefined ? null : "EGP " + metrics.adSpend) +
      metricCard("Revenue", metrics.revenue === null || metrics.revenue === undefined ? null : "EGP " + metrics.revenue) +
      metricCard("Cost per Lead", metrics.cpl === null || metrics.cpl === undefined ? null : "EGP " + metrics.cpl) +
      metricCard("ROAS", metrics.roas, "x") +
      '</div>' +
      '<p style="margin-top:14px;"><b>' + esc(t("Executive Summary")) + '</b></p><p>' + esc(rp.summary) + '</p>' +
      '<p><b>' + esc(t("What Worked")) + '</b></p><ul style="margin:0 0 12px;padding-left:18px;">' + rp.whatWorked.map(function (w) { return '<li>' + esc(t(w)) + '</li>'; }).join('') + '</ul>' +
      '<p><b>' + esc(t("What Didn't")) + '</b></p><ul style="margin:0 0 12px;padding-left:18px;">' + rp.whatDidnt.map(function (w) { return '<li>' + esc(t(w)) + '</li>'; }).join('') + '</ul>' +
      '<p><b>' + esc(t("Recommendations")) + '</b></p><ul style="margin:0 0 12px;padding-left:18px;">' + rp.recommendations.map(function (w) { return '<li>' + esc(t(w)) + '</li>'; }).join('') + '</ul>' +
      '<p><b>' + esc(t("Next Month Strategy")) + '</b></p><p>' + esc(rp.nextMonth) + '</p>';
    var foot = isAdmin
      ? '<button class="btn btn-sm" data-close-modal="1">' + esc(t("Close")) + '</button><button class="btn btn-primary btn-sm" id="rpViewEditBtn">' + esc(t("Edit")) + '</button>'
      : '<button class="btn btn-primary btn-sm" data-close-modal="1">' + esc(t("Close")) + '</button>';
    openModal(t("Report") + " — " + rp.period, body, foot);
    var editBtn = document.getElementById("rpViewEditBtn");
    if (editBtn) editBtn.addEventListener("click", function () { closeModal(); reportFormModal(rp.id); });
  }).catch(errorToast);
}

/* ===================== ADMIN — ACTIVITIES ===================== */
function renderAdminActivities(container) {
  api.activities.list().then(function (res) {
    var html = '<div class="panel-card"><div class="activity-feed">' + (res.activities.length ? res.activities.map(activityRow).join('') : '<div class="cell-sub">No activity yet.</div>') + '</div></div>';
    html += '<p class="cell-sub">' + esc(t("Activity records are immutable audit entries — timestamp, actor, affected client, object, and action.")) + '</p>';
    container.innerHTML = html;
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminActivities(container); });
  });
}

/* ===================== ADMIN — WITRA TEAM ===================== */
function teamRequestReviewModal(reqId) {
  api.team.requests().then(function (r) {
    var rq = r.requests.filter(function (x) { return x.id === reqId; })[0];
    if (!rq) { errorToast(new Error("Request not found.")); return; }
    return api.clients.list().then(function (res) {
      var c = res.clients.filter(function (x) { return x.id === rq.clientId; })[0];
      var body = '<p><b>' + esc(t("Client")) + ':</b> ' + esc(c ? c.name : rq.clientId) + '</p>' +
        '<p><b>' + esc(t("Name")) + ':</b> ' + esc(rq.name) + '</p>' +
        '<p><b>' + esc(t("Email")) + ':</b> ' + esc(rq.email) + '</p>' +
        '<p><b>' + esc(t("Requested Access")) + ':</b> ' + esc(rq.role) + '</p>' +
        '<p><b>' + esc(t("Requested")) + ':</b> ' + esc(rq.requestedDate) + '</p>' +
        '<p class="cell-sub" style="margin-top:12px;">' + esc(t("Approving creates their real portal account immediately, using the password the client already set for them. Rejecting just notifies the client — no account is created.")) + '</p>';
      var foot = '<button class="btn btn-sm" data-close-modal="1">' + esc(t("Cancel")) + '</button>' +
        '<button class="btn btn-sm" id="teamReqRejectBtn" style="border-color:var(--rose);color:var(--rose);">' + esc(t("Reject")) + '</button>' +
        '<button class="btn btn-primary btn-sm" id="teamReqApproveBtn">' + esc(t("Approve")) + '</button>';
      openModal(t("Review Team Request"), body, foot);

      function submitDecision(status, btn) {
        setButtonLoading(btn, true, "Saving…");
        api.team.reviewRequest(rq.id, status).then(function () {
          closeModal();
          renderAdminSection();
          toast(status === "Approved" ? t("Request approved — account created") : t("Request rejected"), "success");
        }).catch(function (err) {
          setButtonLoading(btn, false);
          errorToast(err);
        });
      }
      document.getElementById("teamReqApproveBtn").addEventListener("click", function () { submitDecision("Approved", this); });
      document.getElementById("teamReqRejectBtn").addEventListener("click", function () { submitDecision("Rejected", this); });
    });
  }).catch(errorToast);
}

function renderAdminTeam(container) {
  Promise.all([api.team.witraList(), api.clients.list(), api.team.requests(), fetch("/api/team/client_users", {headers:{"Authorization":"Bearer "+localStorage.getItem("token")}}).then(r=>r.json())]).then(function (r) {
    var team = r[0].team, clientsList = r[1].clients, teamRequests = r[2].requests, clientUsers = r[3].clientUsers || [];
    function clientNames(ids) {
      if (!ids || !ids.length) return "None yet";
      return ids.map(function (id) {
        var c = clientsList.filter(function (x) { return x.id === id; })[0];
        return c ? c.name : id;
      }).join(", ");
    }
    function findClientName(id) {
      var c = clientsList.filter(function (x) { return x.id === id; })[0];
      return c ? c.name : id;
    }
    
    // Sort requests: newest first
    teamRequests.sort(function(a, b) { return new Date(b.requestedDate) - new Date(a.requestedDate); });
    var pendingRequests = teamRequests.filter(function (rq) { return rq.status === "Requested"; });
    
    var html = "";
    
    // 1. WITRA Agency Team
    html += '<div class="section-title" style="margin-top:0;">' + esc(t("WITRA Agency Team")) + '</div>';
    html += '<p class="cell-sub" style="margin-bottom:16px;">Everyone here logs into this same platform with their own email and password, scoped to the clients they\'re assigned.</p>';
    html += '<div class="toolbar"><span style="flex:1;"></span><button class="btn btn-primary btn-sm" data-toggle-witra-invite="1">+ ' + esc(t("Add Team Member")) + '</button></div>';
    
    if (state._witraInviteOpen) {
      html += '<div class="panel-card"><div class="form-grid">' +
        '<div class="form-field"><label>' + esc(t("Name")) + '</label><input type="text" id="wtName"></div>' +
        '<div class="form-field"><label>' + esc(t("Email")) + '</label><input type="email" id="wtEmail"></div>' +
        '</div><div class="form-grid">' +
        '<div class="form-field"><label>' + esc(t("Role")) + '</label><select id="wtRole"><option>Team Member</option><option>Super Admin</option></select></div>' +
        '<div class="form-field"><label>' + esc(t("Password")) + '</label><input type="password" id="wtPassword" placeholder="' + esc(t("Min. 6 characters")) + '" autocomplete="new-password"><span class="cell-sub">' + esc(t("Set by WITRA — this is what they\'ll use to log in.")) + '</span></div>' +
        '</div><div class="form-field" id="wtClientsField"><label>' + esc(t("Assigned Clients")) + '</label>' +
        '<div class="client-picker">' + clientsList.map(function (c) {
          return '<label class="client-picker-item"><input type="checkbox" class="wtClientChk" value="' + esc(c.id) + '"> ' + esc(c.name) + '</label>';
        }).join('') + '</div><span class="cell-sub">' + esc(t("Team Members only see the clients checked here. Super Admins automatically see everyone.")) + '</span></div>' +
        '<div class="form-error" id="wtFormError"></div><button class="btn btn-primary btn-sm" data-send-witra-invite="1">' + esc(t("Add to Team")) + '</button></div>';
    }
    
    // Distinct styling for WITRA Team
    html += '<div class="panel-card" style="background-color: var(--accent-soft); border: 1px solid var(--accent);"><table class="data-table"><thead><tr><th>' + esc(t("Name")) + '</th><th>' + esc(t("Email")) + '</th><th>' + esc(t("Role")) + '</th><th>' + esc(t("Assigned Clients")) + '</th><th></th></tr></thead><tbody>' +
      team.map(function (w) {
        return '<tr><td><div style="display:flex;align-items:center;gap:9px;"><div class="avatar-sm">' + initials(w.name) + '</div>' + esc(w.name) + '</div></td>' +
          '<td class="mono cell-sub">' + esc(w.email) + '</td><td>' + esc(w.role) + '</td><td class="cell-sub">' + esc(clientNames(w.assignedClients)) + '</td>' +
          '<td>' + (w.role === "Super Admin" ? '' : '<button class="btn btn-ghost btn-sm" data-remove-witra="' + w.id + '">Remove</button>') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
      
    // 2. Client Team Requests
    html += '<div class="section-title" style="margin-top:32px;">' + esc(t("Client Team Requests")) + (pendingRequests.length ? ' <span class="status-badge status-needs-attention">' + pendingRequests.length + ' ' + esc(t("pending")) + '</span>' : '') + '</div>';
    if (teamRequests.length === 0) {
      html += '<p class="cell-sub" style="margin-bottom:16px;">' + esc(t("No client team requests yet — these appear here whenever a client asks to add a teammate.")) + '</p>';
    } else {
      html += '<div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Client")) + '</th><th>' + esc(t("Name")) + '</th><th>' + esc(t("Email")) + '</th><th>' + esc(t("Access")) + '</th><th>' + esc(t("Requested")) + '</th><th>' + esc(t("Status")) + '</th><th></th></tr></thead><tbody>' +
        teamRequests.slice(0, 10).map(function (rq) {
          return '<tr><td class="cell-main">' + esc(findClientName(rq.clientId)) + '</td><td>' + esc(rq.name) + '</td>' +
            '<td class="mono cell-sub">' + esc(rq.email) + '</td><td>' + esc(rq.role) + '</td><td class="mono">' + esc(rq.requestedDate) + '</td>' +
            '<td><span class="status-badge ' + healthClass(rq.status) + '">' + esc(rq.status) + '</span></td>' +
            '<td>' + (rq.status === "Requested" ? '<button class="btn btn-sm" data-review-team-request="' + rq.id + '">' + esc(t("Review")) + ' →</button>' : '') + '</td></tr>';
        }).join('') + '</tbody></table>';
      // Removed hidden footer per user request
      html += '</div>';
    }

    // 3. Client Platform Users
    html += '<div class="section-title" style="margin-top:32px;">' + esc(t("Client Platform Users")) + '</div>';
    
    // Group users by client
    var usersByClient = {};
    clientUsers.forEach(function(u) {
      if (!usersByClient[u.clientId]) usersByClient[u.clientId] = [];
      usersByClient[u.clientId].push(u);
    });
    
    if (Object.keys(usersByClient).length === 0) {
        html += emptyState("👥", t("No Client Users"), t("When client team requests are approved, they will appear here."));
    } else {
        html += '<div class="accordion-list">';
        clientsList.forEach(function(c) {
          var cUsers = usersByClient[c.id];
          if (cUsers && cUsers.length > 0) {
             html += '<details class="accordion-item" style="margin-bottom:8px; border:1px solid var(--line); border-radius:6px; overflow:hidden;">';
             html += '<summary style="padding:12px 16px; background:var(--paper); cursor:pointer; font-weight:600; display:flex; justify-content:space-between; align-items:center;">' + '<div style="display:flex; align-items:center;"><span class="accordion-arrow">▶</span> ' + esc(c.name) + '</div> <span class="status-badge" style="background:var(--canvas);color:var(--ink);">' + cUsers.length + ' Users</span></summary>';
             html += '<div style="background:var(--paper);">';
             html += '<table class="data-table"><thead><tr><th>' + esc(t("Name")) + '</th><th>' + esc(t("Email")) + '</th><th>' + esc(t("Role")) + '</th><th>' + esc(t("Joined Date")) + '</th></tr></thead><tbody>';
             html += cUsers.map(function(u) {
                 var joinedDate = u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A';
                 return '<tr><td><div style="display:flex;align-items:center;gap:9px;"><div class="avatar-sm">' + initials(u.name) + '</div>' + esc(u.name) + '</div></td>' +
                   '<td class="mono cell-sub">' + esc(u.email) + '</td><td>' + esc(u.role) + '</td><td class="mono cell-sub">' + esc(joinedDate) + '</td></tr>';
             }).join('');
             html += '</tbody></table></div></details>';
          }
        });
        html += '</div>';
    }

    container.innerHTML = html;
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderAdminTeam(container); });
  });
}

/* ===================== ADMIN & CLIENT — SETTINGS ===================== */
var ROLE_PERMISSIONS = [
  ["Super Admin / Owner", "All clients, services, subscriptions, users, settings, billing, audit logs"],
  ["WITRA Team Member", "Manage assigned clients' services, content and reports"],
  ["Client Owner", "Full access to their own business, team, services, subscription and reports"],
  ["Client Manager", "Marketing / content / performance access — no billing or team management"],
  ["Client Editor", "Manage permitted operational items only"],
  ["Client Viewer", "Read-only access"]
];
// Each row: [Display Label, storage slug]
var NOTIF_EVENTS = [
  ["Report published", "report_published"], ["Service request submitted", "service_request_submitted"],
  ["Service activated", "service_activated"], ["Renewal approaching", "renewal_approaching"],
  ["Payment received / failed", "payment_result"], ["New team member invited", "team_invited"]
];
var CLIENT_NOTIF_EVENTS = [
  ["Report published", "report_published"], ["Service activated", "service_activated"], ["Renewal approaching", "renewal_approaching"]
];
// Each row: [Display Label, storage slug, default connected]
var CLIENT_INTEGRATIONS = [["Google Analytics", "google_analytics", false]];
var EMAIL_TEMPLATE_NAMES = ["Client Invitation", "Password Reset", "Renewal Reminder", "Report Published"];
var EMAIL_TEMPLATE_DEFAULTS = {
  client_invitation: "Hi {{first_name}}, you've been invited to join WITRA. Click the link below to set up your account.",
  password_reset: "Hi {{first_name}}, click the link below to reset your password. This link expires in 24 hours.",
  renewal_reminder: "Hi {{first_name}}, your plan renews soon — let us know if you'd like to make any changes beforehand.",
  report_published: "Hi {{first_name}}, your latest performance report is ready to view in your dashboard."
};
function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }
function parseJsonSafe(str, fallback) { if (!str) return fallback; try { return JSON.parse(str); } catch (e) { return fallback; } }

// items: [label, slug][]. savedPrefs: {slug: {email,inapp}}
function checklistRows(items, savedPrefs) {
  savedPrefs = savedPrefs || {};
  return items.map(function (i) {
    var lbl = i[0], slug = i[1];
    var pref = savedPrefs[slug] || {};
    var emailOn = pref.email !== false, inappOn = pref.inapp !== false;
    return '<div class="settings-row"><div class="lbl" style="font-weight:500;font-size:13px;">' + esc(t(lbl)) + '</div>' +
      '<div style="display:flex;gap:14px;font-size:12px;color:var(--ink-soft);">' +
      '<label style="display:flex;gap:5px;align-items:center;cursor:pointer;"><input type="checkbox" class="notifChk" data-notif-slug="' + esc(slug) + '" data-notif-channel="email"' + (emailOn ? ' checked' : '') + '> ' + esc(t("Email")) + '</label>' +
      '<label style="display:flex;gap:5px;align-items:center;cursor:pointer;"><input type="checkbox" class="notifChk" data-notif-slug="' + esc(slug) + '" data-notif-channel="inapp"' + (inappOn ? ' checked' : '') + '> ' + esc(t("In-app")) + '</label>' +
      '</div></div>';
  }).join('');
}
// items: [label, slug, defaultConnected][]. savedConnections: {slug: bool}
function connectRows(items, savedConnections) {
  savedConnections = savedConnections || {};
  return items.map(function (i) {
    var lbl = i[0], slug = i[1], defOn = !!i[2];
    var connected = savedConnections.hasOwnProperty(slug) ? !!savedConnections[slug] : defOn;
    return '<div class="settings-row"><div class="lbl" style="font-weight:500;font-size:13px;">' + esc(t(lbl)) + '</div>' +
      '<label style="display:flex;gap:8px;align-items:center;cursor:pointer;"><input type="checkbox" class="connectChk" data-connect-slug="' + esc(slug) + '"' + (connected ? ' checked' : '') + '>' +
      '<span class="status-badge connectBadge ' + (connected ? 'status-active' : 'status-locked') + '">' + (connected ? esc(t("Connected")) : esc(t("Not connected"))) + '</span></label></div>';
  }).join('');
}
// Read all notif checkboxes currently in the open modal into {slug:{email,inapp}}
function collectNotifPrefsFromModal() {
  var out = {};
  document.querySelectorAll("#activeModal .notifChk").forEach(function (chk) {
    var slug = chk.getAttribute("data-notif-slug"), channel = chk.getAttribute("data-notif-channel");
    out[slug] = out[slug] || {};
    out[slug][channel] = chk.checked;
  });
  return out;
}
// Read all connect checkboxes currently in the open modal into {slug:bool}
function collectConnectPrefsFromModal() {
  var out = {};
  document.querySelectorAll("#activeModal .connectChk").forEach(function (chk) {
    out[chk.getAttribute("data-connect-slug")] = chk.checked;
  });
  return out;
}

function settingsBodyFor(label, settingsData) {
  settingsData = settingsData || {};
  if (label === "WITRA Company Profile") return '<div class="form-grid">' +
    '<div class="form-field"><label>Company Name</label><input type="text" id="stCompanyName" value="' + esc(settingsData.company_name || "WITRA Marketing Solutions") + '"></div>' +
    '<div class="form-field"><label>Support Email</label><input type="text" id="stSupportEmail" value="' + esc(settingsData.support_email || "hello@witra.com") + '"></div></div>' +
    '<div class="form-field"><label>Legal Address</label><input type="text" id="stLegalAddress" value="' + esc(settingsData.legal_address || "Damanhour, El Beheira, Egypt") + '"></div>' +
    '<div class="form-field"><label>Logo</label><label class="upload-field" style="cursor:pointer;"><input type="file" accept="image/*" style="display:none;"><div class="icon">⇪</div><div class="txt">Click to upload</div></label></div>';

  if (label === "Internal Team Members") return '<div id="stTeamListWrap"><p class="cell-sub">Loading…</p></div>' +
    '<a class="cell-sub" data-close-modal="1" data-nav="witra-team" style="cursor:pointer;display:inline-block;margin-top:10px;">Manage full team roster →</a>';

  if (label === "Roles & Permissions") return '<table class="data-table"><thead><tr><th>' + esc(t("Role")) + '</th><th>' + esc(t("Key Permissions")) + '</th></tr></thead><tbody>' +
    ROLE_PERMISSIONS.map(function (r) { return '<tr><td class="cell-main">' + esc(t(r[0])) + '</td><td class="cell-sub">' + esc(t(r[1])) + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<p class="cell-sub" style="margin-top:10px;">' + esc(t("This matrix reflects the fixed platform role model and is informational only.")) + '</p>';

  if (label === "Service Catalogue Defaults") return '<div class="form-grid">' +
    '<div class="form-field"><label>Default Currency</label><select id="stCurrency"><option' + (settingsData.default_currency === "USD" ? '' : ' selected') + '>EGP</option><option' + (settingsData.default_currency === "USD" ? ' selected' : '') + '>USD</option></select></div>' +
    '<div class="form-field"><label>Standalone Purchases</label><select id="stStandalonePolicy"><option' + (settingsData.standalone_policy === "Require approval" ? '' : ' selected') + '>Allowed by default</option><option' + (settingsData.standalone_policy === "Require approval" ? ' selected' : '') + '>Require approval</option></select></div></div>' +
    '<p class="cell-sub">Per-service pricing and plan assignment is edited from the Services page directly.</p>';

  if (label === "Notification Settings") {
    var np = parseJsonSafe(settingsData.notif_prefs, {});
    return '<div class="settings-list">' + checklistRows(NOTIF_EVENTS, np) + '</div>';
  }

  if (label === "Email Templates") {
    var selectedTpl = settingsData._selectedTemplate || EMAIL_TEMPLATE_NAMES[0];
    var tplBodies = parseJsonSafe(settingsData.email_templates, {});
    var bodyForSelected = tplBodies[slugify(selectedTpl)] || EMAIL_TEMPLATE_DEFAULTS[slugify(selectedTpl)] || "";
    return '<div class="form-field"><label>Template</label><select id="tplSelect">' + EMAIL_TEMPLATE_NAMES.map(function (t) { return '<option' + (t === selectedTpl ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join('') + '</select></div>' +
      '<div class="form-field"><label>Body</label><textarea id="tplBody" style="min-height:100px;">' + esc(bodyForSelected) + '</textarea></div>' +
      '<p class="cell-sub">Switching templates auto-saves the one you were editing.</p>';
  }

  if (label === "Security Settings") return '<div class="form-grid">' +
    '<div class="form-field"><label>Session Timeout</label><select id="stSessionTimeout"><option' + (settingsData.session_timeout === "4 hours" || !settingsData.session_timeout ? ' selected' : '') + '>4 hours</option><option' + (settingsData.session_timeout === "8 hours" ? ' selected' : '') + '>8 hours</option><option' + (settingsData.session_timeout === "24 hours" ? ' selected' : '') + '>24 hours</option></select></div>' +
    '<div class="form-field"><label>Multi-Factor Authentication</label><select id="stMfaPolicy"><option' + (settingsData.mfa_policy === "Required for Admins" ? '' : ' selected') + '>Off (ready to enable later)</option><option' + (settingsData.mfa_policy === "Required for Admins" ? ' selected' : '') + '>Required for Admins</option></select></div></div>';

  if (label === "Audit Log") return '<p>The full, timestamped record lives on its own page.</p>' +
    '<a class="cell-sub" data-close-modal="1" data-nav="activities" style="cursor:pointer;display:inline-block;">Open Activities / Audit Log →</a>';

  if (label === "Data Export & Retention") return '<div class="form-field"><label>Retention after a client is archived</label><select id="stRetentionPolicy"><option' + (!settingsData.retention_policy || settingsData.retention_policy === "Keep indefinitely" ? ' selected' : '') + '>Keep indefinitely</option><option' + (settingsData.retention_policy === "12 months" ? ' selected' : '') + '>12 months</option><option' + (settingsData.retention_policy === "24 months" ? ' selected' : '') + '>24 months</option></select></div>' +
    '<button class="btn btn-sm" id="stExportNowBtn" style="margin-top:6px;">⇩ Export Full Client List Now</button>';

  if (label === "Profile") return '<div class="form-grid">' +
    '<div class="form-field"><label>Name</label><input type="text" id="stProfileName" value="' + esc(state.currentUser ? state.currentUser.name : "") + '"></div>' +
    '<div class="form-field"><label>Email</label><input type="text" value="' + esc(state.currentUser ? state.currentUser.email : "") + '" disabled></div></div>' +
    '<div class="form-field"><label>Photo</label><label class="upload-field" style="cursor:pointer;"><input type="file" accept="image/*" style="display:none;"><div class="icon">⇪</div><div class="txt">Click to upload</div></label></div>';

  if (label === "Business Profile") return '<p>This is the same data shown under My Business.</p><a class="cell-sub" data-close-modal="1" data-nav="business" style="cursor:pointer;">Go to My Business →</a>';
  if (label === "Team Members") return '<p>This is the same list shown under Team.</p><a class="cell-sub" data-close-modal="1" data-nav="team" style="cursor:pointer;">Go to Team →</a>';

  if (label === "Password & Security") return '<div class="form-grid">' +
    '<div class="form-field"><label>Current Password</label><input type="password" id="pwCurrent"></div>' +
    '<div class="form-field"><label>New Password</label><input type="password" id="pwNew"></div></div>' +
    '<div class="form-error" id="pwFormError"></div>' +
    '<p class="cell-sub" style="margin-top:8px;"><b>Recent sign-ins:</b> Today 09:12 AM · Cairo, EG &nbsp;·&nbsp; Yesterday 6:40 PM · Cairo, EG</p>';

  if (label === "Notification Preferences") {
    var cnp = parseJsonSafe(settingsData.notif_prefs, {});
    return '<div class="settings-list">' + checklistRows(CLIENT_NOTIF_EVENTS, cnp) + '</div>';
  }

  if (label === "Connected Accounts") {
    var cConnState = parseJsonSafe(settingsData.integrations, {});
    return '<p>Manage your social links under My Business → Social Accounts.</p>' +
      '<a class="cell-sub" data-close-modal="1" data-nav="business" style="cursor:pointer;display:inline-block;margin-bottom:10px;">Go to My Business →</a>' +
      '<div class="settings-list">' + connectRows(CLIENT_INTEGRATIONS, cConnState) + '</div>';
  }

  return '<p>Settings for this area will appear here.</p>';
}

// Labels that read/write the generic WITRA-scope key/value settings blob
var WITRA_SETTINGS_LABELS = ["WITRA Company Profile", "Security Settings", "Service Catalogue Defaults", "Notification Settings", "Email Templates", "Data Export & Retention"];
// Labels that read/write the generic Client-scope key/value settings blob
var CLIENT_SETTINGS_LABELS = ["Notification Preferences", "Connected Accounts"];
// Labels with a working Save button (generic-blob labels + the dedicated Profile/Password endpoints)
var SAVABLE_LABELS = WITRA_SETTINGS_LABELS.concat(CLIENT_SETTINGS_LABELS).concat(["Profile", "Password & Security"]);

function settingsDetailModal(label) {
  var isWitraScope = state.view === "admin";
  var usesWitraBlob = isWitraScope && WITRA_SETTINGS_LABELS.indexOf(label) !== -1;
  var usesClientBlob = !isWitraScope && CLIENT_SETTINGS_LABELS.indexOf(label) !== -1;

  var loadData = usesWitraBlob
    ? api.settings.witraGet().then(function (r) { return r.settings; }).catch(function () { return {}; })
    : usesClientBlob
      ? api.settings.clientGet().then(function (r) { return r.settings; }).catch(function () { return {}; })
      : Promise.resolve({});

  loadData.then(function (settingsData) {
    settingsData = settingsData || {};
    if (label === "Email Templates" && !settingsData._selectedTemplate) settingsData._selectedTemplate = EMAIL_TEMPLATE_NAMES[0];
    var body = settingsBodyFor(label, settingsData);
    var showSave = SAVABLE_LABELS.indexOf(label) !== -1;
    var foot = '<button class="btn btn-sm" data-close-modal="1">' + (showSave ? "Cancel" : "Close") + '</button>' +
      (showSave ? '<button class="btn btn-primary btn-sm" id="settingsSaveBtn">Save</button>' : '');
    openModal(label, body, foot);

    if (label === "Internal Team Members") {
      api.team.witraList().then(function (r) {
        var wrap = document.getElementById("stTeamListWrap");
        if (!wrap) return;
        wrap.innerHTML = '<p>' + r.team.length + ' team members currently have access.</p>' +
          '<div class="settings-list">' + r.team.map(function (w) { return '<div class="settings-row"><div class="lbl" style="font-size:13px;font-weight:500;">' + esc(w.name) + '</div><div class="desc">' + esc(w.role) + ' · ' + esc(w.email) + '</div></div>'; }).join('') + '</div>';
      }).catch(function () { /* non-fatal */ });
    }

    // Email Templates: switching the dropdown swaps the textarea body (in-memory,
    // still persisted together on Save so no data is lost between switches).
    if (label === "Email Templates") {
      var tplBodiesCache = parseJsonSafe(settingsData.email_templates, {});
      var tplSelect = document.getElementById("tplSelect");
      var tplBodyEl = document.getElementById("tplBody");
      if (tplSelect && tplBodyEl) {
        tplSelect.addEventListener("change", function () {
          var slug = slugify(tplSelect.value);
          tplBodyEl.value = tplBodiesCache[slug] || EMAIL_TEMPLATE_DEFAULTS[slug] || "";
        });
      }
    }

    // Connected Accounts: checkbox toggles the visible badge live
    document.querySelectorAll("#activeModal .connectChk").forEach(function (chk) {
      chk.addEventListener("change", function () {
        var badge = chk.closest("label").querySelector(".connectBadge");
        if (!badge) return;
        badge.textContent = chk.checked ? "Connected" : "Not connected";
        badge.className = "status-badge connectBadge " + (chk.checked ? "status-active" : "status-locked");
      });
    });

    var exportBtn = document.getElementById("stExportNowBtn");
    if (exportBtn) exportBtn.addEventListener("click", function () { window.open(api.clients.exportCsvUrl(), "_blank"); toast("Exporting client list…"); });

    var saveBtn = document.getElementById("settingsSaveBtn");
    if (!saveBtn) return;
    saveBtn.addEventListener("click", function () {
      var btn = this;
      setButtonLoading(btn, true, "Saving…");

      if (label === "Profile") {
        var name = document.getElementById("stProfileName").value.trim();
        if (!name) { setButtonLoading(btn, false); toast("Name is required", "error"); return; }
        api.settings.saveProfile(name).then(function () {
          state.currentUser.name = name;
          closeModal();
          render();
          toast("Profile saved", "success");
        }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });
        return;
      }

      if (label === "Password & Security") {
        var cur = document.getElementById("pwCurrent").value;
        var next = document.getElementById("pwNew").value;
        if (!cur || !next) { setButtonLoading(btn, false); document.getElementById("pwFormError").textContent = "Both fields are required."; return; }
        api.settings.changePassword(cur, next).then(function () {
          closeModal();
          toast("Password updated", "success");
        }).catch(function (err) {
          setButtonLoading(btn, false);
          document.getElementById("pwFormError").textContent = err.message;
        });
        return;
      }

      // Generic WITRA-scope or Client-scope key/value settings blob
      var payload = {};
      if (label === "WITRA Company Profile") {
        payload.company_name = document.getElementById("stCompanyName").value;
        payload.support_email = document.getElementById("stSupportEmail").value;
        payload.legal_address = document.getElementById("stLegalAddress").value;
      } else if (label === "Security Settings") {
        payload.session_timeout = document.getElementById("stSessionTimeout").value;
        payload.mfa_policy = document.getElementById("stMfaPolicy").value;
      } else if (label === "Service Catalogue Defaults") {
        payload.default_currency = document.getElementById("stCurrency").value;
        payload.standalone_policy = document.getElementById("stStandalonePolicy").value;
      } else if (label === "Notification Settings" || label === "Notification Preferences") {
        payload.notif_prefs = JSON.stringify(collectNotifPrefsFromModal());
      } else if (label === "Email Templates") {
        var tplBodies = parseJsonSafe(settingsData.email_templates, {});
        var curSlug = slugify(document.getElementById("tplSelect").value);
        tplBodies[curSlug] = document.getElementById("tplBody").value;
        payload.email_templates = JSON.stringify(tplBodies);
      } else if (label === "Connected Accounts") {
        payload.integrations = JSON.stringify(collectConnectPrefsFromModal());
      } else if (label === "Data Export & Retention") {
        payload.retention_policy = document.getElementById("stRetentionPolicy").value;
      }

      var saveFn = usesClientBlob ? api.settings.clientSave : api.settings.witraSave;
      saveFn(payload).then(function () {
        closeModal();
        toast(label + " saved", "success");
      }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });
    });
  }).catch(errorToast);
}

function renderAdminSettings(container) {
  var rows = [
    ["WITRA Company Profile", "Logo, brand, legal details"], ["Internal Team Members", "Add or remove WITRA staff"],
    ["Roles & Permissions", "Configure what each role can access"], ["Service Catalogue Defaults", "Default pricing and entitlement rules"],
    ["Notification Settings", "Email and in-app notification preferences"], ["Email Templates", "Invitation, reset, and alert wording"],
    ["Security Settings", "Session policy, MFA readiness"], ["Audit Log", "Full privileged-action history"],
    ["Data Export & Retention", "Export or archive tenant data"]
  ];
  container.innerHTML = '<div class="panel-card"><div class="settings-list">' + rows.map(function (r) {
    return '<div class="settings-row"><div><div class="lbl">' + esc(t(r[0])) + '</div><div class="desc">' + esc(t(r[1])) + '</div></div><button class="btn btn-sm" data-manage-setting="' + esc(r[0]) + '">' + esc(t("Manage")) + '</button></div>';
  }).join('') + '</div></div>';
  bindContentDelegation();
}

/* ===================== CLIENT PORTAL SECTIONS ===================== */
function renderClientSection() {
  // Keep the sidebar highlight in sync with the section being shown
  // (this was missing — the client sidebar stayed stuck on Dashboard).
  document.querySelectorAll(".sidebar-link").forEach(function (el) { el.classList.toggle("active", el.getAttribute("data-nav") === state.clientSection); });
  var sb = document.getElementById("sidebar"), ov = document.getElementById("sidebarOverlay");
  if (sb) sb.classList.remove("open");
  if (ov) ov.classList.remove("open");

  var titles = { dashboard: "Dashboard", business: "Business Profile", services: "My Services",
    "content-planner": "Content Ops Tracker",
    subscription: "Subscription", reports: "Reports & Performance", activities: "Activities", requests: "Requests", team: "Team", settings: "Settings",
    attachments: "Attachments" };
  document.getElementById("topbarTitle").textContent = t(titles[state.clientSection]) || "";
  var content = document.getElementById("content");
  content.innerHTML = '<div class="content-loading"><div class="spinner"></div></div>';

  var fn = {
    dashboard: renderClientDashboard, business: renderClientBusiness, services: renderClientServices,
    subscription: renderClientSubscription, reports: renderClientReports,
    activities: renderClientActivities, requests: renderClientRequests, team: renderClientTeam, settings: renderClientSettings,
    "content-planner": renderClientContentPlanner,
    attachments: renderClientAttachments
  }[state.clientSection];
  if (fn) fn(content); else content.innerHTML = "";
}

function renderClientDashboard(container) {
  Promise.all([api.portal.client(), getPlans(), getServices(), api.activities.mine()]).then(function (r) {
    var c = r[0].client, plans = r[1], services = r[2], acts = r[3].activities;
    var logoStyle = c.logoImage ? 'background-image:url(' + c.logoImage + ');background-size:cover;background-position:center;' : 'background:' + c.logoColor + ';';
    var html = '<div class="client-header"><div class="logo" style="' + logoStyle + '"></div><div><h1>Good morning, ' + esc((c.owner || "").split(" ")[0]) + '</h1><div class="meta">' + esc(c.name) + ' · ' + esc(planNameFromList(plans, c.planId)) + ' plan · <span class="status-badge ' + healthClass(c.health) + '">' + esc(t(c.health)) + '</span></div></div></div>';

    html += '<div class="kpi-grid">' +
      kpi("Leads Generated", c.kpis.leads) + kpi("Conversion Rate", c.kpis.conversion) +
      kpi("Cost per Lead", "EGP " + c.kpis.cpl) + kpi("ROAS", c.kpis.roas + "x") +
      kpi("Marketing ROI", (c.kpis.roas > 2.5 ? "+" : "") + Math.round((c.kpis.roas - 1) * 100) + "%", c.kpis.roas > 2 ? "delta-up" : "delta-down") +
      '</div>';

    html += '<div class="section-title">Active Services</div><div class="service-grid">' +
      c.activeServices.map(function (sid) {
        var s = services.filter(function (x) { return x.id === sid; })[0];
        if (!s) return '';
        return '<div class="service-card"><div class="head"><h4>' + esc(trF(s.name, s.nameAr)) + '</h4><span class="status-badge status-active">Active</span></div><div class="headline">' + esc(trF(s.headline, s.headlineAr)) + '</div></div>';
      }).join('') + '</div>';

    // Replaces the old static "This Month's Execution" summary widget: the
    // client now sees their REAL, live Content Ops Tracker calendar right
    // here on the dashboard — not a derived read-only snapshot of it.
    if (clientHasEntitlement(plans, c, "content_plan")) {
      html += '<div class="section-title">' + esc(t("Content Ops Tracker")) + ' <span class="cell-sub">' + esc(t("(overview — open Content Planner for the full calendar)")) + '</span></div>' +
        '<div class="tracker-frame-wrap" style="margin-bottom:16px;"><iframe src="/static/content-ops.html?embed=1&view=dashboard' + (currentLang === "ar" ? '&lang=ar' : '') + '" style="width:100%;height:420px;border:0;display:block;" title="Content Ops Tracker"></iframe></div>';
    } else {
      html += '<div class="section-title">' + esc(e_note_title()) + '</div><div class="panel-card">' + esc(c.execution.note) + '</div>';
    }

    html += '<div class="section-title" style="margin-top:8px;">Recent Activity</div><div class="panel-card"><div class="activity-feed">' +
      (acts.length ? acts.map(activityRow).join('') : '<div class="cell-sub">No recent activity.</div>') + '</div></div>';

    container.innerHTML = html;
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientDashboard(container); });
  });
}
function e_note_title() { return "What We\'re Working On This Month"; }

function renderClientBusiness(container) {
  api.portal.client().then(function (r) {
    var c = r.client;
    var fields = [["Business Name", c.name, "cbName"], ["Owner", c.owner, "cbOwner"], ["Industry", c.industry, "cbIndustry"], ["Location", c.location, "cbLocation"]];
    var html = '<div class="panel-card"><h3>Business Profile</h3><div class="form-grid">' +
      fields.map(function (f) { return '<div class="form-field"><label>' + f[0] + '</label><input type="text" id="' + f[2] + '" value="' + esc(f[1]) + '"></div>'; }).join('') +
      '</div><div class="form-error" id="bizFormError"></div><button class="btn btn-primary btn-sm" id="saveBizBtn">Save Changes</button></div>';

    var socialLinks = (c.socialLinks && c.socialLinks.length) ? c.socialLinks : [{ platform: "Instagram", url: "" }, { platform: "Facebook", url: "" }];
    var hasSavedLinks = !!(c.socialLinks && c.socialLinks.filter(function (sl) { return sl.url; }).length);
    var SOCIAL_ICONS = { "Instagram": "📷", "Facebook": "📘", "TikTok": "🎵", "LinkedIn": "💼", "X / Twitter": "✕", "Website": "🌐" };
    html += '<div class="panel-card"><h3>' + esc(t("Social Accounts")) + '</h3><p class="cell-sub" style="margin-top:-4px;">' + esc(t("Add the links to your own pages — WITRA reports pull from these.")) + '</p>';

    // View mode: once links are saved, show them as clickable pills instead
    // of re-showing the edit form every time — click "Edit" to switch back.
    html += '<div id="socialLinksViewWrap"' + (hasSavedLinks ? '' : ' style="display:none;"') + '>' +
      '<div class="social-links-view">' + socialLinks.filter(function (sl) { return sl.url; }).map(function (sl) {
        return '<a class="social-link-pill" href="' + esc(sl.url) + '" target="_blank" rel="noopener noreferrer"><span>' + (SOCIAL_ICONS[sl.platform] || "🔗") + '</span>' + esc(sl.platform) + '</a>';
      }).join('') + '</div>' +
      '<button class="btn btn-sm" id="editSocialBtn" style="margin-top:10px;">' + esc(t("Edit")) + '</button></div>';

    html += '<div id="socialLinksEditWrap"' + (hasSavedLinks ? ' style="display:none;"' : '') + '>' +
      '<div id="socialLinksWrap">';
    socialLinks.forEach(function (sl, i) {
      html += '<div class="invite-form" style="margin-bottom:8px;">' +
        '<select class="socialPlatform" data-social-idx="' + i + '" style="width:130px;flex:none;">' +
        ["Instagram", "Facebook", "TikTok", "LinkedIn", "X / Twitter", "Website"].map(function (p) { return '<option' + (p === sl.platform ? ' selected' : '') + '>' + p + '</option>'; }).join('') +
        '</select>' +
        '<input type="text" class="socialUrl" data-social-idx="' + i + '" placeholder="https://…" value="' + esc(sl.url) + '">' +
        '<button class="btn-ghost" data-remove-social="' + i + '">✕</button></div>';
    });
    html += '</div><div style="display:flex;gap:10px;align-items:center;margin-top:8px;">' +
      '<button class="btn btn-sm" data-add-social="1">+ ' + esc(t("Add Link")) + '</button>' +
      '<button class="btn btn-primary btn-sm" id="saveSocialBtn">' + esc(t("Save")) + '</button>' +
      '<span class="form-error" id="socialFormError" style="margin:0;"></span></div></div></div>';

    // Redesigned layout: the logo sits beside a stacked column of the two
    // brand colors (was previously a flat grid that scattered logo and
    // colors across separate rows). Once a logo has been uploaded, the
    // upload control switches to an "Uploaded" preview state with a small
    // thumbnail instead of always showing the generic empty dropzone.
    html += '<div class="panel-card"><h3>' + esc(t("Brand")) + '</h3><div class="brand-section-layout">' +
      '<div class="brand-logo-col"><label class="form-field-label">' + esc(t("Logo")) + '</label>' +
      '<label class="upload-field' + (c.logoImage ? ' has-logo' : '') + '" style="cursor:pointer;">' +
      '<input type="file" accept="image/*" data-upload-logo="1" style="display:none;">' +
      (c.logoImage
        ? '<img class="logo-preview" src="' + esc(c.logoImage) + '" alt="Logo">' +
          '<div class="uploaded-badge">✓ ' + esc(t("Uploaded")) + '</div><div class="txt">' + esc(t("Click to update")) + '</div>'
        : '<div class="icon">⇪</div><div class="txt">' + esc(t("Click to upload — used as your dashboard icon")) + '</div>') +
      '</label></div>' +
      '<div class="brand-colors-col">' +
      '<div class="form-field"><label>' + esc(t("Primary Color")) + '</label><input type="color" id="cbLogoColor" value="' + c.logoColor + '" style="height:38px;padding:2px;"></div>' +
      '<div class="form-field"><label>' + esc(t("Secondary Color")) + '</label><input type="color" id="cbSecondaryColor" value="' + (c.secondaryColor || "#B7791F") + '" style="height:38px;padding:2px;"></div>' +
      '</div></div></div>';

    container.innerHTML = html;
    window._clientSocialLinks = socialLinks;
    bindContentDelegation();

    document.getElementById("saveBizBtn").addEventListener("click", function () {
      var btn = this;
      setButtonLoading(btn, true, "Saving…");
      api.portal.saveBusiness({
        name: document.getElementById("cbName").value,
        owner: document.getElementById("cbOwner").value,
        industry: document.getElementById("cbIndustry").value,
        location: document.getElementById("cbLocation").value
      }).then(function () {
        setButtonLoading(btn, false);
        toast("Profile saved", "success");
      }).catch(function (err) {
        setButtonLoading(btn, false);
        document.getElementById("bizFormError").textContent = err.message;
      });
    });

    document.getElementById("saveSocialBtn").addEventListener("click", function () {
      var btn = this;
      var errEl = document.getElementById("socialFormError");
      errEl.textContent = "";
      setButtonLoading(btn, true, "Saving…");
      api.portal.saveSocialLinks(window._clientSocialLinks).then(function () {
        setButtonLoading(btn, false);
        toast(t("Social links saved"), "success");
        // Switch to the clickable view-mode pills instead of leaving the
        // raw edit form up after a successful save.
        renderClientBusiness(container);
      }).catch(function (err) {
        setButtonLoading(btn, false);
        errEl.textContent = err.message;
      });
    });

    var editSocialBtn = document.getElementById("editSocialBtn");
    if (editSocialBtn) editSocialBtn.addEventListener("click", function () {
      document.getElementById("socialLinksViewWrap").style.display = "none";
      document.getElementById("socialLinksEditWrap").style.display = "block";
    });

    var colorInput = document.getElementById("cbLogoColor");
    colorInput.addEventListener("change", function () {
      api.portal.saveBrand({ logoColor: colorInput.value }).then(function () {
        toast(t("Brand color updated"), "success");
      }).catch(errorToast);
    });
    var secondaryColorInput = document.getElementById("cbSecondaryColor");
    secondaryColorInput.addEventListener("change", function () {
      api.portal.saveBrand({ secondaryColor: secondaryColorInput.value }).then(function () {
        toast(t("Secondary color updated"), "success");
      }).catch(errorToast);
    });
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientBusiness(container); });
  });
}

function lockedServiceCard(s) {
  return '<div class="service-card locked"><div class="head"><h4>' + esc(trF(s.name, s.nameAr)) + '</h4><span class="status-badge status-locked">🔒 Locked</span></div>' +
    '<div class="headline">' + esc(trF(s.headline, s.headlineAr)) + '</div>' +
    '<ul>' + (trF(s.whatYouGet, s.whatYouGetAr) || s.whatYouGet).slice(0, 4).map(function (w) { return '<li>' + esc(t(w)) + '</li>'; }).join('') + '</ul>' +
    (s.whyYouNeedIt ? '<div class="why"><b>' + esc(t("Why you need it")) + ' —</b> ' + esc(trF(s.whyYouNeedIt, s.whyYouNeedItAr)) + '</div>' : '') +
    '<div class="price">' + esc(s.price) + '</div>' +
    '<button class="btn btn-primary btn-sm" data-request-service="' + s.id + '">Request Service →</button></div>';
}

function renderClientServices(container) {
  Promise.all([api.portal.client(), getServices()]).then(function (r) {
    var c = r[0].client, services = r[1];
    var active = services.filter(function (s) { return c.activeServices.indexOf(s.id) !== -1; });
    var locked = services.filter(function (s) { return c.activeServices.indexOf(s.id) === -1; });
    var html = '<div class="section-title">Your Active Services</div><div class="service-grid">' +
      active.map(function (s) {
        return '<div class="service-card"><div class="head"><h4>' + esc(trF(s.name, s.nameAr)) + '</h4><span class="status-badge status-active">Active</span></div>' +
          '<div class="headline">' + esc(trF(s.headline, s.headlineAr)) + '</div><ul>' + (trF(s.whatYouGet, s.whatYouGetAr) || s.whatYouGet).map(function (w) { return '<li>' + esc(t(w)) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>';
    html += '<div class="section-title">Explore More</div><div class="service-grid">' + locked.map(lockedServiceCard).join('') + '</div>';
    container.innerHTML = html;
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientServices(container); });
  });
}

function renderClientSubscription(container) {
  Promise.all([api.portal.client(), getPlans(), getEntitlements()]).then(function (r) {
    var c = r[0].client, plans = r[1], entLabels = r[2];
    var plan = plans.filter(function (p) { return p.id === c.planId; })[0];
    if (!plan) { container.innerHTML = errorState(new Error("Plan not found.")); return; }
    var planIdx = plans.indexOf(plan);
    var nextPlan = plans[planIdx + 1];

    var html = '<div class="current-plan-hero"><div class="row"><div><div class="eyebrow">Current Plan</div><div class="name">' + esc(plan.name) + '</div><div class="price">EGP ' + esc(plan.price) + ' / ' + esc(plan.cycle) + ' \u00b7 ' + esc(t("renews")) + ' ' + esc(c.renewal) + '</div></div>' +
      '<div><span class="status-badge ' + healthClass(c.billingStatus) + '" style="background:rgba(255,255,255,0.2);color:#fff;">' + esc(t(c.billingStatus)) + '</span></div></div></div>';

    html += '<div class="section-title">' + esc(t("Included Services")) + '</div><div class="panel-card"><ul style="list-style:none;padding:0;margin:0;">' +
      entLabels.filter(function (e) { return plan.entitlements.indexOf(e.key) !== -1; })
        .map(function (e) { return '<li style="padding:6px 0;">\u2713 ' + esc(trF(e.label, e.labelAr)) + '</li>'; }).join('') + '</ul></div>';

    if (nextPlan) {
      html += '<div class="section-title">' + esc(t("Next Step Up")) + '</div><div class="plan-card-row"><div class="plan-card featured">' +
        '<div class="name">' + esc(nextPlan.name) + '</div><div class="price">EGP ' + esc(nextPlan.price) + ' <span>/ ' + esc(nextPlan.cycle) + '</span></div>' +
        '<ul>' + entLabels.map(function (e) { return '<li class="' + (nextPlan.entitlements.indexOf(e.key) === -1 ? 'off' : '') + '">' + esc(trF(e.label, e.labelAr)) + '</li>'; }).join('') + '</ul>' +
        '<div style="margin-top:16px;"><button class="btn btn-primary btn-sm" data-request-upgrade="' + nextPlan.id + '">Request Upgrade →</button></div></div></div>';
    }
    container.innerHTML = html;
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientSubscription(container); });
  });
}

// Merged "Reports & Performance" page: the client's live KPI snapshot
// (from their profile) at the top, then the full history of WITRA-published
// monthly reports below — each one entered manually by WITRA from real
// numbers, with the narrative auto-generated from those numbers.
function renderClientReports(container) {
  Promise.all([api.portal.client(), api.reports.mine()]).then(function (r) {
    var c = r[0].client, reports = r[1].reports;
    window._reportsCacheClient = reports;
    _reportsCache = reports;

    var html = '<div class="kpi-grid">' +
      kpi("Leads Generated", c.kpis.leads) + kpi("Conversion Rate", c.kpis.conversion) +
      kpi("Cost per Lead", "EGP " + c.kpis.cpl) + kpi("ROAS", c.kpis.roas + "x") + '</div>';

    var banner = '<div class="methodology-banner"><span class="ico">ℹ</span><div><b>' + esc(t("How these numbers are sourced")) + '</b><p>' + esc(t(api.reportsMeta.methodologyNote)) + '</p></div></div>';

    if (reports.length > 1) {
      var trendData = reports.slice().reverse().slice(-6).map(function (rp) { return { label: rp.period.split(" ")[0].slice(0, 3), value: rp.metrics.leads }; });
      html += '<div class="section-title">' + esc(t("Leads Trend")) + '</div><div class="panel-card">' + svgLineChart(trendData, { color: "var(--accent)" }) + '</div>';
    }

    html += '<div class="section-title">' + esc(t("Monthly Reports")) + '</div>' + banner;
    if (reports.length === 0) {
      html += emptyState("▦", t("No reports yet"), t("Your first report will appear here once WITRA publishes it — usually early next month."));
      container.innerHTML = html;
      bindContentDelegation();
      return;
    }
    html += '<div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Period")) + '</th><th>' + esc(t("Leads Generated")) + '</th><th>ROAS</th><th>' + esc(t("Status")) + '</th><th></th></tr></thead><tbody>' +
      reports.map(function (rp) { return '<tr><td class="cell-main">' + esc(rp.period) + '</td><td class="mono">' + rp.metrics.leads + '</td><td class="mono">' + esc(rp.metrics.roas) + 'x</td><td><span class="status-badge status-published">' + esc(t("Published")) + '</span></td><td><button class="btn btn-sm" data-view-report="' + rp.id + '">' + esc(t("View")) + '</button></td></tr>'; }).join('') +
      '</tbody></table></div>';
    container.innerHTML = html;
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientReports(container); });
  });
}

function renderClientActivities(container) {
  api.activities.mine().then(function (r) {
    if (r.activities.length === 0) { container.innerHTML = emptyState("≡", "No activity yet", "Updates on your account will show up here."); return; }
    container.innerHTML = '<div class="panel-card"><div class="activity-feed">' + r.activities.map(activityRow).join('') + '</div></div>';
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientActivities(container); });
  });
}

function renderClientRequests(container) {
  api.requests.mine().then(function (r) {
    var reqs = r.requests;
    if (reqs.length === 0) { container.innerHTML = emptyState("✎", "No requests yet", "Explore services you don't have yet from My Services."); return; }
    container.innerHTML = '<div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Service")) + '</th><th>' + esc(t("Requested")) + '</th><th>' + esc(t("Status")) + '</th></tr></thead><tbody>' +
      reqs.map(function (rq) { return '<tr><td class="cell-main">' + esc(rq.service) + '</td><td class="mono">' + esc(rq.requestedDate) + '</td><td><span class="status-badge ' + healthClass(rq.status) + '">' + esc(rq.status) + '</span></td></tr>'; }).join('') +
      '</tbody></table></div>';
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientRequests(container); });
  });
}

function renderClientContentPlanner(container) {
  Promise.all([api.portal.client(), getPlans()]).then(function (r) {
    var c = r[0].client, plans = r[1];
    if (!clientHasEntitlement(plans, c, "content_plan")) {
      container.innerHTML = '<div class="service-card locked" style="max-width:520px;">' +
        '<div class="head"><h4>Content Ops Tracker</h4><span class="status-badge status-locked">🔒 Locked</span></div>' +
        '<div class="headline">Plan every Story, post and field activation in one calendar — and know exactly what shipped versus what didn\'t, every month.</div>' +
        '<ul><li>Story &amp; content calendars, day by day</li><li>Status tracking — Planned → Posted / Published</li><li>Automatic monthly execution reports</li><li>One shared calendar your whole team can see</li></ul>' +
        '<div class="why"><b>Why you need it —</b> Right now your content plan lives in someone\'s head or a WhatsApp thread. This turns it into something you can actually see progress on.</div>' +
        '<div class="price">Included from the <b>Core</b> plan and up</div>' +
        '<button class="btn btn-primary btn-sm" data-request-upgrade="core">Request Upgrade →</button></div>';
      bindContentDelegation();
      return;
    }

    container.innerHTML = '<div class="tracker-frame-wrap tracker-frame-full"><iframe src="/static/content-ops.html?embed=1' + (currentLang === "ar" ? '&lang=ar' : '') + '" style="width:100%;height:600px;border:0;display:block;" title="Content Ops Tracker"></iframe></div>';
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientContentPlanner(container); });
  });
}

function renderClientTeam(container) {
  Promise.all([api.team.clientList(), api.team.clientRequests()]).then(function (r) {
    var team = r[0].team, requests = r[1].requests;
    var pending = requests.filter(function (rq) { return rq.status === "Requested"; });
    var html = '<p class="cell-sub" style="margin-bottom:16px;">' + esc(t("Adding a teammate is a request — WITRA reviews it and creates their account, so every person who ever gets access is on record.")) + '</p>';
    html += '<div class="toolbar"><span style="flex:1;"></span><button class="btn btn-primary btn-sm" data-toggle-invite="1">+ ' + esc(t("Request Team Member")) + '</button></div>';
    if (state._inviteFormOpen) {
      html += '<div class="panel-card"><div class="form-grid">' +
        '<div class="form-field"><label>' + esc(t("Name")) + '</label><input type="text" id="inviteName"></div>' +
        '<div class="form-field"><label>' + esc(t("Email")) + '</label><input type="email" id="inviteEmail" placeholder="teammate@email.com"></div>' +
        '</div><div class="form-grid">' +
        '<div class="form-field"><label>' + esc(t("Access Level")) + '</label><select id="inviteRole"><option>Manager</option><option>Editor</option><option>Viewer</option></select></div>' +
        '<div class="form-field"><label>' + esc(t("Password")) + '</label><input type="password" id="invitePassword" placeholder="' + esc(t("Min. 6 characters")) + '" autocomplete="new-password"><span class="cell-sub">' + esc(t("They'll use this to log in once WITRA approves the request.")) + '</span></div>' +
        '</div><div class="form-error" id="inviteFormError"></div>' +
        '<button class="btn btn-primary btn-sm" data-send-invite="1">' + esc(t("Submit Request")) + '</button></div>';
    }
    html += '<div class="section-title">' + esc(t("Active Team")) + '</div>';
    html += '<div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Name")) + '</th><th>' + esc(t("Role")) + '</th><th>' + esc(t("Access")) + '</th></tr></thead><tbody>' +
      team.map(function (tm) { return '<tr><td><div style="display:flex;align-items:center;gap:9px;"><div class="avatar-sm">' + initials(tm.name) + '</div>' + esc(tm.name) + '</div></td><td>' + esc(tm.role) + '</td><td class="cell-sub">' + esc(tm.role) + ' Access</td></tr>'; }).join('') +
      '</tbody></table></div>';

    if (requests.length) {
      html += '<div class="section-title">' + esc(t("Requests")) + (pending.length ? ' <span class="status-badge status-needs-attention">' + pending.length + ' ' + esc(t("pending")) + '</span>' : '') + '</div>';
      html += '<div class="panel-card"><table class="data-table"><thead><tr><th>' + esc(t("Name")) + '</th><th>' + esc(t("Email")) + '</th><th>' + esc(t("Access")) + '</th><th>' + esc(t("Requested")) + '</th><th>' + esc(t("Status")) + '</th></tr></thead><tbody>' +
        requests.map(function (rq) {
          return '<tr><td class="cell-main">' + esc(rq.name) + '</td><td class="mono cell-sub">' + esc(rq.email) + '</td><td>' + esc(rq.role) + '</td><td class="mono">' + esc(rq.requestedDate) + '</td>' +
            '<td><span class="status-badge ' + healthClass(rq.status) + '">' + esc(rq.status) + '</span></td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    container.innerHTML = html;
    bindContentDelegation();
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientTeam(container); });
  });
}

/* ===================== ATTACHMENT HELPERS ===================== */

function fileIcon(mime, filename) {
  if (mime.indexOf("pdf") !== -1) return "\ud83d\udcc4";
  if (mime.indexOf("word") !== -1 || /\.docx?$/i.test(filename)) return "\ud83d\udcdd";
  if (mime.indexOf("spreadsheet") !== -1 || mime.indexOf("excel") !== -1 || /\.xlsx?$/i.test(filename)) return "\ud83d\udcca";
  if (mime.indexOf("presentation") !== -1 || mime.indexOf("powerpoint") !== -1 || /\.pptx?$/i.test(filename)) return "\ud83d\udcd1";
  if (mime.indexOf("image") !== -1) return "\ud83d\uddbc\ufe0f";
  return "\ud83d\udcce";
}

function fmtFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return Math.round(bytes / 1024) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function attachmentCategoryIcon(label) {
  var icons = { "Strategy": "\ud83c\udfaf", "SWOT Analysis": "\ud83d\udcd0", "Marketing Plan": "\ud83d\udcc8", "Business Plan": "\ud83d\udcbc", "Brand Guidelines": "\ud83c\udfa8", "Other": "\ud83d\udcce" };
  return icons[label] || "\ud83d\udcce";
}

function renderAttachmentRows(attachments, isAdmin) {
  if (!attachments.length) return '<div class="cell-sub">' + esc(t("No attachments yet")) + '</div>';
  var groups = {};
  attachments.forEach(function (att) {
    if (!groups[att.label]) groups[att.label] = [];
    groups[att.label].push(att);
  });
  var html = '';
  Object.keys(groups).forEach(function (label) {
    html += '<div class="attachment-category-label">' + attachmentCategoryIcon(label) + ' ' + esc(t(label)) + '</div>';
    html += '<div class="attachments-grid">';
    groups[label].forEach(function (att) {
      html += '<div class="attachment-card">' +
        '<div class="attachment-icon">' + fileIcon(att.mimeType, att.filename) + '</div>' +
        '<div class="attachment-info">' +
          '<div class="attachment-name">' + esc(att.filename) + '</div>' +
          '<div class="attachment-meta">' + fmtFileSize(att.fileSize) + ' \u00b7 ' + esc(t("Uploaded by")) + ' ' + esc(att.uploaderName) + ' \u00b7 ' + esc(att.createdAt.split("T")[0]) + '</div>' +
        '</div>' +
        '<div class="attachment-actions">' +
        '<button class="btn btn-sm attachment-download-btn" data-download-attachment="' + att.id + '" data-filename="' + esc(att.filename) + '">\u2b07 ' + esc(t("Download")) + '</button>' +
        (isAdmin ? '<button class="btn btn-sm btn-danger-subtle" data-delete-attachment="' + att.id + '" data-att-name="' + esc(att.filename) + '">\u2715</button>' : '') +
        '</div></div>';
    });
    html += '</div>';
  });
  return html;
}

function triggerAttachmentDownload(attId, fname) {
  apiFetch("/api/attachments/portal/" + attId + "/download").then(function (res) {
    var link = document.createElement("a");
    link.href = res.fileData;
    link.download = res.filename || fname;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }).catch(errorToast);
}

function renderClientAttachments(container) {
  api.portal.attachments().then(function (res) {
    var attachments = res.attachments || [];
    if (!attachments.length) {
      container.innerHTML = emptyState("\ud83d\udcce", t("No attachments yet"), t("Your business documents will appear here once WITRA uploads them."));
      bindRetry(function () { renderClientAttachments(container); });
      return;
    }
    var html = '<p class="cell-sub" style="margin-bottom:16px;">' + esc(t("Strategy, SWOT Analysis, Marketing Plans and other business documents uploaded by WITRA.")) + '</p>';
    html += renderAttachmentRows(attachments, false);
    container.innerHTML = html;
    bindContentDelegation();
    container.querySelectorAll("[data-download-attachment]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var attId = btn.getAttribute("data-download-attachment");
        var fname = btn.getAttribute("data-filename");
        setButtonLoading(btn, true, t("Working\u2026"));
        apiFetch("/api/attachments/portal/" + attId + "/download").then(function (res) {
          setButtonLoading(btn, false);
          var link = document.createElement("a");
          link.href = res.fileData;
          link.download = res.filename || fname;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });
      });
    });
  }).catch(function (err) {
    container.innerHTML = errorState(err);
    bindRetry(function () { renderClientAttachments(container); });
  });
}

function loadAdminAttachments(clientId) {
  var listEl = document.getElementById("adminAttachmentsList");
  if (!listEl) return;
  api.attachments.ofClient(clientId).then(function (res) {
    var atts = res.attachments || [];
    listEl.innerHTML = renderAttachmentRows(atts, true);
    listEl.querySelectorAll("[data-download-attachment]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var attId = btn.getAttribute("data-download-attachment");
        var fname = btn.getAttribute("data-filename");
        setButtonLoading(btn, true, t("Working\u2026"));
        triggerAttachmentDownload(attId, fname);
        setTimeout(function () { setButtonLoading(btn, false); }, 1500);
      });
    });
    listEl.querySelectorAll("[data-delete-attachment]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var attId = btn.getAttribute("data-delete-attachment");
        var attName = btn.getAttribute("data-att-name");
        if (!confirm(t("Delete this attachment?") + "\n" + attName)) return;
        setButtonLoading(btn, true, "\u2026");
        api.attachments.remove(attId).then(function () {
          toast(t("Attachment deleted"), "success");
          loadAdminAttachments(clientId);
        }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });
      });
    });
  }).catch(function () {
    listEl.innerHTML = '<div class="cell-sub">' + esc(t("No attachments yet")) + '</div>';
  });
}

function renderClientSettings(container) {
  var rows = [["Profile", "Your name, email, and photo"], ["Business Profile", "Edit under My Business"],
    ["Team Members", "Manage under Team"],
    ["Notification Preferences", "Email and in-app alerts"]];
  container.innerHTML = '<div class="panel-card"><div class="settings-list">' + rows.map(function (r) {
    return '<div class="settings-row"><div><div class="lbl">' + esc(r[0]) + '</div><div class="desc">' + esc(r[1]) + '</div></div><button class="btn btn-sm" data-manage-setting="' + esc(r[0]) + '">Manage</button></div>';
  }).join('') + '</div></div>';
  bindContentDelegation();
}

var _delegationBound = false;
function bindContentDelegation() {
  if (_delegationBound) return;
  _delegationBound = true;

  document.addEventListener("click", function (e) {
    var el;

    if (el = e.target.closest("#bellBtn")) {
      e.stopPropagation();
      var existingPanel = document.getElementById("notifPanel");
      if (existingPanel) { 
        existingPanel.remove(); 
        notifApiForView().markAllRead().then(function() {
          var b = document.querySelector(".bell-dot"); if(b) b.remove();
        }).catch(function(){});
        return; 
      }
      notifApiForView().list().then(function (res) {
        var wrap = document.getElementById("notifWrap");
        if (wrap) wrap.insertAdjacentHTML("beforeend", notifPanelHtml(res.notifications));
      }).catch(errorToast);
      return;
    }
    if (e.target.id === "markAllReadBtn") {
      e.stopPropagation();
      notifApiForView().markAllRead().then(function () {
        var p = document.getElementById("notifPanel"); if (p) p.remove();
        var b = document.querySelector(".bell-dot"); if (b) b.remove();
      }).catch(errorToast);
      return;
    }
    var notifPanel = document.getElementById("notifPanel");
    if (notifPanel && !notifPanel.contains(e.target) && e.target.id !== "bellBtn" && !e.target.closest("#bellBtn")) {
      notifPanel.remove();
      notifApiForView().markAllRead().then(function() {
        var b = document.querySelector(".bell-dot"); if(b) b.remove();
      }).catch(function(){});
    }

    if (el = e.target.closest("[data-nav]")) {
      var id = el.getAttribute("data-nav");
      if (id === "logout") {
        api.auth.logout().finally(function () {
          state.view = "public"; state.currentUser = null; state.impersonatingClientId = null; state.viewingClientId = null;
          window.history.replaceState({}, "", "/");
          invalidateCache();
          render();
        });
        return;
      }
      if (id === "exit-impersonation") {
        api.auth.exitImpersonation().then(function () {
          state.view = "admin"; state.impersonatingClientId = null; state.adminSection = "clients";
          render();
        }).catch(errorToast);
        return;
      }
      closeModal();
      if (state.view === "admin") { state.adminSection = id; renderAdminSection(); }
      else { state.clientSection = id; renderClientSection(); }
      refreshBellDot();
      return;
    }

    
    if (el = e.target.closest("[data-edit-billing-status]")) {
      e.stopPropagation();
      var id = el.getAttribute("data-edit-billing-status");
      var current = el.getAttribute("data-current-status");
      var selectHtml = '<select id="billingStatusSelect" class="form-input" style="margin-bottom:12px;">' +
        '<option value="Active"' + (current === 'Active' ? ' selected' : '') + '>' + esc(t("Active")) + '</option>' +
        '<option value="Renewed"' + (current === 'Renewed' ? ' selected' : '') + '>' + esc(t("Renewed")) + '</option>' +
        '<option value="Expired"' + (current === 'Expired' ? ' selected' : '') + '>' + esc(t("Expired")) + '</option>' +
        '<option value="Cancelled"' + (current === 'Cancelled' ? ' selected' : '') + '>' + esc(t("Cancelled")) + '</option>' +
        '</select>' +
        '<div style="text-align:right;"><button class="btn btn-primary" id="saveBillingStatusBtn">' + esc(t("Save")) + '</button></div>';
      
      openModal(esc(t("Update Billing Status")), selectHtml);
      
      document.getElementById("saveBillingStatusBtn").addEventListener("click", function() {
        var newVal = document.getElementById("billingStatusSelect").value;
        var btn = this;
        btn.disabled = true;
        apiFetch("/api/clients/" + id + "/billing-status", {
          method: "PUT",
          body: JSON.stringify({ status: newVal })
        }).then(function() {
          closeModal();
          toast(t("Status updated"), "success");
          renderAdminSubscriptions(document.getElementById("adminContent"));
        }).catch(function(err) {
          btn.disabled = false;
          errorToast(err);
        });
      });
      return;
    }

    if (el = e.target.closest("[data-open-client]")) {
      closeModal();
      var ocid = el.getAttribute("data-open-client");
      api.auth.impersonate(ocid).then(function () {
        state.impersonatingClientId = ocid;
        state.viewingClientId = ocid;
        state.view = "client";
        state.clientSection = "dashboard";
        render();
      }).catch(errorToast);
      return;
    }
    if (el = e.target.closest("[data-view-profile]")) {
      closeModal();
      state.adminViewingClientId = el.getAttribute("data-view-profile");
      state.adminSection = "client-profile";
      state.view = "admin";
      renderAdminSection();
      return;
    }

    if (el = e.target.closest("[data-request-service]")) {
      var sid = el.getAttribute("data-request-service");
      api.requests.requestService(sid).then(function () {
        renderClientSection();
        toast("Service requested — WITRA will follow up shortly", "success");
      }).catch(errorToast);
      return;
    }
    if (el = e.target.closest("[data-request-upgrade]")) {
      var tpid = el.getAttribute("data-request-upgrade");
      getPlans().then(function (plans) {
        var target = plans.filter(function (p) { return p.id === tpid; })[0];
        var realTargetId = target ? target.id : (plans[0] ? plans[0].id : tpid);
        return api.requests.requestUpgrade(realTargetId);
      }).then(function () {
        toast("Upgrade requested — WITRA will be in touch", "success");
      }).catch(errorToast);
      return;
    }

    if (el = e.target.closest("[data-review-request]")) { reviewRequestModal(el.getAttribute("data-review-request")); return; }

    if (el = e.target.closest("[data-add-client]")) { getPlans().then(createClientModal); return; }
    if (el = e.target.closest("[data-export-clients]")) { window.open(api.clients.exportCsvUrl(), "_blank"); toast("Exporting client list…"); return; }
    if (el = e.target.closest("[data-edit-plan]")) { editPlanModal(el.getAttribute("data-edit-plan")); return; }

    if (el = e.target.closest("[data-toggle-witra-invite]")) { state._witraInviteOpen = !state._witraInviteOpen; renderAdminSection(); return; }
    if (el = e.target.closest("[data-send-witra-invite]")) {
      var wn = document.getElementById("wtName").value.trim();
      var we = document.getElementById("wtEmail").value.trim();
      var wp = document.getElementById("wtPassword").value.trim();
      var errEl = document.getElementById("wtFormError");
      if (errEl) errEl.textContent = "";
      if (!wn || !we) { if (errEl) errEl.textContent = "Name and email are required."; else toast("Name and email are required", "error"); return; }
      if (wp.length < 6) { if (errEl) errEl.textContent = "A password of at least 6 characters is required."; return; }
      var assignedClientIds = Array.prototype.slice.call(document.querySelectorAll(".wtClientChk:checked")).map(function (chk) { return chk.value; });
      api.team.witraAdd({
        name: wn, email: we,
        password: wp,
        role: document.getElementById("wtRole").value,
        assignedClientIds: assignedClientIds
      }).then(function () {
        state._witraInviteOpen = false;
        renderAdminSection();
        toast("Team member added — " + we, "success");
      }).catch(function (err) { if (errEl) errEl.textContent = err.message; else errorToast(err); });
      return;
    }
    if (el = e.target.closest("[data-remove-witra]")) {
      var wid = el.getAttribute("data-remove-witra");
      api.team.witraRemove(wid).then(function () {
        renderAdminSection();
        toast("Team member removed", "success");
      }).catch(errorToast);
      return;
    }
    if (el = e.target.closest("[data-review-team-request]")) { teamRequestReviewModal(el.getAttribute("data-review-team-request")); return; }

    if (el = e.target.closest("[data-add-service]")) { serviceFormModal(null); return; }
    if (el = e.target.closest("[data-edit-service]")) { serviceFormModal(el.getAttribute("data-edit-service")); return; }

    if (el = e.target.closest("[data-view-report]")) { reportViewModal(el.getAttribute("data-view-report")); return; }
    if (el = e.target.closest("[data-edit-report]")) { reportFormModal(el.getAttribute("data-edit-report")); return; }
    if (el = e.target.closest("[data-delete-report]")) { reportDeleteConfirm(el.getAttribute("data-delete-report")); return; }

    if (el = e.target.closest("[data-manage-setting]")) { settingsDetailModal(el.getAttribute("data-manage-setting")); return; }

    if (el = e.target.closest("[data-add-social]")) {
      window._clientSocialLinks = window._clientSocialLinks || [];
      window._clientSocialLinks.push({ platform: "Instagram", url: "" });
      api.portal.saveSocialLinks(window._clientSocialLinks).then(function () { renderClientSection(); }).catch(errorToast);
      return;
    }
    if (el = e.target.closest("[data-remove-social]")) {
      var idx2 = parseInt(el.getAttribute("data-remove-social"), 10);
      window._clientSocialLinks = window._clientSocialLinks || [];
      window._clientSocialLinks.splice(idx2, 1);
      api.portal.saveSocialLinks(window._clientSocialLinks).then(function () { renderClientSection(); }).catch(errorToast);
      return;
    }

    if (el = e.target.closest("[data-toggle-invite]")) { state._inviteFormOpen = !state._inviteFormOpen; renderClientSection(); return; }
    if (el = e.target.closest("[data-send-invite]")) {
      var inviteName = document.getElementById("inviteName").value.trim();
      var inviteEmail = document.getElementById("inviteEmail").value.trim();
      var inviteRole = document.getElementById("inviteRole").value;
      var invitePassword = document.getElementById("invitePassword").value.trim();
      var ieErr = document.getElementById("inviteFormError");
      if (ieErr) ieErr.textContent = "";
      if (!inviteName || !inviteEmail) { if (ieErr) ieErr.textContent = "Name and email are required."; else toast("Name and email are required", "error"); return; }
      if (!invitePassword || invitePassword.length < 6) { if (ieErr) ieErr.textContent = "Password must be at least 6 characters."; return; }
      api.team.clientAdd({ name: inviteName, email: inviteEmail, password: invitePassword, role: inviteRole }).then(function () {
        state._inviteFormOpen = false;
        renderClientSection();
        toast("Request submitted — WITRA will review it shortly", "success");
      }).catch(function (err) { if (ieErr) ieErr.textContent = err.message; else errorToast(err); });
      return;
    }

  });

  document.addEventListener("change", function (e) {
    var bsTarget;
    if (bsTarget = e.target.closest("[data-inline-billing-status]")) {
      var id = bsTarget.getAttribute("data-inline-billing-status");
      var newVal = bsTarget.value;
      bsTarget.disabled = true;
      apiFetch("/api/clients/" + id + "/billing-status", {
        method: "PUT",
        body: JSON.stringify({ status: newVal })
      }).then(function() {
        toast(t("Status updated"), "success");
        CACHE.clients = null;
        var content = document.getElementById("adminContent") || document.getElementById("content");
        if (state.viewingClientId) {
          renderAdminClientProfile(content);
        } else {
          renderAdminSubscriptions(content);
        }
      }).catch(function(err) {
        bsTarget.disabled = false;
        errorToast(err);
      });
      return;
    }

    if (e.target.matches("[data-upload-logo]")) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      if (file.size > 1_500_000) { toast("Image is too large. Please use an image under ~1.5MB.", "error"); return; }
      var reader = new FileReader();
      reader.onload = function (evt) {
        api.portal.saveBrand({ logoImage: evt.target.result }).then(function () {
          renderClientSection();
          toast("Logo updated — this now appears as your dashboard icon", "success");
        }).catch(errorToast);
      };
      reader.readAsDataURL(file);
      return;
    }
    if (e.target.matches(".socialPlatform, .socialUrl")) {
      // Just update the in-memory draft here — the explicit "Save" button
      // (#saveSocialBtn, in renderClientBusiness) is what persists it, so
      // the client always has clear feedback on when it was actually saved.
      var idx = parseInt(e.target.getAttribute("data-social-idx"), 10);
      window._clientSocialLinks = window._clientSocialLinks || [];
      if (window._clientSocialLinks[idx]) {
        if (e.target.classList.contains("socialPlatform")) window._clientSocialLinks[idx].platform = e.target.value;
        else window._clientSocialLinks[idx].url = e.target.value;
      }
      return;
    }
  });
}

/* ===================== BOOT ===================== */
bindContentDelegation();
boot();

})();
