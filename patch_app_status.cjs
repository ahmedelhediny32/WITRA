const fs = require('fs');
let code = fs.readFileSync('public/static/app.js', 'utf8');

// 1. Notifications logic
code = code.replace(
  /'<div class="notif-panel-head">Notifications <span id="markAllReadBtn">Mark all read<\/span><\/div>' \+/,
  '\'<div class="notif-panel-head">Notifications</div>\' +'
);

code = code.replace(
`    if (el = e.target.closest("#bellBtn")) {
      e.stopPropagation();
      var existingPanel = document.getElementById("notifPanel");
      if (existingPanel) { existingPanel.remove(); return; }
      notifApiForView().list().then(function (res) {
        var wrap = document.getElementById("notifWrap");
        if (wrap) wrap.insertAdjacentHTML("beforeend", notifPanelHtml(res.notifications));
        if (res.notifications.some(function(n) { return !n.read; })) {
          notifApiForView().markAllRead().then(function() {
            var slot = document.getElementById("bellDotSlot");
            if (slot) slot.innerHTML = '';
          }).catch(function(){});
        }
      }).catch(errorToast);
      return;
    }`,
`    if (el = e.target.closest("#bellBtn")) {
      e.stopPropagation();
      var existingPanel = document.getElementById("notifPanel");
      if (existingPanel) { existingPanel.remove(); return; }
      notifApiForView().list().then(function (res) {
        var wrap = document.getElementById("notifWrap");
        var unreadNotifs = res.notifications.filter(function(n) { return !n.read; });
        var hasUnread = unreadNotifs.length > 0;
        unreadNotifs.forEach(function(n) { n.read = true; });
        if (wrap) wrap.insertAdjacentHTML("beforeend", notifPanelHtml(unreadNotifs));
        if (hasUnread) {
          notifApiForView().markAllRead().then(function() {
            var slot = document.getElementById("bellDotSlot");
            if (slot) slot.innerHTML = '';
          }).catch(function(){});
        }
      }).catch(errorToast);
      return;
    }`
);

// 2. Billing Status UI (this was from the recent request)
code = code.replace(
  'saveNotes: function (id, notes) { return apiFetch("/api/clients/" + id + "/notes", { method: "PUT", body: { notes: notes } }); },\n    exportCsvUrl:',
  'saveNotes: function (id, notes) { return apiFetch("/api/clients/" + id + "/notes", { method: "PUT", body: { notes: notes } }); },\n    updateBillingStatus: function (id, status) { return apiFetch("/api/clients/" + id + "/billing-status", { method: "PUT", body: { status: status } }); },\n    exportCsvUrl:'
);

code = code.replace(
  /'<td><span class="status-badge ' \+ healthClass\(c.billingStatus\) \+ '">'\ \+ esc\(c.billingStatus\) \+ '<\/span><\/td>' \+/,
  '\'<td><span class="status-badge \' + healthClass(c.billingStatus) + \'" data-edit-billing-status="\' + c.id + \'" data-current-status="\' + esc(c.billingStatus) + \'" style="cursor:pointer;" title="\' + esc(t("Click to change status")) + \'">\' + esc(c.billingStatus) + \' <span style="font-size:10px; opacity:0.7;">✎</span></span></td>\' +'
);

code = code.replace(
  '    if (el = e.target.closest("[data-edit-plan]")) { editPlanModal(el.getAttribute("data-edit-plan")); return; }\n\n    if (el = e.target.closest("[data-toggle-witra-invite]"))',
  '    if (el = e.target.closest("[data-edit-plan]")) { editPlanModal(el.getAttribute("data-edit-plan")); return; }\n    if (el = e.target.closest("[data-edit-billing-status]")) { e.stopPropagation(); editBillingStatusModal(el.getAttribute("data-edit-billing-status"), el.getAttribute("data-current-status")); return; }\n\n    if (el = e.target.closest("[data-toggle-witra-invite]"))'
);

code = code.replace(
`      api.plans.update(p.id, { name: name, price: price, entitlements: entitlements }).then(function () {
        invalidateCache(["plans"]);
        closeModal();
        renderAdminSection();
        toast("Plan updated", "success");
      }).catch(function (err) {
        setButtonLoading(btn, false);
        document.getElementById("planFormError").textContent = err.message;
      });
    });
  }).catch(errorToast);
}`,
`      api.plans.update(p.id, { name: name, price: price, entitlements: entitlements }).then(function () {
        invalidateCache(["plans"]);
        closeModal();
        renderAdminSection();
        toast("Plan updated", "success");
      }).catch(function (err) {
        setButtonLoading(btn, false);
        document.getElementById("planFormError").textContent = err.message;
      });
    });
  }).catch(errorToast);
}

function editBillingStatusModal(clientId, currentStatus) {
  var body = '<div class="form-grid">' +
    '<div class="form-field"><label>Billing Status</label>' +
    '<select id="billingStatusSelect" class="form-select">' +
    '<option value="Active"' + (currentStatus === "Active" ? ' selected' : '') + '>Active</option>' +
    '<option value="Suspended"' + (currentStatus === "Suspended" ? ' selected' : '') + '>Suspended</option>' +
    '<option value="Cancelled"' + (currentStatus === "Cancelled" ? ' selected' : '') + '>Cancelled</option>' +
    '</select></div></div>';
  var foot = '<button class="btn btn-sm" data-close-modal="1">Cancel</button>' +
    '<button class="btn btn-primary btn-sm" id="saveBillingStatusBtn">Save Status</button>';
  openModal("Edit Billing Status", body, foot);
  document.getElementById("saveBillingStatusBtn").addEventListener("click", function () {
    var newStatus = document.getElementById("billingStatusSelect").value;
    var btn = this; 
    setButtonLoading(btn, true);
    api.clients.updateBillingStatus(clientId, newStatus).then(function () {
      closeModal();
      toast("Billing status updated to " + newStatus);
      renderAdminSubscriptions(document.getElementById("mainContent"));
    }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });
  });
}`
);

fs.writeFileSync('public/static/app.js', code, 'utf8');
console.log('Patched');
