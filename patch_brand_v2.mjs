import fs from "fs";

let content = fs.readFileSync("public/static/app.js", "utf8");

content = content.replace(
  /\'<div class="brand-colors-col">\' \+[\s\S]*?\'<\/div><\/div><\/div>\';/,
  `'<div class="brand-colors-col">' +
      '<div class="form-field"><label>' + esc(t("Primary Color")) + '</label><input type="color" id="cbLogoColor" value="' + c.logoColor + '"></div>' +
      '<div class="form-field"><label>' + esc(t("Secondary Color")) + '</label><input type="color" id="cbSecondaryColor" value="' + (c.secondaryColor || "#B7791F") + '"></div>' +
      '</div>' +
      '<div class="brand-typography-col">' +
      '<div class="form-field"><label>' + esc(t("Typography")) + '</label>' +
      '<select id="cbTypography" style="height:50px;width:100%;border:none;border-radius:10px;padding:0 12px;background:var(--canvas);font-weight:600;font-size:14px;outline:none;box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1); cursor:pointer;">' +
      ['Inter', 'Roboto', 'Outfit', 'Cairo', 'Tajawal', 'Almarai'].map(function(f) { return '<option value="' + f + '"' + ((c.typography || 'Inter') === f ? ' selected' : '') + '>' + f + '</option>'; }).join('') +
      '</select></div>' +
      '</div></div></div>';`
);

const eventStr = `    var secondaryColorInput = document.getElementById("cbSecondaryColor");
    secondaryColorInput.addEventListener("change", function () {
      api.portal.saveBrand({ secondaryColor: secondaryColorInput.value }).then(function () {
        toast(t("Secondary color updated"), "success");
      }).catch(errorToast);
    });`;

if (!content.includes("cbTypography")) {
    console.error("Typography not added in HTML!");
    process.exit(1);
}

if (!content.includes("var typoInput")) {
    content = content.replace(eventStr, eventStr + `
    var typoInput = document.getElementById("cbTypography");
    if (typoInput) {
      typoInput.addEventListener("change", function () {
        api.portal.saveBrand({ typography: typoInput.value }).then(function () {
          toast(t("Typography updated"), "success");
        }).catch(errorToast);
      });
    }`);
}

fs.writeFileSync("public/static/app.js", content, "utf8");
console.log("Patched!");
