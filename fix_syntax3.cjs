const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

const fragment2 = `    }).catch(errorToast);\r\n      return;\r\n    }
    if (e.target.id === "markAllReadBtn") {`;

// Replace this fragment with just the markAllReadBtn line
appJs = appJs.replace(/\}\)\.catch\(errorToast\);\r?\n\s*return;\r?\n\s*\}\r?\n\s*if \(e\.target\.id === "markAllReadBtn"\) \{/g, `    if (e.target.id === "markAllReadBtn") {`);

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
