const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// 1. Replace t(key) function with a smarter one
const newT = `function t(key) {
  if (currentLang === "ar" && typeof key === "string") {
    if (locales.ar && locales.ar[key]) return locales.ar[key];
    
    // Dynamic Replacements for Activities
    if (key.includes("Team request for")) {
      return key.replace(/Team request for (.+?) was rejected/, "تم رفض طلب الانضمام للفريق من $1")
                .replace(/Team request for (.+?) was approved/, "تم قبول طلب الانضمام للفريق من $1");
    }
    if (key.includes("A draft performance report for")) {
      return key.replace(/A draft performance report for (.+?) was entered/, "تم إدخال مسودة تقرير الأداء لشهر $1");
    }
    if (key.includes("was added as a new client")) {
      return key.replace(/<b>(.+?)<\\/b> was added as a new client./, "تمت إضافة <b>$1</b> كعميل جديد.");
    }
    if (key.includes("was removed by WITRA")) {
      return key.replace(/<b>(.+?)<\\/b> was removed by WITRA./, "تمت إزالة <b>$1</b> بواسطة WITRA.");
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
}`;

// Match the old t() function using a Regex to handle line endings
appJs = appJs.replace(/function t\(key\)\s*\{\s*return \(locales\[currentLang\] && locales\[currentLang\]\[key\]\) \|\| key;\s*\}/g, newT);

// 2. Add missing translations to locales.ar
const missingTranslations = `
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
`;

// Insert the missing translations into locales.ar
if (!appJs.includes('"سبب الأهمية"')) {
  const arLocalesIndex = appJs.indexOf('ar: {');
  if (arLocalesIndex !== -1) {
    appJs = appJs.substring(0, arLocalesIndex + 5) + missingTranslations + appJs.substring(arLocalesIndex + 5);
  }
}

// 3. Wrap features in t() when rendering
// We want to replace return '<li>' + esc(w) + '</li>'; with return '<li>' + esc(t(w)) + '</li>';
appJs = appJs.replace(/return '<li>' \+ esc\(w\) \+ '<\/li>';/g, "return '<li>' + esc(t(w)) + '</li>';");

// 4. Wrap "Included in: "
appJs = appJs.replace(
  /'<div class="cell-sub">Included in: '/g,
  "'<div class=\"cell-sub\">' + esc(t(\"Included in: \"))"
);

// 5. Wrap "Standalone only"
appJs = appJs.replace(
  / : "Standalone only"\) \+ '<\/div>'/g,
  ' : t("Standalone only")) + \'</div>\''
);

// 6. Fix Status rendering in Service Requests table
appJs = appJs.replace(/esc\(r\.status\)/g, "esc(t(r.status))");
appJs = appJs.replace(/esc\(r\.role\)/g, "esc(t(r.role))");
appJs = appJs.replace(/esc\(m\.role\)/g, "esc(t(m.role))");
appJs = appJs.replace(/esc\(req\.role\)/g, "esc(t(req.role))");

// 7. Fix Notification and Activity texts
appJs = appJs.replace(
  /'"><div class="dot"><\/div><div><div>' \+ n\.text \+ '<\/div><div class="time">'/g,
  '\'"><div class="dot"></div><div><div>\' + t(n.text) + \'</div><div class="time">\''
);
appJs = appJs.replace(
  /'<div class="feed-text">' \+ a\.text \+ '<\/div><div class="time">'/g,
  '\'<div class="feed-text">\' + t(a.text) + \'</div><div class="time">\''
);

// 8. Re-apply Billing Status Modal listener (since it was wiped by checkout)
const target = 'if (el = e.target.closest("[data-open-client]")) {';
const listener = `
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
`;

if (!appJs.includes('data-edit-billing-status')) {
  appJs = appJs.replace(target, listener + '\n    ' + target);
}

// Ensure the Trial status is removed completely as per previous session!
appJs = appJs.replace(/'<div class="badge status-trial">Trial<\/div>' \+ /g, "");

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log('App patched successfully');
