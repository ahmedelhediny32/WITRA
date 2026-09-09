const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'static', 'app.js');
let content = fs.readFileSync(filePath, 'utf8');

// ─── FIX 1: Restore renderClientSubscription body ───
// The function is broken: right after the signature there's no body.
// Find the actual broken renderClientSubscription function definition
const subDefIdx = content.indexOf('function renderClientSubscription(container) {');
if (subDefIdx >= 0) {
  // Find the text right after the opening brace
  const afterBrace = subDefIdx + 'function renderClientSubscription(container) {'.length;
  // Check what comes next (the function should have its body)
  const nextChars = content.substring(afterBrace, afterBrace + 100);
  console.log('After renderClientSubscription: "' + nextChars.substring(0,80) + '"');
  
  if (nextChars.includes('if (nextPlan)')) {
    // Body is partially there - need to insert the missing beginning
    const insertPoint = afterBrace;
    const missingPart = `\r\n  Promise.all([api.portal.client(), getPlans(), getEntitlements()]).then(function (r) {\r\n    var c = r[0].client, plans = r[1], entLabels = r[2];\r\n    var plan = plans.filter(function (p) { return p.id === c.planId; })[0];\r\n    if (!plan) { container.innerHTML = errorState(new Error("Plan not found.")); return; }\r\n    var planIdx = plans.indexOf(plan);\r\n    var nextPlan = plans[planIdx + 1];\r\n\r\n    var html = '<div class="current-plan-hero"><div class="row"><div><div class="eyebrow">Current Plan</div><div class="name">' + esc(plan.name) + '</div><div class="price">EGP ' + esc(plan.price) + ' / ' + esc(plan.cycle) + ' \\u00b7 ' + esc(t("renews")) + ' ' + esc(c.renewal) + '</div></div>' +\r\n      '<div><span class="status-badge ' + healthClass(c.billingStatus) + '" style="background:rgba(255,255,255,0.2);color:#fff;">' + esc(t(c.billingStatus)) + '</span></div></div></div>';\r\n\r\n    html += '<div class="section-title">' + esc(t("Included Services")) + '</div><div class="panel-card"><ul style="list-style:none;padding:0;margin:0;">' +\r\n      entLabels.filter(function (e) { return plan.entitlements.indexOf(e.key) !== -1; })\r\n        .map(function (e) { return '<li style="padding:6px 0;">\\u2713 ' + esc(trF(e.label, e.labelAr)) + '</li>'; }).join('') + '</ul></div>';\r\n`;
    
    // Remove the blank line + "    " before "if (nextPlan)"
    // Find exactly what needs to be replaced between the opening brace and "if (nextPlan)"
    const nextPlanIdx = content.indexOf('if (nextPlan) {', afterBrace);
    if (nextPlanIdx >= 0) {
      content = content.substring(0, afterBrace) + missingPart + '\r\n    ' + content.substring(nextPlanIdx);
      console.log('FIX 1: Restored renderClientSubscription body');
    }
  } else {
    console.log('SKIP 1: renderClientSubscription body seems OK or different pattern');
  }
}

