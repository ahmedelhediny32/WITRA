const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// The file might contain a special character or quote type.
appJs = appJs.replace(/req\.notes \|\| ["'][-—]["']/g, 'req.notes || ""');

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Removed dashes from Notes column.");
