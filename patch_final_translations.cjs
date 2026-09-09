const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

const newTranslations = {
  'Suspended': 'موقوف',
  'This archives the client and deactivates their portal login. Historical data is kept.': 'سيتم أرشفة العميل وإلغاء تفعيل تسجيل دخوله. سيتم الاحتفاظ بالبيانات السابقة.',
  'Client removed': 'تم إزالة العميل',
  'Client resubscribed — services reactivated': 'تم تجديد الاشتراك — تم تفعيل الخدمات',
  'Requested Access': 'الصلاحية المطلوبة',
  'Approving creates their real portal account immediately, using the password the client already set for them. Rejecting just notifies the client — no account is created.': 'عند الموافقة، سيتم إنشاء حساب حقيقي لهم فوراً باستخدام الرقم السري الذي حدده العميل. عند الرفض، سيتم إشعار العميل فقط ولن يتم إنشاء حساب.',
  'Review Team Request': 'مراجعة طلب الفريق',
  'Request approved — account created': 'تمت الموافقة على الطلب — تم إنشاء الحساب',
  'Client Team Requests': 'طلبات فريق العميل',
  'pending': 'قيد الانتظار',
  'No client team requests yet — these appear here whenever a client asks to add a teammate.': 'لا توجد طلبات انضمام للفريق بعد — ستظهر هنا عندما يطلب العميل إضافة عضو جديد لفريقه.',
  'Review': 'مراجعة',
  'Add Team Member': 'إضافة عضو للفريق',
  "Set by WITRA — this is what they'll use to log in. Leave blank to use a default.": 'تم تحديده بواسطة WITRA — سيتم استخدامه لتسجيل الدخول. اتركه فارغاً لاستخدام رقم سري افتراضي.',
  'Team Members only see the clients checked here. Super Admins automatically see everyone.': 'أعضاء الفريق يرون فقط العملاء المحددين هنا. المدراء يرون الجميع تلقائياً.',
  'Add to Team': 'إضافة للفريق',
  '(overview — open Content Planner for the full calendar)': '(نظرة عامة — افتح مخطط المحتوى للتقويم الكامل)',
  'Add Link': 'إضافة رابط',
  'Secondary Color': 'اللون الثانوي',
  'Social links saved': 'تم حفظ روابط التواصل الاجتماعي',
  'Secondary color updated': 'تم تحديث اللون الثانوي',
  'Why you need it': 'سبب الأهمية',
  'Adding a teammate is a request — WITRA reviews it and creates their account, so every person who ever gets access is on record.': 'إضافة عضو جديد هو طلب — تقوم WITRA بمراجعته وإنشاء حسابه، لضمان تسجيل كل من يحصل على صلاحية الدخول.',
  'Request Team Member': 'طلب عضو فريق',
  'Access Level': 'مستوى الصلاحية',
  "They'll use this to log in once WITRA approves the request.": 'سيستخدمونه لتسجيل الدخول بمجرد موافقة WITRA على الطلب.',
  'Submit Request': 'إرسال الطلب',
  'Active Team': 'الفريق الفعال',
  'Renewed': 'مُجدد',
  'Expired': 'منتهي',
  'Cancelled': 'ملغى',
  'Active': 'نشط'
};

let missingTranslations = '';
for (const key in newTranslations) {
  missingTranslations += `    "${key}": "${newTranslations[key]}",\n`;
}

const arLocalesIndex = appJs.indexOf('ar: {');
if (arLocalesIndex !== -1) {
  appJs = appJs.substring(0, arLocalesIndex + 5) + '\\n' + missingTranslations + appJs.substring(arLocalesIndex + 5);
}

// Fix Dynamic Billing Status Logic
const newDynBlock = `
    // Subscription status changes
    if (key.includes("Subscription manually set to")) {
      return key.replace(/Subscription manually set to <b>(.+?)<\\/b> - services suspended\\./, function(m, status) {
        return "تم تحديث حالة الاشتراك يدوياً إلى <b>" + (locales.ar[status] || status) + "</b> — تم إيقاف الخدمات.";
      }).replace(/Subscription manually set to <b>(.+?)<\\/b> - services active\\./, function(m, status) {
        return "تم تحديث حالة الاشتراك يدوياً إلى <b>" + (locales.ar[status] || status) + "</b> — الخدمات فعالة.";
      });
    }

    if (key.includes("Your subscription status was changed to") || key.includes("Your subscription status is now")) {
       return key.replace(/Your subscription status was changed to (.+?) and your services have been paused\\./, function(m, status) {
         return "تم تغيير حالة اشتراكك إلى " + (locales.ar[status] || status) + " وتم إيقاف خدماتك مؤقتاً.";
       }).replace(/Your subscription status is now (.+?) and your services are active\\./, function(m, status) {
         return "حالة اشتراكك الآن " + (locales.ar[status] || status) + " وخدماتك فعالة.";
       });
    }
`;

// remove old subscription regex logic safely
appJs = appJs.replace(/if \\(typeof key === "string" && \\(key\\.includes\\("services"\\) \|\| key\\.includes\\("expired"\\) \|\| key\\.includes\\("renewed"\\)\\)\\) \\{[\\s\\S]*?\\}/, newDynBlock.trim());

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Missing translations and dynamic logic added successfully!");