// ─── FIX 2: Fix broken end of renderClientTeam + add new functions ───
// The line with requestedDate is truncated, jumping directly into _delegationBound
const breakPoint = "esc(rq.requestedDate) + '</td>' +\r\nvar _delegationBound";
if (content.includes(breakPoint)) {
  const fixedTeamEnd = `esc(rq.requestedDate) + '</td>' +\r\n            '<td><span class="status-badge ' + healthClass(rq.status) + '">' + esc(rq.status) + '</span></td></tr>';\r\n        }).join('') + '</tbody></table></div>';\r\n    }\r\n    container.innerHTML = html;\r\n    bindContentDelegation();\r\n  }).catch(function (err) {\r\n    container.innerHTML = errorState(err);\r\n    bindRetry(function () { renderClientTeam(container); });\r\n  });\r\n}\r\n\r\n/* ===================== ATTACHMENT HELPERS ===================== */\r\n\r\nfunction fileIcon(mime, filename) {\r\n  if (mime.indexOf("pdf") !== -1) return "\\ud83d\\udcc4";\r\n  if (mime.indexOf("word") !== -1 || /\\.docx?$/i.test(filename)) return "\\ud83d\\udcdd";\r\n  if (mime.indexOf("spreadsheet") !== -1 || mime.indexOf("excel") !== -1 || /\\.xlsx?$/i.test(filename)) return "\\ud83d\\udcca";\r\n  if (mime.indexOf("presentation") !== -1 || mime.indexOf("powerpoint") !== -1 || /\\.pptx?$/i.test(filename)) return "\\ud83d\\udcd1";\r\n  if (mime.indexOf("image") !== -1) return "\\ud83d\\uddbc\\ufe0f";\r\n  return "\\ud83d\\udcce";\r\n}\r\n\r\nfunction fmtFileSize(bytes) {\r\n  if (bytes < 1024) return bytes + " B";\r\n  if (bytes < 1048576) return Math.round(bytes / 1024) + " KB";\r\n  return (bytes / 1048576).toFixed(1) + " MB";\r\n}\r\n\r\nfunction attachmentCategoryIcon(label) {\r\n  var icons = { "Strategy": "\\ud83c\\udfaf", "SWOT Analysis": "\\ud83d\\udcd0", "Marketing Plan": "\\ud83d\\udcc8", "Business Plan": "\\ud83d\\udcbc", "Brand Guidelines": "\\ud83c\\udfa8", "Other": "\\ud83d\\udcce" };\r\n  return icons[label] || "\\ud83d\\udcce";\r\n}\r\n\r\nfunction renderAttachmentRows(attachments, isAdmin) {\r\n  if (!attachments.length) return '<div class="cell-sub">' + esc(t("No attachments yet")) + '</div>';\r\n  var groups = {};\r\n  attachments.forEach(function (att) {\r\n    if (!groups[att.label]) groups[att.label] = [];\r\n    groups[att.label].push(att);\r\n  });\r\n  var html = '';\r\n  Object.keys(groups).forEach(function (label) {\r\n    html += '<div class="attachment-category-label">' + attachmentCategoryIcon(label) + ' ' + esc(t(label)) + '</div>';\r\n    html += '<div class="attachments-grid">';\r\n    groups[label].forEach(function (att) {\r\n      html += '<div class="attachment-card">' +\r\n        '<div class="attachment-icon">' + fileIcon(att.mimeType, att.filename) + '</div>' +\r\n        '<div class="attachment-info">' +\r\n          '<div class="attachment-name">' + esc(att.filename) + '</div>' +\r\n          '<div class="attachment-meta">' + fmtFileSize(att.fileSize) + ' \\u00b7 ' + esc(t("Uploaded by")) + ' ' + esc(att.uploaderName) + ' \\u00b7 ' + esc(att.createdAt.split("T")[0]) + '</div>' +\r\n        '</div>' +\r\n        '<div class="attachment-actions">' +\r\n        '<button class="btn btn-sm attachment-download-btn" data-download-attachment="' + att.id + '" data-filename="' + esc(att.filename) + '">\\u2b07 ' + esc(t("Download")) + '</button>' +\r\n        (isAdmin ? '<button class="btn btn-sm btn-danger-subtle" data-delete-attachment="' + att.id + '" data-att-name="' + esc(att.filename) + '">\\u2715</button>' : '') +\r\n        '</div></div>';\r\n    });\r\n    html += '</div>';\r\n  });\r\n  return html;\r\n}\r\n\r\nfunction triggerAttachmentDownload(attId, fname) {\r\n  apiFetch("/api/attachments/portal/" + attId + "/download").then(function (res) {\r\n    var link = document.createElement("a");\r\n    link.href = res.fileData;\r\n    link.download = res.filename || fname;\r\n    document.body.appendChild(link);\r\n    link.click();\r\n    link.remove();\r\n  }).catch(errorToast);\r\n}\r\n\r\nfunction renderClientAttachments(container) {\r\n  api.portal.attachments().then(function (res) {\r\n    var attachments = res.attachments || [];\r\n    if (!attachments.length) {\r\n      container.innerHTML = emptyState("\\ud83d\\udcce", t("No attachments yet"), t("Your business documents will appear here once WITRA uploads them."));\r\n      bindRetry(function () { renderClientAttachments(container); });\r\n      return;\r\n    }\r\n    var html = '<p class="cell-sub" style="margin-bottom:16px;">' + esc(t("Strategy, SWOT Analysis, Marketing Plans and other business documents uploaded by WITRA.")) + '</p>';\r\n    html += renderAttachmentRows(attachments, false);\r\n    container.innerHTML = html;\r\n    bindContentDelegation();\r\n    container.querySelectorAll("[data-download-attachment]").forEach(function (btn) {\r\n      btn.addEventListener("click", function () {\r\n        var attId = btn.getAttribute("data-download-attachment");\r\n        var fname = btn.getAttribute("data-filename");\r\n        setButtonLoading(btn, true, t("Working\\u2026"));\r\n        apiFetch("/api/attachments/portal/" + attId + "/download").then(function (res) {\r\n          setButtonLoading(btn, false);\r\n          var link = document.createElement("a");\r\n          link.href = res.fileData;\r\n          link.download = res.filename || fname;\r\n          document.body.appendChild(link);\r\n          link.click();\r\n          link.remove();\r\n        }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });\r\n      });\r\n    });\r\n  }).catch(function (err) {\r\n    container.innerHTML = errorState(err);\r\n    bindRetry(function () { renderClientAttachments(container); });\r\n  });\r\n}\r\n\r\nfunction loadAdminAttachments(clientId) {\r\n  var listEl = document.getElementById("adminAttachmentsList");\r\n  if (!listEl) return;\r\n  api.attachments.ofClient(clientId).then(function (res) {\r\n    var atts = res.attachments || [];\r\n    listEl.innerHTML = renderAttachmentRows(atts, true);\r\n    listEl.querySelectorAll("[data-download-attachment]").forEach(function (btn) {\r\n      btn.addEventListener("click", function () {\r\n        var attId = btn.getAttribute("data-download-attachment");\r\n        var fname = btn.getAttribute("data-filename");\r\n        setButtonLoading(btn, true, t("Working\\u2026"));\r\n        triggerAttachmentDownload(attId, fname);\r\n        setTimeout(function () { setButtonLoading(btn, false); }, 1500);\r\n      });\r\n    });\r\n    listEl.querySelectorAll("[data-delete-attachment]").forEach(function (btn) {\r\n      btn.addEventListener("click", function () {\r\n        var attId = btn.getAttribute("data-delete-attachment");\r\n        var attName = btn.getAttribute("data-att-name");\r\n        if (!confirm(t("Delete this attachment?") + "\\n" + attName)) return;\r\n        setButtonLoading(btn, true, "\\u2026");\r\n        api.attachments.remove(attId).then(function () {\r\n          toast(t("Attachment deleted"), "success");\r\n          loadAdminAttachments(clientId);\r\n        }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });\r\n      });\r\n    });\r\n  }).catch(function () {\r\n    listEl.innerHTML = '<div class="cell-sub">' + esc(t("No attachments yet")) + '</div>';\r\n  });\r\n}\r\n\r\nfunction renderClientSettings(container) {\r\n  var rows = [["Profile", "Your name, email, and photo"], ["Business Profile", "Edit under My Business"],\r\n    ["Team Members", "Manage under Team"],\r\n    ["Notification Preferences", "Email and in-app alerts"]];\r\n  container.innerHTML = '<div class="panel-card"><div class="settings-list">' + rows.map(function (r) {\r\n    return '<div class="settings-row"><div><div class="lbl">' + esc(r[0]) + '</div><div class="desc">' + esc(r[1]) + '</div></div><button class="btn btn-sm" data-manage-setting="' + esc(r[0]) + '">Manage</button></div>';\r\n  }).join('') + '</div></div>';\r\n  bindContentDelegation();\r\n}\r\n\r\nvar _delegationBound`;
  
  content = content.replace(breakPoint, fixedTeamEnd);
  console.log('FIX 2: Fixed renderClientTeam end + added all attachment functions + renderClientSettings');
} else {
  console.log('SKIP 2: Break point pattern not found');
  // Try to find the pattern with different line endings
  const alt1 = "esc(rq.requestedDate) + '</td>' +\nvar _delegationBound";
  if (content.includes(alt1)) {
    console.log('  Found with \\n endings instead of \\r\\n');
  }
  // Show the context
  const rdIdx = content.lastIndexOf('requestedDate');
  if (rdIdx >= 0) {
    console.log('  Context around last requestedDate:');
    console.log(JSON.stringify(content.substring(rdIdx + 13, rdIdx + 80)));
  }
}

