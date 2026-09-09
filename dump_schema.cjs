const Database = require('better-sqlite3');
const db = new Database('.wrangler/state/v3/d1/miniflare-D1DatabaseObject/d7dadd1217ec2586066da7fbd2cc777fc527c27164b42dc9e430d7564b1e1697.sqlite');
const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'd1_migrations'").all();
let out = '';
tables.forEach(t => {
  out += t.sql + ';\n\n';
  const rows = db.prepare('SELECT * FROM ' + t.name).all();
  if(rows.length > 0) {
    const keys = Object.keys(rows[0]);
    rows.forEach(r => {
      const vals = keys.map(k => {
        const v = r[k];
        return v === null ? 'NULL' : typeof v === 'number' ? v : "'" + v.toString().replace(/'/g, "''") + "'";
      });
      out += 'INSERT INTO ' + t.name + ' (' + keys.join(', ') + ') VALUES (' + vals.join(', ') + ');\n';
    });
    out += '\n';
  }
});
const fs = require('fs');
fs.writeFileSync('setup_database.sql', out);
