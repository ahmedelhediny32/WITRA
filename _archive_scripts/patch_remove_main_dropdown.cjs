const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// Use Regex to find the injected line in renderTable (around line 1495)
// It looks like: '<td>' + inlineBillingStatusSelect(c) + '</td>' +
// Followed by: '<td><span class="status-badge ' + healthClass(c.health)
const badLineRegex = /'<td>'\s*\+\s*inlineBillingStatusSelect\(c\)\s*\+\s*'<\/td>'\s*\+\s*\n\s*'<td><span class="status-badge '/;

if (badLineRegex.test(appJs)) {
  appJs = appJs.replace(badLineRegex, `'<td><span class="status-badge '`);
  console.log("Removed dropdown from main table.");
} else {
  console.log("Could not find badLineRegex.");
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