// ─── FIX 3: Add admin attachment event binding in renderAdminClientProfile ───
// After the saveNotesBtn event listener, we need to call loadAdminAttachments
const saveNotesListener = 'document.getElementById("saveNotesBtn").addEventListener("click", function ()';
const saveNotesIdx = content.indexOf(saveNotesListener);
if (saveNotesIdx >= 0) {
  // Find the end of the saveNotesBtn handler block
  // We need to find where the closing of the catch block is, after saveNotesBtn
  const afterSave = content.indexOf('}).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });\r\n    });', saveNotesIdx);
  if (afterSave >= 0) {
    const insertAt = afterSave + '}).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });\r\n    });'.length;
    const attachmentBinding = `\r\n    // Load admin attachments list and bind upload\r\n    loadAdminAttachments(c.id);\r\n    var _attachFile = null;\r\n    document.getElementById("attachFileInput").addEventListener("change", function (e) {\r\n      _attachFile = e.target.files && e.target.files[0];\r\n      document.getElementById("attachFileName").textContent = _attachFile ? _attachFile.name : "";\r\n      document.getElementById("attachUploadBtn").disabled = !_attachFile;\r\n    });\r\n    document.getElementById("attachUploadBtn").addEventListener("click", function () {\r\n      if (!_attachFile) return;\r\n      if (_attachFile.size > 1500000) { toast("File is too large (max ~1.5 MB).", "error"); return; }\r\n      var btn = this;\r\n      setButtonLoading(btn, true, t("Uploading\\u2026"));\r\n      var reader = new FileReader();\r\n      reader.onload = function (evt) {\r\n        api.attachments.upload(c.id, {\r\n          label: document.getElementById("attachLabel").value,\r\n          filename: _attachFile.name,\r\n          mimeType: _attachFile.type,\r\n          fileSize: _attachFile.size,\r\n          fileData: evt.target.result\r\n        }).then(function () {\r\n          setButtonLoading(btn, false);\r\n          toast(t("Attachment uploaded"), "success");\r\n          _attachFile = null;\r\n          document.getElementById("attachFileName").textContent = "";\r\n          document.getElementById("attachUploadBtn").disabled = true;\r\n          document.getElementById("attachFileInput").value = "";\r\n          loadAdminAttachments(c.id);\r\n        }).catch(function (err) { setButtonLoading(btn, false); errorToast(err); });\r\n      };\r\n      reader.readAsDataURL(_attachFile);\r\n    });`;
    content = content.substring(0, insertAt) + attachmentBinding + content.substring(insertAt);
    console.log('FIX 3: Added admin attachment upload binding');
  } else {
    console.log('SKIP 3: Could not find saveNotes catch block');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! File saved.');
