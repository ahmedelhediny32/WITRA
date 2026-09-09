const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// 1. notifPanelHtml
const oldNotifPanelRegex = /function notifPanelHtml\(notifications\) \{\r?\n\s*return '<div class="notif-panel" id="notifPanel">'\s*\+\r?\n\s*'<div class="notif-panel-head">Notifications <span id="markAllReadBtn">Mark all read<\/span><\/div>'\s*\+\r?\n\s*\(notifications\.length \? notifications\.map\(function \(n\) \{\r?\n\s*return '<div class="notif-item ' \+ \(n\.read \? 'read' : ''\) \+ '"><div class="dot"><\/div><div><div>' \+ t\(n\.text\) \+ '<\/div><div class="time">' \+ timeAgo\(n\.time\) \+ '<\/div><\/div><\/div>';\r?\n\s*\}\)\.join\(''\) : '<div class="notif-item"><div>No notifications yet\.<\/div><\/div>'\)\s*\+\r?\n\s*'<\/div>';\r?\n\}/;

const newNotifPanelHtml = `function notifPanelHtml(notifications) {
  var unread = notifications.filter(function(n) { return !n.read; });
  return '<div class="notif-panel" id="notifPanel">' +
    '<div class="notif-panel-head">' + esc(t("Notifications")) + '</div>' +
    (unread.length ? unread.map(function (n) {
      return '<div class="notif-item"><div class="dot"></div><div><div>' + t(n.text) + '</div><div class="time">' + timeAgo(n.time) + '</div></div></div>';
    }).join('') : '<div class="notif-item"><div>' + esc(t("No new notifications.")) + '</div></div>') +
    '</div>';
}`;

if (oldNotifPanelRegex.test(appJs)) {
  appJs = appJs.replace(oldNotifPanelRegex, newNotifPanelHtml);
  console.log("Patched notifPanelHtml.");
} else {
  console.log("Could not find notifPanelHtml.");
}

// 2. Bell Click
const oldBellRegex = /    if \(el = e\.target\.closest\("#bellBtn"\)\) \{\r?\n\s*e\.stopPropagation\(\);\r?\n\s*var existingPanel = document\.getElementById\("notifPanel"\);\r?\n\s*if \(existingPanel\) \{ existingPanel\.remove\(\); return; \}\r?\n\s*notifApiForView\(\)\.list\(\)\.then\(function \(res\) \{\r?\n\s*var wrap = document\.getElementById\("notifWrap"\);\r?\n\s*if \(wrap\) wrap\.insertAdjacentHTML\("beforeend", notifPanelHtml\(res\.notifications\)\);\r?\n\s*\}\)\.catch\(errorToast\);\r?\n\s*return;\r?\n\s*\}/;

const newBellClick = `    if (el = e.target.closest("#bellBtn")) {
      e.stopPropagation();
      var existingPanel = document.getElementById("notifPanel");
      if (existingPanel) { 
        existingPanel.remove(); 
        notifApiForView().markAllRead().then(function() {
          var b = document.querySelector(".bell-dot"); if(b) b.remove();
        }).catch(function(){});
        return; 
      }
      notifApiForView().list().then(function (res) {
        var wrap = document.getElementById("notifWrap");
        if (wrap) wrap.insertAdjacentHTML("beforeend", notifPanelHtml(res.notifications));
      }).catch(errorToast);
      return;
    }`;

if (oldBellRegex.test(appJs)) {
  appJs = appJs.replace(oldBellRegex, newBellClick);
  console.log("Patched bell click.");
} else {
  console.log("Could not find bell click.");
}

// 3. Global click
const oldGlobalRegex = /    var notifPanel = document\.getElementById\("notifPanel"\);\r?\n\s*if \(notifPanel && !notifPanel\.contains\(e\.target\) && e\.target\.id !== "bellBtn" && !e\.target\.closest\("#bellBtn"\)\) \{\r?\n\s*notifPanel\.remove\(\);\r?\n\s*\}/;

const newGlobalClick = `    var notifPanel = document.getElementById("notifPanel");
    if (notifPanel && !notifPanel.contains(e.target) && e.target.id !== "bellBtn" && !e.target.closest("#bellBtn")) {
      notifPanel.remove();
      notifApiForView().markAllRead().then(function() {
        var b = document.querySelector(".bell-dot"); if(b) b.remove();
      }).catch(function(){});
    }`;

if (oldGlobalRegex.test(appJs)) {
  appJs = appJs.replace(oldGlobalRegex, newGlobalClick);
  console.log("Patched global click.");
} else {
  console.log("Could not find global click.");
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Safe patch complete.");
