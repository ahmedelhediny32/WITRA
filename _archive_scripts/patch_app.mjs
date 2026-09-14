import fs from "fs";

let content = fs.readFileSync("public/static/app.js", "utf8");

// Add localization strings
content = content.replace(
  /    "Last Activity": "Last Activity"\r?\n  },/,
  `    "Last Activity": "Last Activity",
    "Impressions": "Impressions",
    "Conversions": "Conversions",
    "Ad Spend (EGP)": "Ad Spend (EGP)",
    "Revenue (EGP)": "Revenue (EGP)",
    "Engagement Rate (%)": "Engagement Rate (%)",
    "Channel": "Channel",
    "Service Type": "Service Type",
    "Campaign / Project": "Campaign / Project",
    "Visibility": "Visibility",
    "Internal": "Internal",
    "Notify Client": "Notify Client",
    "Archived": "Archived",
    "Report Details": "Report Details",
    "Performance Metrics": "Performance Metrics",
    "Report Options": "Report Options",
    "What Needs Attention": "What Needs Attention",
    "Data Quality": "Data Quality",
    "Key Insights": "Key Insights",
    "Baseline Period": "Baseline Period",
    "Comparison": "Comparison",
    "Primary Objective": "Primary Objective",
    "Priority Actions": "Priority Actions",
    "Metrics to Monitor": "Metrics to Monitor",
    "Suggested Focus": "Suggested Focus",
    "Performance Report": "Performance Report",
    "Publish": "Publish",
    "Archive": "Archive",
    "Print": "Print",
    "Version": "Version",
    "Published on": "Published on",
    "Not visible to client": "Not visible to client",
    "Auto-calculated": "Auto-calculated",
    "vs previous period": "vs previous period",
    "Baseline": "Baseline",
    "All Campaigns": "All Campaigns",
    "Meta Ads": "Meta Ads",
    "Google Ads": "Google Ads",
    "TikTok Ads": "TikTok Ads",
    "LinkedIn Ads": "LinkedIn Ads",
    "Organic Social": "Organic Social",
    "SEO": "SEO",
    "Email Marketing": "Email Marketing",
    "Website": "Website",
    "Other": "Other",
    "Paid Advertising": "Paid Advertising",
    "Social Media": "Social Media",
    "Content Marketing": "Content Marketing",
    "Branding": "Branding",
    "KPI Overview": "KPI Overview",
    "Ad Spend": "Ad Spend",
    "Revenue": "Revenue",
    "Engagement Rate": "Engagement Rate"
  },`
);

content = content.replace(
  /    "Last Activity": "آخر نشاط"\r?\n    "Command Center"/,
  `    "Last Activity": "آخر نشاط",
    "Impressions": "مرات الظهور",
    "Conversions": "التحويلات",
    "Ad Spend (EGP)": "الإنفاق الإعلاني (جنيه)",
    "Revenue (EGP)": "الإيرادات (جنيه)",
    "Engagement Rate (%)": "معدل التفاعل (%)",
    "Channel": "القناة",
    "Service Type": "نوع الخدمة",
    "Campaign / Project": "الحملة / المشروع",
    "Visibility": "الرؤية",
    "Internal": "داخلي",
    "Notify Client": "إشعار العميل",
    "Archived": "مؤرشف",
    "Report Details": "تفاصيل التقرير",
    "Performance Metrics": "مؤشرات الأداء",
    "Report Options": "خيارات التقرير",
    "What Needs Attention": "ما يحتاج انتباه",
    "Data Quality": "جودة البيانات",
    "Key Insights": "أهم النتائج",
    "Baseline Period": "فترة الأساس",
    "Comparison": "مقارنة",
    "Primary Objective": "الهدف الرئيسي",
    "Priority Actions": "الإجراءات ذات الأولوية",
    "Metrics to Monitor": "المؤشرات للمتابعة",
    "Suggested Focus": "التركيز المقترح",
    "Performance Report": "تقرير الأداء",
    "Publish": "نشر",
    "Archive": "أرشفة",
    "Print": "طباعة",
    "Version": "الإصدار",
    "Published on": "نُشر في",
    "Not visible to client": "غير مرئي للعميل",
    "Auto-calculated": "محسوب تلقائياً",
    "vs previous period": "مقارنة بالفترة السابقة",
    "Baseline": "خط الأساس",
    "All Campaigns": "جميع الحملات",
    "Meta Ads": "إعلانات ميتا",
    "Google Ads": "إعلانات جوجل",
    "TikTok Ads": "إعلانات تيك توك",
    "LinkedIn Ads": "إعلانات لينكدإن",
    "Organic Social": "سوشيال أورجانك",
    "SEO": "تحسين محركات البحث",
    "Email Marketing": "التسويق بالإيميل",
    "Website": "الموقع",
    "Other": "أخرى",
    "Paid Advertising": "إعلانات مدفوعة",
    "Social Media": "سوشيال ميديا",
    "Content Marketing": "تسويق المحتوى",
    "Branding": "العلامة التجارية",
    "KPI Overview": "نظرة عامة على المؤشرات",
    "Ad Spend": "الإنفاق الإعلاني",
    "Revenue": "الإيرادات",
    "Engagement Rate": "معدل التفاعل",
    "Command Center"`
);

