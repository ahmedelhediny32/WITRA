const fs = require('fs');
let appJs = fs.readFileSync('public/static/app.js', 'utf8');

const newBlock = `
    // Health statuses and reasons
    if (key.includes("Execution is falling behind")) {
      return key.replace(/Execution is falling behind [\\-—] just (\\d+)% of planned work done \\((\\d+)\\/(\\d+)\\)\\./, "التنفيذ متأخر — تم إنجاز $1% فقط من العمل المخطط ($2/$3).");
    }
    if (key.includes("planned work is executed so far")) {
      return key.replace(/Only (\\d+)% of this month's planned work is executed so far \\((\\d+)\\/(\\d+)\\)\\./, "يحتاج انتباه — تم إنجاز $1% من العمل المخطط هذا الشهر ($2/$3).");
    }
    if (key.includes("planned work is executed")) {
      return key.replace(/(\\d+)% of this month's planned work is executed \\((\\d+)\\/(\\d+)\\)\\./, "على المسار الصحيح — تم إنجاز $1% من العمل المخطط هذا الشهر ($2/$3).");
    }
    if (key.includes("Just onboarded")) {
      return "بدأ حديثاً — سيتم حساب الحالة بعد بدء التنفيذ.";
    }
    if (key.includes("No execution data yet")) {
      return "لا توجد بيانات تنفيذ بعد — سيتم حساب الحالة بمجرد إضافة مهام لخطة المحتوى.";
    }
`;

appJs = appJs.replace(/\/\/\ Health statuses and reasons[\s\S]*?if \(key\.includes\("No execution data yet"\)\) \{[\s\S]*?\}/, newBlock.trim());

fs.writeFileSync('public/static/app.js', appJs, 'utf8');
console.log('Health regexes updated robustly.');
