const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

appJs = appJs.replace(/\}\)\.join\(''\) : '<div class="notif-item"><div>No notifications yet\.<\/div><\/div>'\) \+\r?\n\s*'<\/div>';\r?\n\}/g, "");

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
