const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// Fix client portal subscription page (line ~2753-2764)

// "Current Plan" eyebrow
appJs = appJs.replace(
  `'<div class="eyebrow">Current Plan</div>`,
  `'<div class="eyebrow">' + esc(t("Current Plan")) + '</div>`
);

// "renews" text
appJs = appJs.replace(
  `' · renews ' + esc(c.renewal)`,
  `' · ' + esc(t("renews")) + ' ' + esc(c.renewal)`
);

// billingStatus without t() on line 2754
appJs = appJs.replace(
  `'<div><span class="status-badge ' + healthClass(c.billingStatus) + '" style="background:rgba(255,255,255,0.2);color:#fff;">' + esc(c.billingStatus) + '</span></div></div></div>'`,
  `'<div><span class="status-badge ' + healthClass(c.billingStatus) + '" style="background:rgba(255,255,255,0.2);color:#fff;">' + esc(t(c.billingStatus)) + '</span></div></div></div>'`
);

// "Included Services" title
appJs = appJs.replace(
  `'<div class="section-title">Included Services</div>`,
  `'<div class="section-title">' + esc(t("Included Services")) + '</div>`
);

// "Next Step Up" title
appJs = appJs.replace(
  `'<div class="section-title">Next Step Up</div>`,
  `'<div class="section-title">' + esc(t("Next Step Up")) + '</div>`
);

// "Request Upgrade →" button
appJs = appJs.replace(
  `'>Request Upgrade →</button>`,
  `'>' + esc(t("Request Upgrade →")) + '</button>`
);

// Add translations
const newTranslations = `
    "Current Plan": "الباقة الحالية",
    "renews": "يتجدد",
    "Included Services": "الخدمات المشمولة",
    "Next Step Up": "الباقة التالية",
    "Request Upgrade →": "طلب ترقية →",
`;

const arIdx = appJs.indexOf('ar: {');
if (arIdx !== -1) {
  appJs = appJs.substring(0, arIdx + 5) + newTranslations + appJs.substring(arIdx + 5);
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Client portal subscription page translated!");
