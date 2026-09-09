const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// 1. Add the helper function
const helperFn = `
function inlineBillingStatusSelect(c) {
  return '<select data-inline-billing-status="' + c.id + '" class="status-badge ' + healthClass(c.billingStatus) + '" style="border:none; outline:none; cursor:pointer; appearance:menulist; padding-right:4px; font-family:inherit; font-weight:600; font-size:12px;">' +
    '<option value="Active"' + (c.billingStatus === 'Active' ? ' selected' : '') + '>' + esc(t("Active")) + '</option>' +
    '<option value="Renewed"' + (c.billingStatus === 'Renewed' ? ' selected' : '') + '>' + esc(t("Renewed")) + '</option>' +
    '<option value="Expired"' + (c.billingStatus === 'Expired' ? ' selected' : '') + '>' + esc(t("Expired")) + '</option>' +
    '<option value="Cancelled"' + (c.billingStatus === 'Cancelled' ? ' selected' : '') + '>' + esc(t("Cancelled")) + '</option>' +
  '</select>';
}
`;

if (!appJs.includes('inlineBillingStatusSelect')) {
  appJs = appJs.replace('function healthClass', helperFn + '\nfunction healthClass');
}

// 2. Replace the UI in Client Subscriptions table
const tableTarget = `'<td><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span></td>' +`;
const tableReplacement = `'<td>' + inlineBillingStatusSelect(c) + '</td>' +`;
if (appJs.includes(tableTarget)) {
  appJs = appJs.replace(tableTarget, tableReplacement);
  console.log("Patched table row.");
} else {
  console.log("Could not find table target string!");
}

// 3. Replace the UI in Client Profile (line ~1622)
// Old: '<div><div class="cell-sub">' + esc(t("Billing Status")) + '</div><div><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span></div></div>' +
const profileTarget = `'<div><div class="cell-sub">' + esc(t("Billing Status")) + '</div><div><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span></div></div>' +`;
const profileReplacement = `'<div><div class="cell-sub">' + esc(t("Billing Status")) + '</div><div>' + inlineBillingStatusSelect(c) + '</div></div>' +`;
if (appJs.includes(profileTarget)) {
  appJs = appJs.replace(profileTarget, profileReplacement);
  console.log("Patched profile.");
} else {
  console.log("Could not find profile target string!");
}

// 4. Add the change event listener to the global change listener
const globalChangeTarget = `  document.addEventListener("change", function (e) {
    if (e.target.matches("[data-upload-logo]")) {`;
    
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

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Done patching.");
