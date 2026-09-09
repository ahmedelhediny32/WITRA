const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// 1. Add translations
const translations = `
    "Active": "مشترك",
    "Expired": "اشتراكه خالص",
    "Renewed": "تجديد",
    "Cancelled": "اتلغي",
`;
appJs = appJs.replace('"Trial": "تجربة",', translations);

// 2. Add listener inside bindContentDelegation
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

if (!appJs.includes('data-edit-billing-status"])){')) {
  appJs = appJs.replace(target, listener + '\n    ' + target);
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log('App.js patched successfully');
