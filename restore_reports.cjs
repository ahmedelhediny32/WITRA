const fs = require('fs');

const oldAppJs = fs.readFileSync('old_app.js', 'utf8');
const newAppJs = fs.readFileSync('public/static/app.js', 'utf8');

const startIdxOld = oldAppJs.indexOf('function renderAdminReports(container) {');
const endIdxOld = oldAppJs.indexOf('function renderAdminActivities(container) {', startIdxOld);

if (startIdxOld === -1 || endIdxOld === -1) {
  console.log("Could not find function in old_app.js");
  process.exit(1);
}

// Extract the missing function
const missingFunc = oldAppJs.substring(startIdxOld, endIdxOld);

// Find where to inject it in new app.js
const targetIdx = newAppJs.indexOf('/* ===================== ADMIN — ACTIVITIES ===================== */');

if (targetIdx === -1) {
  console.log("Could not find target in app.js");
  process.exit(1);
}

const fixedAppJs = newAppJs.substring(0, targetIdx) + 
                   '\n/* ===================== ADMIN — REPORTS ===================== */\n' + 
                   missingFunc + '\n' + 
                   newAppJs.substring(targetIdx);

fs.writeFileSync('public/static/app.js', fixedAppJs, 'utf8');
console.log('Successfully restored renderAdminReports!');
