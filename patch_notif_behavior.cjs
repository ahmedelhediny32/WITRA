const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// 1. Replace notifPanelHtml to only show unread notifications
const oldNotifPanelHtml = `function notifPanelHtml(notifications) {
  return '<div class="notif-panel" id="notifPanel">' +
    '<div class="notif-panel-head">Notifications <span id="markAllReadBtn">Mark all read</span></div>' +
    (notifications.length ? notifications.map(function (n) {
      return '<div class="notif-item ' + (n.read ? 'read' : '') + '"><div class="dot"></div><div><div>' + t(n.text) + '</div><div class="time">' + timeAgo(n.time) + '</div></div></div>';
    }).join('') : '<div class="notif-item"><div>No notifications yet.</div></div>') +
    '</div>';
}`;

const newNotifPanelHtml = `function notifPanelHtml(notifications) {
  var unread = notifications.filter(function(n) { return !n.read; });
  return '<div class="notif-panel" id="notifPanel">' +
    '<div class="notif-panel-head">' + esc(t("Notifications")) + '</div>' +
    (unread.length ? unread.map(function (n) {
      return '<div class="notif-item"><div class="dot"></div><div><div>' + t(n.text) + '</div><div class="time">' + timeAgo(n.time) + '</div></div></div>';
    }).join('') : '<div class="notif-item"><div>' + esc(t("No new notifications.")) + '</div></div>') +
    '</div>';
}`;

if (appJs.includes(oldNotifPanelHtml)) {
  appJs = appJs.replace(oldNotifPanelHtml, newNotifPanelHtml);
  console.log("Patched notifPanelHtml.");
} else {
  console.log("Could not find oldNotifPanelHtml.");
}


// 2. Replace the bellBtn click listener
const oldBellBtn = `    if (el = e.target.closest("#bellBtn")) {
      e.stopPropagation();
      var existingPanel = document.getElementById("notifPanel");
      if (existingPanel) { existingPanel.remove(); return; }
      notifApiForView().list().then(function (res) {
        var wrap = document.getElementById("notifWrap");
        if (wrap) wrap.insertAdjacentHTML("beforeend", notifPanelHtml(res.notifications));
      }).catch(errorToast);
      return;
    }`;

const newBellBtn = `    if (el = e.target.closest("#bellBtn")) {
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

if (appJs.includes(oldBellBtn)) {
  appJs = appJs.replace(oldBellBtn, newBellBtn);
  console.log("Patched bellBtn click listener.");
} else {
  console.log("Could not find oldBellBtn.");
}


// 3. Replace the global click away listener
const oldGlobalClick = `    var notifPanel = document.getElementById("notifPanel");
    if (notifPanel && !notifPanel.contains(e.target) && e.target.id !== "bellBtn" && !e.target.closest("#bellBtn")) {
      notifPanel.remove();
    }`;

const newGlobalClick = `    var notifPanel = document.getElementById("notifPanel");
    if (notifPanel && !notifPanel.contains(e.target) && e.target.id !== "bellBtn" && !e.target.closest("#bellBtn")) {
      notifPanel.remove();
      notifApiForView().markAllRead().then(function() {
        var b = document.querySelector(".bell-dot"); if(b) b.remove();
      }).catch(function(){});
    }`;

if (appJs.includes(oldGlobalClick)) {
  appJs = appJs.replace(oldGlobalClick, newGlobalClick);
  console.log("Patched global click listener.");
} else {
  console.log("Could not find oldGlobalClick.");
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
