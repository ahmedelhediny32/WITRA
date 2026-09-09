const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

appJs = appJs.replace(
  '\">\' + esc(c.billingStatus) + \' <span style=\"font-size:10px; opacity:0.7;\">✎</span></span></td>\',',
  '\">\' + esc(t(c.billingStatus)) + \' <span style=\"font-size:10px; opacity:0.7;\">✎</span></span></td>\','
);

appJs = appJs.replace(
  '\">\' + esc(c.billingStatus) + \' <span style=\"font-size:10px; opacity:0.7;\">✎</span></span></td>\' +',
  '\">\' + esc(t(c.billingStatus)) + \' <span style=\"font-size:10px; opacity:0.7;\">✎</span></span></td>\' +'
);


fs.writeFileSync('public/static/app.js', appJs, 'utf8');
