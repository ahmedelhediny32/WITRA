const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// 1. Fix the double JSON.stringify bug
appJs = appJs.replace(/body: JSON\.stringify\(\{ status: newVal \}\)/g, 'body: { status: newVal }');

// 2. Prevent click propagation from select elements in tables
// Around line 3075:
//     if (el = e.target.closest("[data-view-profile]")) {
//       closeModal();
// We will insert `if (e.target.closest("select, button, a")) return;` right inside the block.
const viewProfileTarget = 'if (el = e.target.closest("[data-view-profile]")) {\n      closeModal();';
const viewProfileFix = 'if (el = e.target.closest("[data-view-profile]")) {\n      if (e.target.closest("select, button, a")) return;\n      closeModal();';

if (appJs.includes(viewProfileTarget)) {
  appJs = appJs.replace(viewProfileTarget, viewProfileFix);
  console.log("Patched view profile click propagation");
} else {
  console.log("Could not find viewProfileTarget");
}

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
