const fs = require('fs');
const appJs = fs.readFileSync('public/static/app.js', 'utf8');
const regex = /t\(\"([^\"]+)\"\)/g;
let match;
let missing = [];
const arBlockMatch = appJs.match(/ar:\s*\{([\s\S]*?)\}/);
const arBlock = arBlockMatch ? arBlockMatch[1] : '';

while ((match = regex.exec(appJs)) !== null) {
  const key = match[1];
  if (!arBlock.includes('"' + key + '"')) {
    if (!missing.includes(key)) missing.push(key);
  }
}
console.log('Missing from locales.ar:');
console.log(missing);
