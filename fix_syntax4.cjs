const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

appJs = appJs.replace(/    if \(e\.target\.id === "markAllReadBtn"\) \{/g, `    }
    if (e.target.id === "markAllReadBtn") {`);

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