// We need to replace from function reportFormModal down to function reportViewModal.
const startIdx = content.indexOf("// Manual report entry: WITRA only ever types in the raw numbers");
const endIdx = content.indexOf("/* ===================== ADMIN — ACTIVITIES ===================== */");

if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find replacement boundaries!");
    process.exit(1);
}

const replacementCode = `// Manual report entry v2: Organized form with auto-calculations, validation,
// and professional report preview. The narrative is auto-generated from
// validated, calculated metrics through the analysis pipeline.
function reportFormModal(reportId, presetClientId) {
  var rp = reportId ? (_reportsCache || []).filter(function (x) { return x.id === reportId; })[0] : null;
  api.clients.list().then(function (res) {
    var clientsList = res.clients;
    var clientOptions = clientsList.map(function (c) {
      var sel = (rp ? rp.clientId === c.id : presetClientId === c.id) ? " selected" : "";
      return "<option value=\\"" + c.id + "\\"" + sel + ">" + esc(c.name) + "</option>";
    }).join("");
    var m = rp ? rp.metrics : {};
    var channelOpts = ["", "Meta Ads", "Google Ads", "TikTok Ads", "LinkedIn Ads", "Organic Social", "SEO", "Email Marketing", "Website", "Other"];
    var serviceOpts = ["", "Paid Advertising", "Social Media", "SEO", "Content Marketing", "Branding", "Email Marketing", "Other"];
    var rpChannel = rp ? (rp.channel || "") : "";
    var rpService = rp ? (rp.serviceType || "") : "";
    var rpVis = rp ? (rp.visibility || "Internal") : "Internal";
    var rpNotify = rp ? !!rp.notifyClient : false;

    var body =
      // ---- REPORT DETAILS ----
      "<div class=\\"rp-form-section\\"><div class=\\"rp-form-section-title\\">" + esc(t("Report Details")) + "</div>" +
      "<div class=\\"form-grid\\">" +
      "<div class=\\"form-field\\"><label>" + esc(t("Client")) + " *</label><select id=\\"rpClient\\"" + (rp ? " disabled" : "") + ">" + clientOptions + "</select></div>" +
      "<div class=\\"form-field\\"><label>" + esc(t("Period")) + " *</label><input type=\\"text\\" id=\\"rpPeriod\\" placeholder=\\"" + esc(t("e.g. August 2026")) + "\\" value=\\"" + esc(rp ? rp.period : "") + "\\"></div>" +
      "</div>" +
      "<div class=\\"form-grid\\">" +
      "<div class=\\"form-field\\"><label>" + esc(t("Campaign / Project")) + "</label><input type=\\"text\\" id=\\"rpCampaign\\" placeholder=\\"" + esc(t("All Campaigns")) + "\\" value=\\"" + esc(rp ? (rp.campaign || "") : "") + "\\"></div>" +
      "<div class=\\"form-field\\"><label>" + esc(t("Channel")) + "</label><select id=\\"rpChannel\\">" + channelOpts.map(function(o) { return "<option value=\\"" + o + "\\"" + (o === rpChannel ? " selected" : "") + ">" + (o ? esc(t(o)) : "—") + "</option>"; }).join("") + "</select></div>" +
      "<div class=\\"form-field\\"><label>" + esc(t("Service Type")) + "</label><select id=\\"rpServiceType\\">" + serviceOpts.map(function(o) { return "<option value=\\"" + o + "\\"" + (o === rpService ? " selected" : "") + ">" + (o ? esc(t(o)) : "—") + "</option>"; }).join("") + "</select></div>" +
      "</div></div>" +

      // ---- PERFORMANCE METRICS ----
      "<div class=\\"rp-form-section\\"><div class=\\"rp-form-section-title\\">" + esc(t("Performance Metrics")) + "</div>" +
      "<div class=\\"form-grid\\">" +
      "<div class=\\"form-field\\"><label>" + esc(t("Reach")) + "</label><input type=\\"number\\" min=\\"0\\" id=\\"rpReach\\" value=\\"" + esc(fv(m.reach)) + "\\"></div>" +
      "<div class=\\"form-field\\"><label>" + esc(t("Impressions")) + "</label><input type=\\"number\\" min=\\"0\\" id=\\"rpImpressions\\" value=\\"" + esc(fv(m.impressions)) + "\\"></div>" +
      "<div class=\\"form-field\\"><label>" + esc(t("Engagement")) + "</label><input type=\\"number\\" min=\\"0\\" id=\\"rpEngagement\\" value=\\"" + esc(fv(m.engagement)) + "\\"></div>" +
      "<div class=\\"form-field\\" id=\\"rpEngRateWrap\\"><label>" + esc(t("Engagement Rate (%)")) + "</label><input type=\\"number\\" min=\\"0\\" step=\\"0.1\\" id=\\"rpEngRate\\" value=\\"" + esc(fv(m.engagementRate)) + "\\"><div class=\\"rp-calc-hint\\"><span class=\\"auto\\">⚡</span> " + esc(t("Auto-calculated")) + " = Engagement ÷ Reach</div></div>" +
      "</div>" +
      "<div class=\\"form-grid\\">" +
      "<div class=\\"form-field\\"><label>" + esc(t("Leads Generated")) + "</label><input type=\\"number\\" min=\\"0\\" id=\\"rpLeads\\" value=\\"" + esc(fv(m.leads)) + "\\"></div>" +
      "<div class=\\"form-field\\"><label>" + esc(t("Conversions")) + "</label><input type=\\"number\\" min=\\"0\\" id=\\"rpConversions\\" value=\\"" + esc(fv(m.conversions)) + "\\"></div>" +
      "<div class=\\"form-field\\" id=\\"rpConvRateWrap\\"><label>" + esc(t("Conversion Rate (%)")) + "</label><input type=\\"number\\" min=\\"0\\" max=\\"100\\" step=\\"0.1\\" id=\\"rpConversion\\" value=\\"" + esc(fv(m.conversionRate)) + "\\"><div class=\\"rp-calc-hint\\"><span class=\\"auto\\">⚡</span> " + esc(t("Auto-calculated")) + " = Conversions ÷ Leads</div></div>" +
      "</div>" +
      "<div class=\\"form-grid\\">" +
      "<div class=\\"form-field\\"><label>" + esc(t("Ad Spend (EGP)")) + "</label><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" id=\\"rpAdSpend\\" value=\\"" + esc(fv(m.adSpend)) + "\\"></div>" +
      "<div class=\\"form-field\\"><label>" + esc(t("Revenue (EGP)")) + "</label><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" id=\\"rpRevenue\\" value=\\"" + esc(fv(m.revenue)) + "\\"></div>" +
      "</div>" +
      "<div class=\\"form-grid\\">" +
      "<div class=\\"form-field\\" id=\\"rpCplWrap\\"><label>" + esc(t("Cost per Lead (EGP)")) + "</label><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" id=\\"rpCpl\\" value=\\"" + esc(fv(m.cpl)) + "\\"><div class=\\"rp-calc-hint\\"><span class=\\"auto\\">⚡</span> " + esc(t("Auto-calculated")) + " = Ad Spend ÷ Leads</div></div>" +
      "<div class=\\"form-field\\" id=\\"rpRoasWrap\\"><label>" + esc(t("ROAS (x)")) + "</label><input type=\\"number\\" min=\\"0\\" step=\\"0.1\\" id=\\"rpRoas\\" value=\\"" + esc(fv(m.roas)) + "\\"><div class=\\"rp-calc-hint\\"><span class=\\"auto\\">⚡</span> " + esc(t("Auto-calculated")) + " = Revenue ÷ Ad Spend</div></div>" +
      "</div></div>" +

      // ---- REPORT OPTIONS ----
      "<div class=\\"rp-form-section\\"><div class=\\"rp-form-section-title\\">" + esc(t("Report Options")) + "</div>" +
      "<div class=\\"form-grid\\">" +
      "<div class=\\"form-field\\"><label>" + esc(t("Status")) + "</label><select id=\\"rpStatus\\">" +
      "<option value=\\"Draft\\"" + (rp && rp.status === "Draft" ? " selected" : "") + ">" + esc(t("Draft")) + "</option>" +
      "<option value=\\"Published\\"" + (rp && rp.status === "Published" ? " selected" : "") + ">" + esc(t("Published")) + "</option>" +
      "<option value=\\"Archived\\"" + (rp && rp.status === "Archived" ? " selected" : "") + ">" + esc(t("Archived")) + "</option></select></div>" +
      "<div class=\\"form-field\\"><label>" + esc(t("Visibility")) + "</label><select id=\\"rpVisibility\\">" +
      "<option value=\\"Internal\\"" + (rpVis === "Internal" ? " selected" : "") + ">" + esc(t("Internal")) + "</option>" +
      "<option value=\\"Client\\"" + (rpVis === "Client" ? " selected" : "") + ">" + esc(t("Client")) + "</option></select></div>" +
      "</div>" +
      "<div class=\\"rp-toggle-row\\"><label class=\\"rp-toggle\\"><input type=\\"checkbox\\" id=\\"rpNotifyClient\\"" + (rpNotify ? " checked" : "") + "> " + esc(t("Notify Client")) + "</label></div>" +
      "</div>" +
      "<p class=\\"cell-sub\\">" + esc(t("The full report — executive summary, what worked, what didn\\'t, and recommendations — is generated automatically from these numbers. Publishing notifies the client.")) + "</p>" +
      "<div id=\\"rpValidation\\"></div>" +
      "<div class=\\"form-error\\" id=\\"rpFormError\\"></div>";

    var foot = "<button class=\\"btn btn-sm\\" data-close-modal=\\"1\\">" + esc(t("Cancel")) + "</button>" +
      "<button class=\\"btn btn-primary btn-sm\\" id=\\"rpSaveBtn\\">" + (rp ? esc(t("Save Changes")) : esc(t("Generate Report"))) + "</button>";
    openModal(rp ? t("Edit Report") : t("New Performance Report"), body, foot, "rp-modal-wide");

    // Auto-calculate derived metrics on input change
    function autoCalc() {
      var reach = pn("rpReach"), eng = pn("rpEngagement"), leads = pn("rpLeads"),
          conv = pn("rpConversions"), spend = pn("rpAdSpend"), rev = pn("rpRevenue");
      var erEl = document.getElementById("rpEngRate"),
          crEl = document.getElementById("rpConversion"),
          cplEl = document.getElementById("rpCpl"),
          roasEl = document.getElementById("rpRoas");

      // Engagement Rate
      if (reach > 0 && eng > 0 && !erEl._userEdited) {
        erEl.value = (eng / reach * 100).toFixed(1);
        document.getElementById("rpEngRateWrap").classList.add("rp-field-auto");
      } else {
        document.getElementById("rpEngRateWrap").classList.remove("rp-field-auto");
      }
      // Conversion Rate
      if (leads > 0 && conv > 0 && !crEl._userEdited) {
        crEl.value = (conv / leads * 100).toFixed(1);
        document.getElementById("rpConvRateWrap").classList.add("rp-field-auto");
      } else {
        document.getElementById("rpConvRateWrap").classList.remove("rp-field-auto");
      }
      // CPL
      if (spend > 0 && leads > 0 && !cplEl._userEdited) {
        cplEl.value = (spend / leads).toFixed(2);
        document.getElementById("rpCplWrap").classList.add("rp-field-auto");
      } else {
        document.getElementById("rpCplWrap").classList.remove("rp-field-auto");
      }
      // ROAS
      if (rev > 0 && spend > 0 && !roasEl._userEdited) {
        roasEl.value = (rev / spend).toFixed(1);
        document.getElementById("rpRoasWrap").classList.add("rp-field-auto");
      } else {
        document.getElementById("rpRoasWrap").classList.remove("rp-field-auto");
      }
    }

    // Mark derived fields as user-edited if manually changed
    ["rpEngRate", "rpConversion", "rpCpl", "rpRoas"].forEach(function(id) {
      var el = document.getElementById(id);
      el._userEdited = !!el.value;
      el.addEventListener("input", function() { el._userEdited = !!el.value; autoCalc(); });
    });
    ["rpReach", "rpImpressions", "rpEngagement", "rpLeads", "rpConversions", "rpAdSpend", "rpRevenue"].forEach(function(id) {
      document.getElementById(id).addEventListener("input", autoCalc);
    });
    autoCalc();

    document.getElementById("rpSaveBtn").addEventListener("click", function () {
      var btn = this;
      var errEl = document.getElementById("rpFormError");
      var clientId = rp ? rp.clientId : document.getElementById("rpClient").value;
      var period = document.getElementById("rpPeriod").value.trim();
      if (!clientId) { errEl.textContent = t("Please choose a client."); return; }
      if (!period) { errEl.textContent = t("Please enter a period, e.g. \\"August 2026\\"."); return; }
      var payload = {
        clientId: clientId,
        period: period,
        campaign: document.getElementById("rpCampaign").value.trim(),
        channel: document.getElementById("rpChannel").value,
        serviceType: document.getElementById("rpServiceType").value,
        status: document.getElementById("rpStatus").value,
        visibility: document.getElementById("rpVisibility").value,
        notifyClient: document.getElementById("rpNotifyClient").checked,
        metrics: {
          reach: pnNull("rpReach"),
          impressions: pnNull("rpImpressions"),
          engagement: pnNull("rpEngagement"),
          engagementRate: pnNull("rpEngRate"),
          leads: pnNull("rpLeads"),
          conversions: pnNull("rpConversions"),
          conversionRate: pnNull("rpConversion"),
          adSpend: pnNull("rpAdSpend"),
          revenue: pnNull("rpRevenue"),
          cpl: pnNull("rpCpl"),
          roas: pnNull("rpRoas")
        }
      };
      setButtonLoading(btn, true, t("Generating…"));
      var req = rp ? api.reports.update(rp.id, payload) : api.reports.create(payload);
      req.then(function (r) {
        // Show validation warnings if any
        if (r.validation && (r.validation.warnings.length > 0 || r.validation.errors.length > 0)) {
          var valHtml = "<div class=\\"rp-validation\\">";
          r.validation.errors.forEach(function(v) { valHtml += "<div class=\\"rp-val-item rp-val-error\\"><span class=\\"rp-val-icon\\">⛔</span>" + esc(v.message) + "</div>"; });
          r.validation.warnings.forEach(function(v) { valHtml += "<div class=\\"rp-val-item rp-val-warning\\"><span class=\\"rp-val-icon\\">⚠️</span>" + esc(v.message) + "</div>"; });
          document.getElementById("rpValidation").innerHTML = valHtml + "</div>";
        }
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

// Helper: parse number from input, 0 if empty
function pn(id) { return Number(document.getElementById(id).value) || 0; }
// Helper: parse number from input, null if empty
function pnNull(id) { var v = document.getElementById(id).value; return v === "" ? null : (Number(v) || null); }
// Helper: format value for input (null/0 → empty string)
function fv(v) { return (v === null || v === undefined || v === 0) ? "" : String(v); }

function reportDeleteConfirm(reportId) {
  var rp = (_reportsCache || []).filter(function (x) { return x.id === reportId; })[0];
  if (!rp) return;
  if (rp.status === "Published") { errorToast(new Error(t("Published reports cannot be deleted — edit it instead if the numbers were wrong."))); return; }
  var body = "<p>" + esc(t("Delete this draft report? This cannot be undone.")) + "</p>";
  var foot = "<button class=\\"btn btn-sm\\" data-close-modal=\\"1\\">" + esc(t("Cancel")) + "</button>" +
    "<button class=\\"btn btn-primary btn-sm\\" id=\\"rpDeleteConfirmBtn\\" style=\\"background:var(--rose);border-color:var(--rose);\\">" + esc(t("Delete")) + "</button>";
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

function reportViewModal(reportId) {
  var rp = (_reportsCache || []).concat(window._reportsCacheClient || []).filter(function (x) { return x.id === reportId; })[0];
  if (!rp) { errorToast(new Error("Report not found.")); return; }
  var isAdmin = state.view === "admin";
  (isAdmin ? api.clients.list() : Promise.resolve({ clients: [] })).then(function (res) {
    var c = res.clients.filter(function (x) { return x.id === rp.clientId; })[0];
    var m = rp.metrics || {};
    var mom = rp.momChanges || {};
    var isBaseline = (rp.comparisonStatus || "Baseline") === "Baseline";
    var dq = rp.dataQuality || "Verified";

    // ---- HEADER ----
    var body = "<div class=\\"rp-header\\">" +
      "<h2>" + esc(t("Performance Report")) + " — " + esc(rp.period) + "</h2>" +
      "<div class=\\"rp-header-meta\\">" +
      (isAdmin && c ? "<span>" + esc(c.name) + "</span> · " : "") +
      "<span class=\\"status-badge \\" + healthClass(rp.status) + \\"\\">" + esc(t(rp.status)) + "</span>" +
      " <span class=\\"rp-comparison-badge \\" + (isBaseline ? "rp-comparison-baseline" : "rp-comparison-comparison") + \\"\\">" +
      (isBaseline ? "📊 " + esc(t("Baseline Period")) : "🔄 " + esc(t("Comparison"))) + "</span>" +
      (rp.visibility === "Internal" ? " <span class=\\"cell-sub\\">🔒 " + esc(t("Not visible to client")) + "</span>" : "") +
      "</div>" +
      (isAdmin ? "<p class=\\"cell-sub\\" style=\\"margin-top:6px;\\">" + esc(t("Entered by")) + " " + esc(rp.enteredBy || "WITRA Team") +
        (rp.createdAt ? " · " + esc(rp.createdAt) : "") +
        (rp.version > 1 ? " · " + esc(t("Version")) + " " + rp.version : "") +
        "</p>" : "") +
      "</div>";

    // ---- DATA QUALITY BADGE ----
    var dqClass = dq === "Verified" ? "rp-dq-verified" : (dq === "Minor Warnings" ? "rp-dq-minor" : "rp-dq-review");
    var dqIcon = dq === "Verified" ? "✓" : (dq === "Minor Warnings" ? "⚠️" : "⛔");
    body += "<div class=\\"rp-section\\"><div class=\\"rp-section-title\\">" + esc(t("Data Quality")) + "</div>" +
      "<span class=\\"rp-dq-badge \\" + dqClass + \\"\\">" + dqIcon + " " + esc(t(dq)) + "</span>";
    if (rp.anomalies && rp.anomalies.length > 0) {
      body += "<div style=\\"margin-top:8px;\\">";
      rp.anomalies.forEach(function(a) { body += "<div class=\\"rp-val-item rp-val-warning\\" style=\\"margin-top:4px;\\"><span class=\\"rp-val-icon\\">⚠️</span>" + esc(a) + "</div>"; });
      body += "</div>";
    }
    body += "</div>";

    // ---- KPI OVERVIEW GRID ----
    body += "<div class=\\"rp-section\\"><div class=\\"rp-section-title\\">" + esc(t("KPI Overview")) + "</div><div class=\\"rp-kpi-grid\\">";
    var kpis = [
      { key: "reach", label: t("Reach"), val: m.reach, fmt: fmtKpi },
      { key: "impressions", label: t("Impressions"), val: m.impressions, fmt: fmtKpi },
      { key: "engagement", label: t("Engagement"), val: m.engagement, fmt: fmtKpi },
      { key: "engagementRate", label: t("Engagement Rate"), val: m.engagementRate, fmt: function(v) { return v != null ? (Math.round(v*10)/10) + "%" : "N/A"; } },
      { key: "leads", label: t("Leads Generated"), val: m.leads, fmt: fmtKpi },
      { key: "conversions", label: t("Conversions"), val: m.conversions, fmt: fmtKpi },
      { key: "conversionRate", label: t("Conversion Rate"), val: m.conversionRate, fmt: function(v) { return v != null ? (Math.round(v*10)/10) + "%" : "N/A"; } },
      { key: "cpl", label: t("Cost per Lead"), val: m.cpl, fmt: function(v) { return v != null && v > 0 ? "EGP " + Math.round(v).toLocaleString() : "N/A"; } },
      { key: "adSpend", label: t("Ad Spend"), val: m.adSpend, fmt: function(v) { return v != null ? "EGP " + Math.round(v).toLocaleString() : "N/A"; } },
      { key: "revenue", label: t("Revenue"), val: m.revenue, fmt: function(v) { return v != null ? "EGP " + Math.round(v).toLocaleString() : "N/A"; } },
      { key: "roas", label: "ROAS", val: m.roas, fmt: function(v) { return v != null && v > 0 ? (v === Math.floor(v) ? v + "x" : (Math.round(v*10)/10) + "x") : "N/A"; } }
    ];
    kpis.forEach(function(k) {
      var isNA = k.val == null || (k.key !== "conversionRate" && k.key !== "engagementRate" && k.val === 0 && ["cpl","roas","adSpend","revenue","impressions","conversions"].indexOf(k.key) >= 0);
      var momData = mom[k.key];
      var deltaHtml = "";
      if (isBaseline) {
        deltaHtml = "<div class=\\"rp-kpi-delta baseline\\">" + esc(t("Baseline")) + "</div>";
      } else if (momData && momData.change != null) {
        var dir = momData.direction === "up" ? "up" : (momData.direction === "down" ? "down" : "flat");
        var arrow = dir === "up" ? "↑" : (dir === "down" ? "↓" : "—");
        deltaHtml = "<div class=\\"rp-kpi-delta \\" + dir + \\"\\">" + arrow + " " + Math.abs(momData.change) + "% " + esc(t("vs previous period")) + "</div>";
      }
      body += "<div class=\\"rp-kpi-card\\" + (isNA ? " rp-kpi-na" : "") + \\">" +
        "<div class=\\"rp-kpi-lbl\\">" + esc(k.label) + "</div>" +
        "<div class=\\"rp-kpi-val\\">" + esc(isNA ? "N/A" : k.fmt(k.val)) + "</div>" +
        deltaHtml + "</div>";
    });
    body += "</div></div>";

    // ---- EXECUTIVE SUMMARY ----
    body += "<div class=\\"rp-section\\"><div class=\\"rp-section-title\\">" + esc(t("Executive Summary")) + "</div>" +
      "<div class=\\"rp-section-content\\"><p>" + esc(rp.summary) + "</p></div></div>";

    // ---- KEY INSIGHTS ----
    body += "<div class=\\"rp-section\\"><div class=\\"rp-section-title\\">" + esc(t("Key Insights")) + "</div>";
    // What Worked
    var worked = rp.whatWorked || [];
    body += "<h4 style=\\"font-size:13px;font-weight:700;margin:0 0 8px;color:var(--green);\\">✓ " + esc(t("What Worked")) + "</h4>";
    body += "<ul class=\\"rp-section-list\\">";
    worked.forEach(function(w) { body += "<li><span class=\\"bullet bullet-green\\"></span><span>" + esc(w) + "</span></li>"; });
    body += "</ul>";
    // What Needs Attention
    var attention = rp.whatNeedsAttention || rp.whatDidnt || [];
    body += "<h4 style=\\"font-size:13px;font-weight:700;margin:14px 0 8px;color:var(--amber);\\">⚠️ " + esc(t("What Needs Attention")) + "</h4>";
    body += "<ul class=\\"rp-section-list\\">";
    attention.forEach(function(w) { body += "<li><span class=\\"bullet bullet-amber\\"></span><span>" + esc(w) + "</span></li>"; });
    body += "</ul></div>";

    // ---- RECOMMENDATIONS ----
    var recs = rp.recommendations || [];
    body += "<div class=\\"rp-section\\"><div class=\\"rp-section-title\\">" + esc(t("Recommendations")) + "</div>" +
      "<ul class=\\"rp-section-list\\">";
    recs.forEach(function(r, i) { body += "<li><span class=\\"bullet bullet-accent\\"></span><span>" + esc(r) + "</span></li>"; });
    body += "</ul></div>";

    // ---- NEXT MONTH STRATEGY ----
    var strat = rp.nextMonthStrategy || {};
    body += "<div class=\\"rp-section\\"><div class=\\"rp-section-title\\">" + esc(t("Next Month Strategy")) + "</div>" +
      "<div class=\\"rp-strategy\\">";
    if (strat.primaryObjective) {
      body += "<h4>" + esc(t("Primary Objective")) + "</h4><p style=\\"font-size:13px;margin:0 0 10px;\\">" + esc(strat.primaryObjective) + "</p>";
    }
    if (strat.priorityActions && strat.priorityActions.length) {
      body += "<div class=\\"rp-strategy-label\\">" + esc(t("Priority Actions")) + "</div><ol>";
      strat.priorityActions.forEach(function(a) { body += "<li>" + esc(a) + "</li>"; });
      body += "</ol>";
    }
    if (strat.metricsToMonitor && strat.metricsToMonitor.length) {
      body += "<div class=\\"rp-strategy-label\\">" + esc(t("Metrics to Monitor")) + "</div><div class=\\"rp-strategy-tags\\">";
      strat.metricsToMonitor.forEach(function(m) { body += "<span class=\\"rp-strategy-tag\\">" + esc(m) + "</span>"; });
      body += "</div>";
    }
    if (strat.suggestedFocus && strat.suggestedFocus.length) {
      body += "<div class=\\"rp-strategy-label\\">" + esc(t("Suggested Focus")) + "</div><div class=\\"rp-strategy-tags\\">";
      strat.suggestedFocus.forEach(function(f) { body += "<span class=\\"rp-strategy-tag\\">" + esc(f) + "</span>"; });
      body += "</div>";
    }
    if (!strat.primaryObjective && rp.nextMonth) {
      body += "<p style=\\"font-size:13px;margin:0;\\">" + esc(rp.nextMonth) + "</p>";
    }
    body += "</div></div>";

    // ---- VERSION INFO ----
    if (rp.version > 1 || rp.publishedAt) {
      body += "<div class=\\"rp-version-info\\">";
      if (rp.publishedAt) body += esc(t("Published on")) + " " + esc(rp.publishedAt.slice(0, 10));
      if (rp.version > 1) body += " · " + esc(t("Version")) + " " + rp.version;
      body += "</div>";
    }

    // ---- FOOTER ACTIONS ----
    var foot = "";
    if (isAdmin) {
      foot = "<button class=\\"btn btn-sm\\" data-close-modal=\\"1\\">" + esc(t("Close")) + "</button>" +
        "<button class=\\"btn btn-sm\\" id=\\"rpPrintBtn\\">🖨️ " + esc(t("Print")) + "</button>" +
        "<button class=\\"btn btn-primary btn-sm\\" id=\\"rpViewEditBtn\\">" + esc(t("Edit")) + "</button>";
      if (rp.status === "Draft") {
        foot += "<button class=\\"btn btn-primary btn-sm\\" id=\\"rpPublishBtn\\" style=\\"background:var(--green);border-color:var(--green);\\">" + esc(t("Publish")) + "</button>";
      }
      if (rp.status !== "Archived") {
        foot += "<button class=\\"btn btn-sm\\" id=\\"rpArchiveBtn\\">" + esc(t("Archive")) + "</button>";
      }
    } else {
      foot = "<button class=\\"btn btn-sm\\" id=\\"rpPrintBtn\\">🖨️ " + esc(t("Print")) + "</button>" +
        "<button class=\\"btn btn-primary btn-sm\\" data-close-modal=\\"1\\">" + esc(t("Close")) + "</button>";
    }
    openModal(t("Performance Report") + " — " + rp.period, body, foot, "rp-modal-report");

    // Wire up buttons
    var editBtn = document.getElementById("rpViewEditBtn");
    if (editBtn) editBtn.addEventListener("click", function () { closeModal(); reportFormModal(rp.id); });
    var printBtn = document.getElementById("rpPrintBtn");
    if (printBtn) printBtn.addEventListener("click", function() { window.print(); });
    var publishBtn = document.getElementById("rpPublishBtn");
    if (publishBtn) publishBtn.addEventListener("click", function() {
      var btn = this;
      setButtonLoading(btn, true, t("Generating…"));
      api.reports.update(rp.id, { status: "Published", visibility: "Client", notifyClient: true }).then(function(r) {
        closeModal();
        renderAdminSection();
        toast(t("Report updated"), "success");
        if (r && r.report) { _reportsCache = _reportsCache.filter(function(x) { return x.id !== r.report.id; }).concat([r.report]); }
      }).catch(function(err) { setButtonLoading(btn, false); errorToast(err); });
    });
    var archiveBtn = document.getElementById("rpArchiveBtn");
    if (archiveBtn) archiveBtn.addEventListener("click", function() {
      api.reports.update(rp.id, { status: "Archived" }).then(function() {
        closeModal(); renderAdminSection(); toast(t("Report updated"), "success");
      }).catch(errorToast);
    });
  }).catch(errorToast);
}
`;

content = content.substring(0, startIdx) + replacementCode + "\n" + content.substring(endIdx);
fs.writeFileSync("public/static/app.js", content, "utf8");
console.log("Successfully patched app.js");
