import fs from 'fs';

const patchFile = fs.readFileSync('patch_app_v2.mjs', 'utf8');

// The replacementCode string is between `const replacementCode = \`` and `\`;`
const startTag = 'const replacementCode = `';
const endTag = '`;\n\ncontent = content.substring(';

let startIdx = patchFile.indexOf(startTag);
if (startIdx === -1) {
  console.error("Could not find start tag");
  process.exit(1);
}

let endIdx = patchFile.indexOf(endTag, startIdx);
if (endIdx === -1) {
  console.error("Could not find end tag");
  process.exit(1);
}

const cleanCode = patchFile.substring(startIdx + startTag.length, endIdx);

let appJs = fs.readFileSync('public/static/app.js', 'utf8');

let targetStart = appJs.indexOf('function reportFormModal(reportId, preselectClientId)');
let targetEnd = appJs.indexOf('function renderAdminActivities(container)');

if (targetStart === -1 || targetEnd === -1) {
  console.error("Could not find targets in app.js");
  process.exit(1);
}

appJs = appJs.substring(0, targetStart) + cleanCode + appJs.substring(targetEnd);

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log("Restored perfectly from original patch.");
