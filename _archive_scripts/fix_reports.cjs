const fs = require('fs');
let code = fs.readFileSync('public/static/app.js', 'utf8');
code = code.replace(
  /if \(_reportsCache\.length === 0\) \{\s+container\.innerHTML = html \+ emptyState\([^;]+;\s+return;\s+\}/,
  `if (_reportsCache.length === 0) {
        container.innerHTML = html + '<div style="text-align:right; margin-bottom: 16px;"><button class="btn btn-primary btn-sm" id="addReportBtnEmpty">+ ' + esc(t("New Report")) + '</button></div>' + emptyState("📊", t("No reports yet"), t("Reports will appear here once published for any client."));
        document.getElementById("addReportBtnEmpty").addEventListener("click", function () { reportFormModal(null, null); });
        return;
      }`
);
fs.writeFileSync('public/static/app.js', code);
