const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

// Fix stringify
appJs = appJs.replace(/body: JSON\.stringify\(\{ status: newVal \}\)/g, 'body: { status: newVal }');

// Fix event bubbling using Regex
const targetRegex = /if \(el = e\.target\.closest\("\[data-view-profile\]"\)\) \{\s*closeModal\(\);/;
const replacement = `if (el = e.target.closest("[data-view-profile]")) {\n      if (e.target.closest("select, button, a")) return;\n      closeModal();`;
appJs = appJs.replace(targetRegex, replacement);

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Applied fix correctly.");
