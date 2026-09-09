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
    var body = "<div class='rp-header'>" +
      "<h2>" + esc(t("Performance Report")) + " — " + esc(rp.period) + "</h2>" +
      "<div class='rp-header-meta'>" +
      (isAdmin && c ? "<span>" + esc(c.name) + "</span> · " : "") +
      "<span class='status-badge " + healthClass(rp.status) + "'>" + esc(t(rp.status)) + "</span>" +
      " <span class='rp-comparison-badge " + (isBaseline ? "rp-comparison-baseline" : "rp-comparison-comparison") + "'>" +
      (isBaseline ? "📊 " + esc(t("Baseline Period")) : "🔄 " + esc(t("Comparison"))) + "</span>" +
      (rp.visibility === "Internal" ? " <span class='cell-sub'>🔒 " + esc(t("Not visible to client")) + "</span>" : "") +
      "</div>" +
      (isAdmin ? "<p class='cell-sub' style='margin-top:6px;'>" + esc(t("Entered by")) + " " + esc(rp.enteredBy || "WITRA Team") +
        (rp.createdAt ? " · " + esc(rp.createdAt) : "") +
        (rp.version > 1 ? " · " + esc(t("Version")) + " " + rp.version : "") +
        "</p>" : "") +
      "</div>";

    // ---- DATA QUALITY BADGE ----
    if (dq !== "Verified") {
      var dqt = dq === "Partial" ? "⚠️ Partial Data (Missing integrations)" : "❌ Unverified Data";
      body += "<div class='rp-dq-warning " + (dq === "Partial" ? "warning" : "error") + "'>" + esc(dqt) + "</div>";
    }

    // ---- KPIS GRID ----
    body += "<div class='rp-section'><div class='rp-section-title'>" + esc(t("Performance Metrics")) + "</div>" +
      "<div class='rp-kpi-grid'>";
    var kpis = [
      { key: "impressions", label: t("Impressions"), val: m.impressions, fmt: function(v) { return v != null ? Math.round(v).toLocaleString() : "N/A"; } },
      { key: "conversions", label: t("Conversions"), val: m.conversions, fmt: function(v) { return v != null ? Math.round(v).toLocaleString() : "N/A"; } },
      { key: "conversionRate", label: t("Conv. Rate"), val: m.conversionRate, fmt: function(v) { return v != null ? v + "%" : "N/A"; } },
      { key: "engagementRate", label: t("Eng. Rate"), val: m.engagementRate, fmt: function(v) { return v != null ? v + "%" : "N/A"; } },
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
        deltaHtml = "<div class='rp-kpi-delta baseline'>" + esc(t("Baseline")) + "</div>";
      } else if (momData && momData.change != null) {
        var dir = momData.direction === "up" ? "up" : (momData.direction === "down" ? "down" : "flat");
        var arrow = dir === "up" ? "↑" : (dir === "down" ? "↓" : "→");
        deltaHtml = "<div class='rp-kpi-delta " + dir + "'>" + arrow + " " + Math.abs(momData.change) + "% " + esc(t("vs previous period")) + "</div>";
      }
      body += "<div class='rp-kpi-card" + (isNA ? " rp-kpi-na" : "") + "'>" +
        "<div class='rp-kpi-lbl'>" + esc(k.label) + "</div>" +
        "<div class='rp-kpi-val'>" + esc(isNA ? "N/A" : k.fmt(k.val)) + "</div>" +
        deltaHtml + "</div>";
    });
    body += "</div></div>";

    // ---- EXECUTIVE SUMMARY ----
    body += "<div class='rp-section'><div class='rp-section-title'>" + esc(t("Executive Summary")) + "</div>" +
      "<div class='rp-section-content'><p>" + esc(rp.summary) + "</p></div></div>";

    // ---- KEY INSIGHTS ----
    body += "<div class='rp-section'><div class='rp-section-title'>" + esc(t("Key Insights")) + "</div>";
    var worked = rp.whatWorked || [];
    body += "<h4 style='font-size:13px;font-weight:700;margin:0 0 8px;color:var(--green);'>✅ " + esc(t("What Worked")) + "</h4>";
    body += "<ul class='rp-section-list'>";
    worked.forEach(function(w) { body += "<li><span class='bullet bullet-green'></span><span>" + esc(w) + "</span></li>"; });
    body += "</ul>";
    var attention = rp.whatNeedsAttention || rp.whatDidnt || [];
    body += "<h4 style='font-size:13px;font-weight:700;margin:14px 0 8px;color:var(--amber);'>⚠️ " + esc(t("What Needs Attention")) + "</h4>";
    body += "<ul class='rp-section-list'>";
    attention.forEach(function(w) { body += "<li><span class='bullet bullet-amber'></span><span>" + esc(w) + "</span></li>"; });
    body += "</ul></div>";

    // ---- RECOMMENDATIONS ----
    var recs = rp.recommendations || [];
    body += "<div class='rp-section'><div class='rp-section-title'>" + esc(t("Recommendations")) + "</div>" +
      "<ul class='rp-section-list'>";
    recs.forEach(function(r, i) { body += "<li><span class='bullet bullet-accent'></span><span>" + esc(r) + "</span></li>"; });
    body += "</ul></div>";

    // ---- NEXT MONTH STRATEGY ----
    var strat = rp.nextMonthStrategy || {};
    body += "<div class='rp-section'><div class='rp-section-title'>" + esc(t("Next Month Strategy")) + "</div>" +
      "<div class='rp-strategy'>";
    if (strat.primaryObjective) {
      body += "<h4>" + esc(t("Primary Objective")) + "</h4><p style='font-size:13px;margin:0 0 10px;'>" + esc(strat.primaryObjective) + "</p>";
    }
    if (strat.priorityActions && strat.priorityActions.length) {
      body += "<div class='rp-strategy-label'>" + esc(t("Priority Actions")) + "</div><ol>";
      strat.priorityActions.forEach(function(a) { body += "<li>" + esc(a) + "</li>"; });
      body += "</ol>";
    }
    if (strat.metricsToMonitor && strat.metricsToMonitor.length) {
      body += "<div class='rp-strategy-label'>" + esc(t("Metrics to Monitor")) + "</div><div class='rp-strategy-tags'>";
      strat.metricsToMonitor.forEach(function(m) { body += "<span class='rp-strategy-tag'>" + esc(m) + "</span>"; });
      body += "</div>";
    }
    if (strat.suggestedFocus && strat.suggestedFocus.length) {
      body += "<div class='rp-strategy-label'>" + esc(t("Suggested Focus")) + "</div><div class='rp-strategy-tags'>";
      strat.suggestedFocus.forEach(function(f) { body += "<span class='rp-strategy-tag'>" + esc(f) + "</span>"; });
      body += "</div>";
    }
    if (!strat.primaryObjective && rp.nextMonth) {
      body += "<p style='font-size:13px;margin:0;'>" + esc(rp.nextMonth) + "</p>";
    }
    body += "</div></div>";

    // ---- VERSION INFO ----
    if (rp.version > 1 || rp.publishedAt) {
      body += "<div class='rp-version-info'>";
      if (rp.publishedAt) body += esc(t("Published on")) + " " + esc(rp.publishedAt.slice(0, 10));
      if (rp.version > 1) body += " • " + esc(t("Version")) + " " + rp.version;
      body += "</div>";
    }

    // ---- FOOTER ACTIONS ----
    var foot = "";
    if (isAdmin) {
      foot = "<button class='btn btn-sm' data-close-modal='1'>" + esc(t("Close")) + "</button>" +
        "<button class='btn btn-sm' id='rpPrintBtn'>🖨️ " + esc(t("Print")) + "</button>" +
        "<button class='btn btn-primary btn-sm' id='rpViewEditBtn'>" + esc(t("Edit")) + "</button>";
      if (rp.status === "Draft") {
        foot += "<button class='btn btn-primary btn-sm' id='rpPublishBtn' style='background:var(--green);border-color:var(--green);'>" + esc(t("Publish")) + "</button>";
      }
      if (rp.status !== "Archived") {
        foot += "<button class='btn btn-sm' id='rpArchiveBtn'>" + esc(t("Archive")) + "</button>";
      }
    } else {
      foot = "<button class='btn btn-sm' id='rpPrintBtn'>🖨️ " + esc(t("Print")) + "</button>" +
        "<button class='btn btn-primary btn-sm' data-close-modal='1'>" + esc(t("Close")) + "</button>";
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
