import fs from "fs";

let content = fs.readFileSync("public/static/style.css", "utf8");

const oldCss = `  /* Brand section: logo sits beside a stacked column of the two brand colors */
  .brand-section-layout{display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap; padding: 10px 0;}
  .brand-logo-col{width:220px;flex-shrink:0;}
  .brand-logo-col .form-field-label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--ink-soft);font-weight:700;margin-bottom:12px;}
  
  .brand-colors-col{flex:1 1 auto;display:flex;flex-direction:row;gap:20px;min-width:280px;}
  .brand-colors-col .form-field{flex: 1; background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px;transition:all .3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.02); display: flex; flex-direction: column;}
  .brand-colors-col .form-field:hover{border-color:var(--accent-soft); box-shadow: 0 8px 20px rgba(116,37,78,0.08); transform: translateY(-2px);}
  .brand-colors-col .form-field label{margin-bottom:12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--ink-soft); font-weight: 700;}
  
  .brand-colors-col .form-field input[type=color]{
    -webkit-appearance: none; -moz-appearance: none; appearance: none;
    width: 100%; height: 50px; border: none; border-radius: 10px; 
    cursor: pointer; padding: 0; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
  }
  .brand-colors-col .form-field input[type=color]::-webkit-color-swatch-wrapper{padding: 0;}
  .brand-colors-col .form-field input[type=color]::-webkit-color-swatch{border: none; border-radius: 10px;}
  .brand-colors-col .form-field input[type=color]::-moz-color-swatch{border: none; border-radius: 10px;}

  @media (max-width:768px){
    .brand-section-layout{flex-direction:column; gap: 20px;}
    .brand-logo-col{width:100%;}
    .brand-colors-col{flex-direction: column; width: 100%;}
  }`;

const newCss = `  /* Brand section: logo sits beside a stacked column of the two brand colors */
  .brand-section-layout{display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap; padding: 10px 0;}
  .brand-logo-col{width:220px;flex-shrink:0;}
  .brand-logo-col .form-field-label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--ink-soft);font-weight:700;margin-bottom:12px;}
  
  .brand-colors-col, .brand-typography-col { flex:1 1 auto; display:flex; flex-direction:column; gap:20px; min-width:220px; }
  .brand-colors-col .form-field, .brand-typography-col .form-field { flex: 1; background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px;transition:all .3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.02); display: flex; flex-direction: column; }
  .brand-colors-col .form-field:hover, .brand-typography-col .form-field:hover { border-color:var(--accent-soft); box-shadow: 0 8px 20px rgba(116,37,78,0.08); transform: translateY(-2px); }
  .brand-colors-col .form-field label, .brand-typography-col .form-field label { margin-bottom:12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--ink-soft); font-weight: 700; }
  
  .brand-colors-col .form-field input[type=color]{
    -webkit-appearance: none; -moz-appearance: none; appearance: none;
    width: 100%; height: 50px; border: none; border-radius: 10px; 
    cursor: pointer; padding: 0; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
  }
  .brand-colors-col .form-field input[type=color]::-webkit-color-swatch-wrapper{padding: 0;}
  .brand-colors-col .form-field input[type=color]::-webkit-color-swatch{border: none; border-radius: 10px;}
  .brand-colors-col .form-field input[type=color]::-moz-color-swatch{border: none; border-radius: 10px;}

  @media (max-width:768px){
    .brand-section-layout{flex-direction:column; gap: 20px;}
    .brand-logo-col{width:100%;}
    .brand-colors-col, .brand-typography-col {width: 100%;}
  }`;

content = content.replace(oldCss, newCss);
fs.writeFileSync("public/static/style.css", content, "utf8");
console.log("CSS patched!");
