const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// 1. Fix activity-text wrapper
appJs = appJs.replace(
  /'<div class="activity-text">' \+ a\.text \+ '<\/div><\/div><div class="activity-time">'/g,
  '\'<div class="activity-text">\' + t(a.text) + \'</div></div><div class="activity-time">\''
);

// 2. Add health strings replacements to t() function
const healthRegexes = `
    // Health statuses and reasons
    if (key.includes("Execution is falling behind")) {
      return key.replace(/Execution is falling behind - just (\\d+)% of planned work done \\((\\d+)\\/(\\d+)\\)\\./, "التنفيذ متأخر — تم إنجاز $1% فقط من العمل المخطط ($2/$3).");
    }
    if (key.includes("Execution needs attention")) {
      return key.replace(/Execution needs attention - (\\d+)% of planned work done \\((\\d+)\\/(\\d+)\\)\\./, "التنفيذ يحتاج انتباه — تم إنجاز $1% من العمل المخطط ($2/$3).");
    }
    if (key.includes("Execution is on track")) {
      return key.replace(/Execution is on track - (\\d+)% of planned work done \\((\\d+)\\/(\\d+)\\)\\./, "التنفيذ على المسار الصحيح — تم إنجاز $1% من العمل المخطط ($2/$3).");
    }
    if (key.includes("Just onboarded")) {
      return "بدأ حديثاً — سيتم حساب الحالة بعد بدء التنفيذ.";
    }
    if (key.includes("No execution data yet")) {
      return "لا توجد بيانات تنفيذ بعد — سيتم حساب الحالة بمجرد وضع المهام في خطة المحتوى.";
    }
`;

if (!appJs.includes('Execution is falling behind')) {
  appJs = appJs.replace('// Dynamic Replacements for Notifications', healthRegexes + '\n    // Dynamic Replacements for Notifications');
}

const missingTranslations = `
    "At Risk": "في خطر",
    "Needs Attention": "يحتاج انتباه",
    "On Track": "على المسار",
    "Onboarding": "بدء التعامل",
`;

if (!appJs.includes('"في خطر"')) {
  const arLocalesIndex = appJs.indexOf('ar: {');
  if (arLocalesIndex !== -1) {
    appJs = appJs.substring(0, arLocalesIndex + 5) + missingTranslations + appJs.substring(arLocalesIndex + 5);
  }
}

// Wrap health reason
appJs = appJs.replace(/esc\(client\.healthReason\)/g, "esc(t(client.healthReason))");

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log('App patched successfully');
