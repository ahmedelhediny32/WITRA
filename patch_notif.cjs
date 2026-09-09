const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

function replaceExactly(str, target, replacement) {
  const i = str.indexOf(target);
  if (i === -1) {
    console.log("NOT FOUND: \n" + target);
    return str;
  }
  return str.slice(0, i) + replacement + str.slice(i + target.length);
}

const targetNotifPanelHtml = `function notifPanelHtml(notifications) {
  return '<div class="notif-panel" id="notifPanel">' +
    '<div class="notif-panel-head">Notifications <span id="markAllReadBtn">Mark all read</span></div>' +
    (notifications.length ? notifications.map(function (n) {
      return '<div class="notif-item ' + (n.read ? 'read' : '') + '"><div class="dot"></div><div><div>' + t(n.text) + '</div><div class="time">' + timeAgo(n.time) + '</div></div></div>';
    }).join('') : '<div class="notif-item"><div>No notifications yet.</div></div>') +
    '</div>';
}`;

const replaceNotifPanelHtml = `function notifPanelHtml(notifications) {
  var unread = notifications.filter(function(n) { return !n.read; });
  return '<div class="notif-panel" id="notifPanel">' +
    '<div class="notif-panel-head">' + esc(t("Notifications")) + '</div>' +
    (unread.length ? unread.map(function (n) {
      return '<div class="notif-item"><div class="dot"></div><div><div>' + t(n.text) + '</div><div class="time">' + timeAgo(n.time) + '</div></div></div>';
    }).join('') : '<div class="notif-item"><div>' + esc(t("No new notifications.")) + '</div></div>') +
    '</div>';
}`;

appJs = replaceExactly(appJs, targetNotifPanelHtml, replaceNotifPanelHtml);

const targetBellClick = `    if (el = e.target.closest("#bellBtn")) {
      e.stopPropagation();
      var existingPanel = document.getElementById("notifPanel");
      if (existingPanel) { existingPanel.remove(); return; }
      notifApiForView().list().then(function (res) {
        var wrap = document.getElementById("notifWrap");
        if (wrap) wrap.insertAdjacentHTML("beforeend", notifPanelHtml(res.notifications));
      }).catch(errorToast);
      return;
    }`;

const replaceBellClick = `    if (el = e.target.closest("#bellBtn")) {
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

appJs = replaceExactly(appJs, targetBellClick, replaceBellClick);

const targetGlobalClick = `    var notifPanel = document.getElementById("notifPanel");
    if (notifPanel && !notifPanel.contains(e.target) && e.target.id !== "bellBtn" && !e.target.closest("#bellBtn")) {
      notifPanel.remove();
    }`;

const replaceGlobalClick = `    var notifPanel = document.getElementById("notifPanel");
    if (notifPanel && !notifPanel.contains(e.target) && e.target.id !== "bellBtn" && !e.target.closest("#bellBtn")) {
      notifPanel.remove();
      notifApiForView().markAllRead().then(function() {
        var b = document.querySelector(".bell-dot"); if(b) b.remove();
      }).catch(function(){});
    }`;

appJs = replaceExactly(appJs, targetGlobalClick, replaceGlobalClick);

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Successfully patched notifications.");
