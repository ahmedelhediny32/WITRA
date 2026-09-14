const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

const targetModalRegex = /var body = '<div class="form-grid">' \+\s*'<div class="form-field"><label>Business Name \*<\/label>[\s\S]*?'<div class="form-error" id="ncFormError"><\/div>';/;

const newModalBody = `var body = '<div class="form-grid">' +
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
    '<div class="form-error" id="ncFormError"></div>';`;

appJs = appJs.replace(targetModalRegex, newModalBody);

const missingTranslations = `
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
`;

if (!appJs.includes('"مثل: مخبز الشروق"')) {
  const arLocalesIndex = appJs.indexOf('ar: {');
  if (arLocalesIndex !== -1) {
    appJs = appJs.substring(0, arLocalesIndex + 5) + missingTranslations + appJs.substring(arLocalesIndex + 5);
  }
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Client Modal updated successfully!");
