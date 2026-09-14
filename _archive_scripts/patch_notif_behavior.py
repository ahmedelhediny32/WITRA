import re
import sys

with open('public/static/app.js', 'r', encoding='utf-8') as f:
    appJs = f.read()

# 1. Replace notifPanelHtml
old_notif_panel = r"""function notifPanelHtml\(notifications\) \{.*?\}"""
new_notif_panel = """function notifPanelHtml(notifications) {
  var unread = notifications.filter(function(n) { return !n.read; });
  return '<div class="notif-panel" id="notifPanel">' +
    '<div class="notif-panel-head">' + esc(t("Notifications")) + '</div>' +
    (unread.length ? unread.map(function (n) {
      return '<div class="notif-item"><div class="dot"></div><div><div>' + esc(t(n.text)) + '</div><div class="time">' + timeAgo(n.time) + '</div></div></div>';
    }).join('') : '<div class="notif-item"><div>' + esc(t("No new notifications.")) + '</div></div>') +
    '</div>';
}"""

appJs = re.sub(old_notif_panel, new_notif_panel, appJs, flags=re.DOTALL)

# 2. Replace bellBtn click
old_bell_btn = r"""if \(el = e\.target\.closest\("#bellBtn"\)\) \{.*?var wrap = document\.getElementById\("notifWrap"\).*?\}"""
new_bell_btn = """if (el = e.target.closest("#bellBtn")) {
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
    }"""

appJs = re.sub(old_bell_btn, new_bell_btn, appJs, flags=re.DOTALL)


# 3. Replace global click
old_global_click = r"""var notifPanel = document\.getElementById\("notifPanel"\);\s*if \(notifPanel && !notifPanel\.contains\(e\.target\).*?notifPanel\.remove\(\);\s*\}"""
new_global_click = """var notifPanel = document.getElementById("notifPanel");
    if (notifPanel && !notifPanel.contains(e.target) && e.target.id !== "bellBtn" && !e.target.closest("#bellBtn")) {
      notifPanel.remove();
      notifApiForView().markAllRead().then(function() {
        var b = document.querySelector(".bell-dot"); if(b) b.remove();
      }).catch(function(){});
    }"""

appJs = re.sub(old_global_click, new_global_click, appJs, flags=re.DOTALL)

with open('public/static/app.js', 'w', encoding='utf-8') as f:
    f.write(appJs)

print("Notifications behavior updated successfully!")
