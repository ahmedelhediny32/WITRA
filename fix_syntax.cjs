const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// The corrupted fragment left behind:
const fragment = `}).join('') : '<div class="notif-item"><div>No notifications yet.</div></div>') +
    '</div>';
}`;

appJs = appJs.replace(fragment, "");

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
