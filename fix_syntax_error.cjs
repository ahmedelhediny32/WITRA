const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');
appJs = appJs.replace('ar: {\\n', 'ar: {\n');
fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Fixed newline syntax error");
