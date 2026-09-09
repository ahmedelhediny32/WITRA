const fs = require('fs');
let code = fs.readFileSync('public/static/app.js', 'utf8');

// Fix displayRequests limit (15 -> 10)
code = code.replace(
  'var displayRequests = teamRequests.slice(0, 15);',
  'var displayRequests = teamRequests.slice(0, 10);'
);

// Fix team table layout 1
code = code.replace(
  '<table class="data-table"><thead><tr><th>\' + esc(t("Name")) + \'</th><th>\' + esc(t("Email")) + \'</th><th>\' + esc(t("Role")) + \'</th><th>\' + esc(t("Assigned Clients")) + \'</th><th></th></tr></thead><tbody>',
  '<table class="data-table" style="table-layout: fixed; width: 100%;"><thead><tr><th style="width: 25%;">\' + esc(t("Name")) + \'</th><th style="width: 30%;">\' + esc(t("Email")) + \'</th><th style="width: 15%;">\' + esc(t("Role")) + \'</th><th style="width: 20%;">\' + esc(t("Assigned Clients")) + \'</th><th style="width: 10%;"></th></tr></thead><tbody>'
);

// Fix team table layout 2
code = code.replace(
  '<table class="data-table"><thead><tr><th>\' + esc(t("Client")) + \'</th><th>\' + esc(t("Name")) + \'</th><th>\' + esc(t("Email")) + \'</th><th>\' + esc(t("Access")) + \'</th><th>\' + esc(t("Requested")) + \'</th><th>\' + esc(t("Status")) + \'</th><th></th></tr></thead><tbody>',
  '<table class="data-table" style="table-layout: fixed; width: 100%;"><thead><tr><th style="width: 15%;">\' + esc(t("Client")) + \'</th><th style="width: 15%;">\' + esc(t("Name")) + \'</th><th style="width: 25%;">\' + esc(t("Email")) + \'</th><th style="width: 10%;">\' + esc(t("Access")) + \'</th><th style="width: 15%;">\' + esc(t("Requested")) + \'</th><th style="width: 10%;">\' + esc(t("Status")) + \'</th><th style="width: 10%;"></th></tr></thead><tbody>'
);

// Add 'Joined' column to client platform users
code = code.replace(
  '<table class="data-table"><thead><tr><th>\' + esc(t("Client")) + \'</th><th>\' + esc(t("Name")) + \'</th><th>\' + esc(t("Email")) + \'</th><th>\' + esc(t("Role")) + \'</th></tr></thead><tbody>\' +',
  '<table class="data-table" style="table-layout: fixed; width: 100%;"><thead><tr><th style="width: 20%;">\' + esc(t("Client")) + \'</th><th style="width: 25%;">\' + esc(t("Name")) + \'</th><th style="width: 25%;">\' + esc(t("Email")) + \'</th><th style="width: 15%;">\' + esc(t("Role")) + \'</th><th style="width: 15%;">\' + esc(t("Joined")) + \'</th></tr></thead><tbody>\' +'
);

code = code.replace(
  '\'<td class="mono cell-sub">\' + esc(u.email) + \'</td><td>\' + esc(u.role) + \'</td></tr>\';',
  '\'<td class="mono cell-sub">\' + esc(u.email) + \'</td><td>\' + esc(u.role) + \'</td><td class="mono cell-sub">\' + (u.createdAt ? esc(u.createdAt.substring(0, 10)) : "—") + \'</td></tr>\';'
);

fs.writeFileSync('public/static/app.js', code, 'utf8');
console.log('Restored table layouts and columns');
