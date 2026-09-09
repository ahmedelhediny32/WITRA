const fs = require('fs');
let code = fs.readFileSync('public/static/app.js', 'utf8');

const target = `    html += '<div class="section-title" style="margin-top:40px;">' + esc(t("Client Platform Users")) + '</div>';
    html += '<p class="cell-sub" style="margin-bottom:16px;">' + esc(t("Active client accounts organized by company.")) + '</p>';
    if (clientUsers.length === 0) {
      html += '<p class="cell-sub">' + esc(t("No client users registered yet.")) + '</p>';
    } else {
      html += '<div class="panel-card"><table class="data-table" style="table-layout: fixed; width: 100%;"><thead><tr><th style="width: 20%;">' + esc(t("Client")) + '</th><th style="width: 25%;">' + esc(t("Name")) + '</th><th style="width: 25%;">' + esc(t("Email")) + '</th><th style="width: 15%;">' + esc(t("Role")) + '</th><th style="width: 15%;">' + esc(t("Joined")) + '</th></tr></thead><tbody>' +
        clientUsers.map(function (u) {
          return '<tr><td>' + esc(findClientName(u.clientId)) + '</td><td><div style="display:flex;align-items:center;gap:9px;"><div class="avatar-sm">' + initials(u.name) + '</div>' + esc(u.name) + '</div></td>' +
            '<td class="mono cell-sub">' + esc(u.email) + '</td><td>' + esc(u.role) + '</td><td class="mono cell-sub">' + (u.createdAt ? esc(u.createdAt.substring(0, 10)) : "—") + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }`;

const replacement = `    html += '<div class="section-title" style="margin-top:40px;">' + esc(t("Client Platform Users")) + '</div>';
    html += '<p class="cell-sub" style="margin-bottom:16px;">' + esc(t("Active client accounts organized by company.")) + '</p>';
    if (clientUsers.length === 0) {
      html += '<p class="cell-sub">' + esc(t("No client users registered yet.")) + '</p>';
    } else {
      var clientsMap = {};
      clientUsers.forEach(function(u) {
        var cName = findClientName(u.clientId);
        if (!clientsMap[cName]) clientsMap[cName] = [];
        clientsMap[cName].push(u);
      });

      var sortedClientNames = Object.keys(clientsMap).sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      html += '<div style="display: flex; flex-direction: column; gap: 16px;">';
      sortedClientNames.forEach(function(cName) {
        var users = clientsMap[cName];
        html += '<details class="panel-card" style="padding: 0; overflow: hidden; margin: 0;">';
        
        html += '<summary style="padding: 16px 20px; font-weight: 600; color: var(--text-main); background: #fdfbfb; cursor: pointer; user-select: none;">';
        html += '<span style="display: inline-flex; justify-content: space-between; width: calc(100% - 20px); align-items: center; vertical-align: middle;">';
        html += '<span>' + esc(cName) + '</span>';
        html += '<span class="status-badge" style="font-weight:normal; font-size: 12px; background: transparent; border-color: #e2e8f0;">' + users.length + ' ' + (users.length === 1 ? 'user' : 'users') + '</span>';
        html += '</span>';
        html += '</summary>';
        
        html += '<div style="border-top: 1px solid var(--border-color);">';
        html += '<table class="data-table" style="margin: 0; border: none; border-radius: 0; table-layout: fixed; width: 100%;"><thead><tr><th style="width: 30%;">' + esc(t("Name")) + '</th><th style="width: 35%;">' + esc(t("Email")) + '</th><th style="width: 15%;">' + esc(t("Role")) + '</th><th style="width: 20%;">' + esc(t("Joined")) + '</th></tr></thead><tbody>';
        
        users.forEach(function(u) {
          var joinDate = u.createdAt ? esc(u.createdAt.substring(0, 10)) : '—';
          html += '<tr><td><div style="display:flex;align-items:center;gap:9px;"><div class="avatar-sm">' + initials(u.name) + '</div>' + esc(u.name) + '</div></td>' +
            '<td class="mono cell-sub">' + esc(u.email) + '</td><td><span class="status-badge" style="background:#f1f5f9;color:#334155;border-color:#e2e8f0;">' + esc(u.role) + '</span></td>' +
            '<td class="mono cell-sub">' + joinDate + '</td></tr>';
        });
        
        html += '</tbody></table></div></details>';
      });
      html += '</div>';
    }`;

code = code.replace(target, replacement);

fs.writeFileSync('public/static/app.js', code, 'utf8');
console.log('Accordion restored!');
