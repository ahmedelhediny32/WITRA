const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// ===== 1. Fix the subscriptions table: billingStatus should use t() =====
// Line 1651: esc(c.billingStatus) -> esc(t(c.billingStatus))
appJs = appJs.replace(
  `'<td><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(c.billingStatus) + '</span></td>' +\r\n          '<td class="mono">' + esc(c.renewal) + '</td><td class="mono">EGP ' + fmtMoney(c.mrr) + '</td></tr>'`,
  `'<td><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span></td>' +\r\n          '<td class="mono">' + esc(c.renewal) + '</td><td class="mono">EGP ' + fmtMoney(c.mrr) + '</td></tr>'`
);

// ===== 2. Fix client profile "Subscription & Contract" section (lines 1583-1597) =====
// "Subscription & Contract" title
appJs = appJs.replace(
  `'<div class="section-title">Subscription &amp; Contract</div>`,
  `'<div class="section-title">' + esc(t("Subscription & Contract")) + '</div>`
);

// Plan label
appJs = appJs.replace(
  `'<div><div class="cell-sub">Plan</div><div class="cell-main">' + esc(planNameFromList(plans, c.planId))`,
  `'<div><div class="cell-sub">' + esc(t("Plan")) + '</div><div class="cell-main">' + esc(planNameFromList(plans, c.planId))`
);

// MRR label  
appJs = appJs.replace(
  `'<div><div class="cell-sub">MRR</div><div class="cell-main mono">EGP '`,
  `'<div><div class="cell-sub">' + esc(t("MRR")) + '</div><div class="cell-main mono">EGP '`
);

// Contract Value label
appJs = appJs.replace(
  `'<div><div class="cell-sub">Contract Value</div><div class="cell-main mono">EGP '`,
  `'<div><div class="cell-sub">' + esc(t("Contract Value")) + '</div><div class="cell-main mono">EGP '`
);

// Renewal label
appJs = appJs.replace(
  `'<div><div class="cell-sub">Renewal</div><div class="cell-main mono">'`,
  `'<div><div class="cell-sub">' + esc(t("Renewal")) + '</div><div class="cell-main mono">'`
);

// Billing Status label and value
appJs = appJs.replace(
  `'<div><div class="cell-sub">Billing Status</div><div><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(c.billingStatus) + '</span></div></div>'`,
  `'<div><div class="cell-sub">' + esc(t("Billing Status")) + '</div><div><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span></div></div>'`
);

// "Recent Activity" title
appJs = appJs.replace(
  `'<div class="section-title">Recent Activity</div>`,
  `'<div class="section-title">' + esc(t("Recent Activity")) + '</div>`
);

// "No recent activity." text
appJs = appJs.replace(
  `'<div class="cell-sub">No recent activity.</div>'`,
  `'<div class="cell-sub">' + esc(t("No recent activity.")) + '</div>'`
);

// "Internal Notes" title
appJs = appJs.replace(
  `'<div class="section-title">Internal Notes</div>`,
  `'<div class="section-title">' + esc(t("Internal Notes")) + '</div>`
);

// "Internal only — never shown to client"
appJs = appJs.replace(
  `'<span class="internal-note-tag">Internal only — never shown to client</span>'`,
  `'<span class="internal-note-tag">' + esc(t("Internal only — never shown to client")) + '</span>'`
);

// "Save Notes" button
appJs = appJs.replace(
  `'<button class="btn btn-primary btn-sm" id="saveNotesBtn">Save Notes</button>'`,
  `'<button class="btn btn-primary btn-sm" id="saveNotesBtn">' + esc(t("Save Notes")) + '</button>'`
);

// placeholder for notes
appJs = appJs.replace(
  `placeholder="Sales notes, delivery notes, risk/retention notes…"`,
  `placeholder="' + esc(t("Sales notes, delivery notes, risk/retention notes…")) + '"`
);

// ===== 3. Fix "Plans" title on subscriptions page =====
appJs = appJs.replace(
  `'<div class="section-title">Plans</div>`,
  `'<div class="section-title">' + esc(t("Plans")) + '</div>`
);

// "Edit Plan" button
appJs = appJs.replace(
  `'>Edit Plan</button>`,
  `'>' + esc(t("Edit Plan")) + '</button>`
);

// The paragraph after plans
appJs = appJs.replace(
  `'<p class="cell-sub" style="margin:-8px 0 20px;">Each tier includes everything in the one before it, plus what\\'s listed. Content Plan (the Content Ops Tracker) unlocks starting at Core.</p>'`,
  `'<p class="cell-sub" style="margin:-8px 0 20px;">' + esc(t("Each tier includes everything in the one before it, plus what's listed. Content Plan (the Content Ops Tracker) unlocks starting at Core.")) + '</p>'`
);

// ===== 4. Sidebar and topbar titles =====
// Admin titles
appJs = appJs.replace(
  `subscriptions: "Subscriptions",`,
  `subscriptions: t("Subscriptions"),`
);

// ===== 5. Add missing translations to locales.ar =====
const newTranslations = `
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
`;

const arIdx = appJs.indexOf('ar: {');
if (arIdx !== -1) {
  appJs = appJs.substring(0, arIdx + 5) + newTranslations + appJs.substring(arIdx + 5);
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Subscription page fully translated!");
