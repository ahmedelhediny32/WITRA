const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// Replace "A draft performance report for (.+?) was entered" with "(?:draft|final)"
appJs = appJs.split('/A draft performance report for (.+?) was entered/').join('/A (?:draft|final) performance report for (.+?) was entered/');

// Replace Arabic string
appJs = appJs.split('"تم إدخال مسودة تقرير الأداء لشهر $1"').join('"تم إدخال تقرير الأداء لشهر $1"');

// Fix "Team request for" regex just in case there are other variations
appJs = appJs.replace(/Team request for \(\.\+\\?\)/g, 'Team request for (.+?)');

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log('Regex fixed successfully');
