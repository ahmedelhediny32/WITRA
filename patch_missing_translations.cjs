const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

const missingTranslations = `
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
`;

const arLocalesIndex = appJs.indexOf('ar: {');
if (arLocalesIndex !== -1) {
  appJs = appJs.substring(0, arLocalesIndex + 5) + missingTranslations + appJs.substring(arLocalesIndex + 5);
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Missing translations added successfully to locales.ar!");
