const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// 1. Add the helper function
const helperFn = `
function inlineBillingStatusSelect(c) {
  return '<select data-inline-billing-status="' + c.id + '" class="status-badge ' + healthClass(c.billingStatus) + '" style="border:none; outline:none; cursor:pointer; appearance:menulist; padding-right:4px; font-family:inherit; background-color:transparent;">' +
    '<option value="Active"' + (c.billingStatus === 'Active' ? ' selected' : '') + '>' + esc(t("Active")) + '</option>' +
    '<option value="Renewed"' + (c.billingStatus === 'Renewed' ? ' selected' : '') + '>' + esc(t("Renewed")) + '</option>' +
    '<option value="Expired"' + (c.billingStatus === 'Expired' ? ' selected' : '') + '>' + esc(t("Expired")) + '</option>' +
    '<option value="Cancelled"' + (c.billingStatus === 'Cancelled' ? ' selected' : '') + '>' + esc(t("Cancelled")) + '</option>' +
  '</select>';
}
`;

// Insert the helper function right before function healthClass
appJs = appJs.replace('function healthClass', helperFn + '\nfunction healthClass');


// 2. Replace the UI in Client Subscriptions table (line ~1682)
// Old: '<td><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span></td>' +
//      '<td class="mono">' + esc(c.renewal) + '</td><td class="mono">EGP ' + fmtMoney(c.mrr) + '</td>' +
//      '<td><button class="btn btn-sm" data-edit-billing-status="' + c.id + '" data-current-status="' + esc(c.billingStatus) + '">' + esc(t("Edit")) + '</button></td></tr>';
const tableOld = `'<td><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span></td>' +\\s*'<td class="mono">' + esc(c.renewal) + '</td><td class="mono">EGP ' + fmtMoney(c.mrr) + '</td>' +\\s*'<td><button class="btn btn-sm" data-edit-billing-status="' + c.id + '" data-current-status="' + esc(c.billingStatus) + '">' + esc(t("Edit")) + '</button></td></tr>'`;
const tableNew = `'<td>' + inlineBillingStatusSelect(c) + '</td>' +\n          '<td class="mono">' + esc(c.renewal) + '</td><td class="mono">EGP ' + fmtMoney(c.mrr) + '</td></tr>'`;
appJs = appJs.replace(new RegExp(tableOld, 'g'), tableNew);
// Note: need to remove the <th></th> header for the edit button
appJs = appJs.replace(`+ esc(t("MRR")) + '</th><th></th></tr></thead>`, `+ esc(t("MRR")) + '</th></tr></thead>`);


// 3. Replace the UI in Client Profile (line ~1622)
// Old: '<div><div class="cell-sub">' + esc(t("Billing Status")) + '</div><div><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span> <button class="btn btn-sm" style="margin-right:8px;" data-edit-billing-status="' + c.id + '" data-current-status="' + esc(c.billingStatus) + '">' + esc(t("Edit")) + '</button></div></div>' +
const profileOld = `'<div><div class="cell-sub">' + esc(t("Billing Status")) + '</div><div><span class="status-badge ' + healthClass(c.billingStatus) + '">' + esc(t(c.billingStatus)) + '</span> <button class="btn btn-sm" style="margin-right:8px;" data-edit-billing-status="' + c.id + '" data-current-status="' + esc(c.billingStatus) + '">' + esc(t("Edit")) + '</button></div></div>' +`;
const profileNew = `'<div><div class="cell-sub">' + esc(t("Billing Status")) + '</div><div>' + inlineBillingStatusSelect(c) + '</div></div>' +`;
appJs = appJs.replace(profileOld, profileNew);


// 4. Add the change event listener to the global change listener
const globalChangeOld = `  document.addEventListener("change", function (e) {
    if (e.target.matches("[data-upload-logo]")) {`;
    
const globalChangeNew = `  document.addEventListener("change", function (e) {
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
appJs = appJs.replace(globalChangeOld, globalChangeNew);

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Replaced side edit buttons with inline dropdowns.");
