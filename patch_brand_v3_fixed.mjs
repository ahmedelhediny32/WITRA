import fs from "fs";

let content = fs.readFileSync("public/static/app.js", "utf8");
let originalContent = content;

content = content.replace(
  /\'<div class="brand-typography-col">\' \+[\s\S]*?\'<\/div><\/div><\/div>\';/,
  `'<div class="brand-typography-col">' +
      '<div class="form-field"><label>' + esc(t("Typography")) + '</label>' +
      '<input type="text" id="cbTypography" placeholder="' + esc(t("e.g. Inter, Cairo")) + '" value="' + esc(c.typography || "") + '" style="height:50px;width:100%;border:none;border-radius:10px;padding:0 12px;background:var(--canvas);font-weight:600;font-size:14px;outline:none;box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);"></div>' +
      '<div class="form-field"><label>' + esc(t("Brand Voice")) + '</label>' +
      '<input type="text" id="cbBrandVoice" placeholder="' + esc(t("e.g. Professional, Friendly")) + '" value="' + esc(c.brandVoice || "") + '" style="height:50px;width:100%;border:none;border-radius:10px;padding:0 12px;background:var(--canvas);font-weight:600;font-size:14px;outline:none;box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);"></div>' +
      '</div></div></div>';`
);

const oldEvent = `    var typoInput = document.getElementById("cbTypography");
    if (typoInput) {
      typoInput.addEventListener("change", function () {
        api.portal.saveBrand({ typography: typoInput.value }).then(function () {
          toast(t("Typography updated"), "success");
        }).catch(errorToast);
      });
    }`;

const newEvent = `    var typoInput = document.getElementById("cbTypography");
    if (typoInput) {
      typoInput.addEventListener("change", function () {
        api.portal.saveBrand({ typography: typoInput.value }).then(function () {
          toast(t("Typography updated"), "success");
        }).catch(errorToast);
      });
    }
    var voiceInput = document.getElementById("cbBrandVoice");
    if (voiceInput) {
      voiceInput.addEventListener("change", function () {
        api.portal.saveBrand({ brandVoice: voiceInput.value }).then(function () {
          toast(t("Brand voice updated"), "success");
        }).catch(errorToast);
      });
    }`;

if (originalContent.includes("cbBrandVoice")) {
    console.log("Already patched");
} else {
    content = content.replace(oldEvent, newEvent);
    fs.writeFileSync("public/static/app.js", content, "utf8");
    console.log("Patched!");
}
