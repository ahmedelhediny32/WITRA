const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');
console.log('Includes ar locales index:', appJs.indexOf('ar: {') !== -1);
console.log('Includes Why it matters:', appJs.includes('Why it matters'));
console.log('Includes Arabic string:', appJs.includes('سبب الأهمية'));
console.log('t() Function changed:', appJs.includes('Dynamic Replacements for Activities'));
