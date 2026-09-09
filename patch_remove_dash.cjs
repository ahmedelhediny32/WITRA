const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// The line for Service Requests:
// '<td>' + (req.status === "Requested" || req.status === "Reviewing" ? '<button class="btn btn-sm" data-review-request="' + req.id + '">Review -></button>' : '<span class="cell-sub">-</span>') + '</td></tr>';

// The line for Team Requests:
// '<td>' + (rq.status === "Requested" ? '<button class="btn btn-sm" data-review-team-request="' + rq.id + '">' + esc(t("Review")) + '  </button>' : '<span class="cell-sub">-</span>') + '</td></tr>';

// Let's replace the dash with empty string in both cases
appJs = appJs.replace(/<span class="cell-sub">-<\/span>/g, "");

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Removed dashes from review column.");
