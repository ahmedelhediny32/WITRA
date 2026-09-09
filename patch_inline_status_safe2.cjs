const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

const globalChangeTarget = '  document.addEventListener("change", function (e) {\n    if (e.target.matches("[data-upload-logo]")) {';
const globalChangeReplacement = `  document.addEventListener("change", function (e) {
    var bsTarget;
    if (bsTarget = e.target.closest("[data-inline-billing-status]")) {
      var id = bsTarget.getAttribute("data-inline-billing-status");
      var newVal = bsTarget.value;
      bsTarget.disabled = true;
      apiFetch("/api/clients/" + id + "/billing-status", {
        method: "PUT",
        body: JSON.stringify({ status: newVal })
      }).then(function() {
        toast(t("Status updated"), "success");
        CACHE.clients = null;
        var content = document.getElementById("adminContent") || document.getElementById("content");
        if (state.viewingClientId) {
          renderAdminClientProfile(content);
        } else {
          renderAdminSubscriptions(content);
        }
      }).catch(function(err) {
        bsTarget.disabled = false;
        errorToast(err);
      });
      return;
    }

    if (e.target.matches("[data-upload-logo]")) {`;

if (appJs.includes(globalChangeTarget)) {
  appJs = appJs.replace(globalChangeTarget, globalChangeReplacement);
  console.log("Patched global change listener.");
} else {
  console.log("Could not find global change target!");
}

// Ensure the side edit button is GONE from both subscriptions and profile since dist might have had it dynamically created
appJs = appJs.replace(/'<td><button class="btn btn-sm" data-edit-billing-status="' \+ c.id \+ '" data-current-status="' \+ esc\(c.billingStatus\) \+ '">' \+ esc\(t\("Edit"\)\) \+ '<\/button><\/td><\/tr>';/g, "</tr>';");

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
