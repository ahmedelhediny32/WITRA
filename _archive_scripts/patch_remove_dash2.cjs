const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// Replace both hyphen and em-dash in cell-sub for the action column
appJs = appJs.replace(/<span class="cell-sub">[-—]<\/span>/g, "");

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Removed dashes from review column.");
