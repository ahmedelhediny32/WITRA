(function () {
  "use strict";

  var currentLanguage = localStorage.getItem("witra-public-lang") || "en";
  var catalog = { services: [], plans: [] };
  var copy = {
    en: {
      nav: ["Solutions", "How It Works", "Services", "Why WITRA", "About"],
      login: "Login", cta: "Book a Diagnostic", explore: "Explore WITRA",
      kicker: "MARKETING SYSTEMS · BUILT FOR GROWTH",
      hero: "Your Business Doesn't Need More Marketing. It Needs a Better System.",
      heroText: "WITRA builds connected marketing systems that turn strategy, branding, content, advertising and technology into one measurable growth engine.",
      problemEyebrow: "THE PROBLEM", problemTitle: "Most Businesses Don't Have a Marketing Problem. They Have a Disconnected System.",
      problemText: "Activity is not the same as progress. We diagnose the whole system before prescribing the next move.",
      stats: [["13", "posts published by 5 known agencies in 16 days"], ["0", "real funnel reports most SMEs receive"], ["1", "connected growth system your business needs"]],
      systemEyebrow: "THE WITRA SYSTEM", systemTitle: "One System. Every Growth Layer.",
      systemText: "Strategy, brand, content, performance and technology working together around the growth you can actually measure.",
      whyEyebrow: "WHY WITRA", whyTitle: "Sharp Thinking. Simple Plans. Work Built Around Your Business.",
      principles: [["Diagnose First", "We audit before we prescribe."], ["Systems Over Activity", "Every action has a job in the larger growth system."], ["Everything Connected", "Your message, media and measurement should speak to each other."], ["Measurable by Design", "We define what progress means before execution starts."], ["One-to-One Attention", "Senior-level attention without layers between you and the work."], ["Premium, SME-Accessible", "A serious growth partner without the traditional agency overhead."]],
      serviceEyebrow: "SERVICES", serviceTitle: "The Layers Your Growth System Needs.", serviceText: "Explore the strategic services and real plans already operating inside WITRA.",
      plansEyebrow: "PLANS & PRICING", plansTitle: "Clear Scope. Clear Investment. Clear Next Step.", plansText: "The public catalog is connected to the live WITRA service architecture.",
      processEyebrow: "HOW IT WORKS", processTitle: "Diagnose → Design → Operate → Measure → Scale", process: [["01", "Diagnose", "Understand before we build."], ["02", "Design", "Build the right growth system."], ["03", "Operate", "Put the system into motion."], ["04", "Measure", "Know what is actually working."], ["05", "Scale", "Double down on what works."]],
      proofEyebrow: "PROOF, NOT PROMISES", proofTitle: "Real Work. Real Numbers. No Theatre.", proofText: "Our first partnerships are in motion. Every case study follows the same rule: verified numbers, or nothing published at all.",
      finalTitle: "Your Growth System Starts With One Conversation.", finalText: "Tell us where your business is today. We'll help you identify what needs to change next.",
      footer: "Marketing systems that build real growth, not temporary noise.", close: "Close", success: "Thank you. Your diagnostic request is with the WITRA team.", submit: "Send Diagnostic Request", formTitle: "Let's Find What Your Business Needs Next.", formText: "A short conversation to understand the business before recommending anything.", required: "Please complete the required fields.", working: "Sending...", error: "Something went wrong. Please try again."
    },
    ar: {
      nav: ["حلولنا", "طريقة عملنا", "خدماتنا", "ليه WITRA", "من نحن"],
      login: "تسجيل الدخول", cta: "احجز جلسة تشخيص", explore: "اكتشف WITRA",
      kicker: "أنظمة تسويقية · مبنية للنمو",
      hero: "بيزنسك مش محتاج تسويق أكتر. محتاج نظام أفضل.",
      heroText: "WITRA بتبني أنظمة تسويقية متصلة بتحول الاستراتيجية والهوية والمحتوى والإعلانات والتكنولوجيا لمحرك نمو واحد قابل للقياس.",
      problemEyebrow: "المشكلة", problemTitle: "أغلب البيزنسات مش عندها مشكلة تسويق. عندها نظام متقطع.",
      problemText: "النشاط مش هو نفس التقدم. بنشخص النظام كله قبل ما نوصف الخطوة الجاية.",
      stats: [["13", "بوست نشرتهم 5 وكالات معروفة في 16 يوم"], ["0", "تقارير Funnel حقيقية أغلب الـ SMEs بتستلمها"], ["1", "نظام نمو متصل بيزنسك محتاجه"]],
      systemEyebrow: "نظام WITRA", systemTitle: "نظام واحد. كل طبقات النمو.",
      systemText: "استراتيجية وهوية ومحتوى وأداء وتكنولوجيا شغالين مع بعض حوالين نمو تقدر تقيسه فعلًا.",
      whyEyebrow: "ليه WITRA", whyTitle: "تفكير Sharp. خطط Simple. شغل معمول حوالين بيزنسك.",
      principles: [["التشخيص أولًا", "بنعمل أوديت قبل ما نوصف الحل."], ["أنظمة، مش نشاط", "كل خطوة ليها دور في نظام النمو الأكبر."], ["كل حاجة متصلة", "رسالتك وإعلاناتك وقياسك لازم يتكلموا مع بعض."], ["قابل للقياس من التصميم", "بنتفق يعني إيه تقدم قبل ما التنفيذ يبدأ."], ["اهتمام واحد لواحد", "اهتمام على مستوى الإدارة بدون طبقات بينك وبين الشغل."], ["تجربة فاخرة في متناول الـ SME", "شريك نمو جاد بدون تكاليف الوكالات التقليدية."]],
      serviceEyebrow: "خدماتنا", serviceTitle: "طبقات النمو اللي بيزنسك محتاجها.", serviceText: "اكتشف الخدمات والباقات الحقيقية الموجودة بالفعل داخل WITRA.",
      plansEyebrow: "الباقات والأسعار", plansTitle: "نطاق واضح. استثمار واضح. خطوة جاية واضحة.", plansText: "الكتالوج العام متصل بهندسة الخدمات الحية داخل WITRA.",
      processEyebrow: "طريقة عملنا", processTitle: "تشخيص ← تصميم ← تشغيل ← قياس ← توسع", process: [["01", "تشخيص", "نفهم الأول قبل ما نبني."], ["02", "تصميم", "نبني نظام النمو الصح."], ["03", "تشغيل", "نحرك النظام على أرض الواقع."], ["04", "قياس", "نعرف اللي شغال فعلًا."], ["05", "توسع", "نكبر اللي بيجيب نتيجة."]],
      proofEyebrow: "إثبات، مش وعود", proofTitle: "شغل حقيقي. أرقام حقيقية. بدون تمثيل.", proofText: "شراكاتنا الأولى شغالة دلوقتي. أي Case Study عندنا لازم يكون بأرقام مؤكدة، أو مش هتتنشر.",
      finalTitle: "نظام نموك بيبدأ بمكالمة واحدة.", finalText: "قولنا بيزنسك واقف فين دلوقتي، وإحنا هنساعدك تحدد إيه اللي محتاج يتغير بعد كده.",
      footer: "أنظمة تسويقية تصنع نموًا حقيقيًا، مش ضجيجًا مؤقتًا.", close: "إغلاق", success: "شكرًا. فريق WITRA استلم طلب التشخيص.", submit: "إرسال طلب التشخيص", formTitle: "خلينا نعرف بيزنسك محتاج إيه بعد كده.", formText: "مكالمة قصيرة نفهم فيها البيزنس قبل ما نقترح أي حاجة.", required: "من فضلك أكمل البيانات المطلوبة.", working: "جاري الإرسال...", error: "حصل خطأ. حاول مرة تانية."
    }
  };

  function t(key) { return copy[currentLanguage][key]; }
  function local(en, ar) { return currentLanguage === "ar" ? ar : en; }
  function esc(value) { return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
  function languageValue(en, ar) { return currentLanguage === "ar" && ar ? ar : en; }
  function parseJson(value) { try { return JSON.parse(value || "[]"); } catch (_) { return []; } }
  function heroHeadline() {
    if (currentLanguage === "ar") {
      return '<span>بيزنسك مش محتاج تسويق أكتر.</span><span>محتاج <em>نظام أفضل.</em></span>';
    }
    return '<span>Your Business Doesn\'t</span><span>Need More Marketing.</span><span>It Needs a <em>Better System.</em></span>';
  }
  function navLinks() { return t("nav").map(function (label, index) { return '<a href="#' + ["solutions", "how-it-works", "services", "why-witra", "about"][index] + '">' + esc(label) + '</a>'; }).join(""); }
  function serviceCards() {
    var services = catalog.services.slice(0, 6);
    if (!services.length) services = [
      { name: "Marketing Strategy", headline: "Market diagnosis, audience definition and growth roadmaps", price: "" },
      { name: "Digital Marketing", headline: "Content strategy, paid advertising and performance", price: "" },
      { name: "Branding & Identity", headline: "Brand strategy, identity and guidelines", price: "" },
      { name: "Creative & Graphic Design", headline: "Campaigns, marketing materials and packaging", price: "" },
      { name: "Business & Consulting", headline: "Sales enablement, offer design and business reviews", price: "" },
      { name: "Content & Social", headline: "A steady system for publishing and community", price: "" }
    ];
    return services.map(function (service) {
      var title = languageValue(service.name, service.nameAr);
      var headline = languageValue(service.headline, service.headlineAr);
      return '<article class="public-service"><h3>' + esc(title) + '</h3><p>' + esc(headline || t("serviceText")) + '</p>' + (service.price ? '<div class="public-service-price">' + esc(service.price) + '</div>' : '') + '</article>';
    }).join("");
  }
  function planCards() {
    var plans = catalog.plans.length ? catalog.plans : [{ name: "Core", price: "EGP 18,000/mo", entitlements: ["Strategy", "Content Plan", "Creative & Design"] }, { name: "Premium", price: "EGP 32,000/mo", entitlements: ["Strategy", "Content Plan", "Creative & Design", "Digital Marketing", "Branding"] }, { name: "Gold", price: "EGP 52,000/mo", entitlements: ["Strategy", "Content Plan", "Creative & Design", "Digital Marketing", "Branding", "Offline Campaigns"] }];
    return plans.slice(0, 3).map(function (plan, index) {
      var entitlements = Array.isArray(plan.entitlements) ? plan.entitlements : parseJson(plan.entitlements);
      var positioning = index === 0 ? local("For businesses building their foundation.", "للبيزنس اللي بيبني أساسه.") : index === 1 ? local("For businesses ready to build a complete growth system.", "للبيزنس الجاهز يبني نظام نمو كامل.") : local("For businesses looking for a deeper growth partnership.", "للبيزنس اللي عايز شراكة نمو أعمق.");
      return '<article class="public-plan ' + (index === 1 ? 'featured' : '') + '">' + (index === 1 ? '<div class="public-plan-badge">' + esc(local("MOST POPULAR", "الأكثر اختيارًا")) + '</div>' : '') + '<h3>' + esc(languageValue(plan.name, plan.nameAr)) + '</h3><p class="public-plan-copy">' + esc(positioning) + '</p><div class="public-plan-price">' + esc(plan.price) + '</div><ul>' + entitlements.slice(0, 5).map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul><a class="public-ghost" href="#diagnostic">' + esc(t("cta")) + ' <span aria-hidden="true">↗</span></a></article>';
    }).join("");
  }
  function pageHtml() {
    var p = t;
    return '<div class="public-site">' +
      '<header class="public-header"><div class="public-shell public-nav"><a href="#top"><img class="public-logo" src="/static/img/witra-logo-new.png" alt="WITRA"></a><button class="public-mobile-menu" id="publicMenu" aria-expanded="false" aria-controls="publicNavLinks">' + (currentLanguage === "en" ? "MENU" : "القائمة") + '</button><nav class="public-nav-links" id="publicNavLinks">' + navLinks() + '</nav><div class="public-nav-actions"><button class="public-lang" id="publicLang">' + (currentLanguage === "en" ? "عربي" : "EN") + '</button><a class="public-ghost" href="/login">' + esc(p("login")) + '</a><a class="public-cta" href="#diagnostic">' + esc(p("cta")) + ' <span aria-hidden="true">↗</span></a></div></div></header>' +
      '<main id="top">' +
      '<section class="public-hero"><div class="public-shell public-hero-inner"><div><div class="public-kicker">' + esc(p("kicker")) + '</div><h1>' + heroHeadline() + '</h1><p class="public-lede">' + esc(p("heroText")) + '</p><div class="public-hero-actions"><a class="public-cta" href="#diagnostic">' + esc(p("cta")) + ' <span aria-hidden="true">↗</span></a><a class="public-ghost" href="#solutions">' + esc(p("explore")) + '</a></div></div><div class="public-system-visual" aria-label="WITRA growth system"><div class="public-system-lines" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div><div class="public-growth-core">GROWTH</div><span class="public-node strategy">STRATEGY</span><span class="public-node brand">BRAND</span><span class="public-node content">CONTENT</span><span class="public-node performance">PERFORMANCE</span><span class="public-node technology">TECHNOLOGY</span></div></div></section>' +
      '<section class="public-section" id="solutions"><div class="public-shell"><div class="public-section-head"><div class="public-eyebrow">' + esc(p("problemEyebrow")) + '</div><h2>' + esc(p("problemTitle")) + '</h2><p>' + esc(p("problemText")) + '</p></div><div class="public-problem-story"><div class="public-flow"><div class="public-flow-panel"><div class="public-flow-label">' + esc(local("Before WITRA", "قبل WITRA")) + '</div><h3>' + esc(local("More activity. Less connection.", "نشاط أكتر. اتصال أقل.")) + '</h3><div class="public-flow-list"><span>Strategy</span><i>↓</i><span>Brand</span><i>↓</i><span>Content</span><i>↓</i><span>Ads</span><i>↓</i><span>Technology</span></div></div><div class="public-flow-panel"><div class="public-flow-label">' + esc(local("The result", "النتيجة")) + '</div><h3>' + esc(local("Disconnected.", "نظام متقطع.")) + '</h3></div></div><div class="public-flow"><div class="public-flow-panel connected"><div class="public-flow-label">' + esc(local("With WITRA", "مع WITRA")) + '</div><h3>' + esc(local("One connected growth system.", "نظام نمو واحد متصل.")) + '</h3><div class="public-flow-list"><span>Strategy</span><i>↘</i><span>Brand</span><i>→</i><span>Content</span><i>→</i><span>Performance</span><i>↗</i><span>Technology</span></div></div><div class="public-flow-panel"><div class="public-flow-label">' + esc(local("The result", "النتيجة")) + '</div><h3>' + esc(local("Growth you can measure.", "نمو تقدر تقيسه.")) + '</h3></div></div></div><div class="public-problem-grid" style="margin-top:48px;">' + p("stats").map(function (stat) { return '<article class="public-stat"><strong>' + esc(stat[0]) + '</strong><p>' + esc(stat[1]) + '</p></article>'; }).join("") + '</div></div></section>' +
      '<section class="public-section public-system-band"><div class="public-shell"><div class="public-section-head"><div class="public-eyebrow">' + esc(p("systemEyebrow")) + '</div><h2>' + esc(p("systemTitle")) + '</h2><p>' + esc(p("systemText")) + '</p></div><div class="public-system-layers">' + [["01", local("Business & Strategy", "البيزنس والاستراتيجية"), local("The diagnosis that gives every next move a job.", "التشخيص اللي بيخلي كل خطوة جاية ليها هدف.")], ["02", local("Paid Advertising", "الإعلانات الممولة"), local("Acquisition built around the offer, not random spend.", "اكتساب عملاء مبني حوالين العرض، مش صرف عشوائي.")], ["03", local("Brand Identity", "هوية البراند"), local("Look and sound like the company you want to become.", "شكل وصوت يليقوا بالشركة اللي عايز تبقى عليها.")], ["04", "SEO", local("Visibility that compounds over time.", "ظهور عضوي يتراكم مع الوقت.")], ["05", local("Video Production", "إنتاج الفيديو"), local("Stories made to earn attention and action.", "قصص معمولة عشان تكسب الانتباه والحركة.")], ["06", local("Content Marketing", "تسويق المحتوى"), local("A steady stream that sounds like you.", "تدفق ثابت من المحتوى بصوتك أنت.")]].map(function (layer) { return '<article class="public-layer"><span class="number">' + layer[0] + '</span><strong>' + esc(layer[1]) + '</strong><small>' + esc(layer[2]) + '</small></article>'; }).join("") + '</div></div></section>' +
      '<section class="public-section" id="operating-model"><div class="public-shell"><div class="public-section-head"><div class="public-eyebrow">' + esc(local("THE OPERATING MODEL", "طريقة التشغيل")) + '</div><h2>' + esc(local("From strategic clarity to measurable growth.", "من وضوح الاستراتيجية لنمو قابل للقياس.")) + '</h2></div><div class="public-operating-model">' + [["01", local("Strategy", "استراتيجية"), local("We define what needs to happen and why.", "بنحدد إيه اللي لازم يحصل وليه.")], ["02", local("Build", "بناء"), local("We create the brand, content and infrastructure.", "بنبني الهوية والمحتوى والبنية الأساسية.")], ["03", local("Activate", "تشغيل"), local("We launch acquisition and marketing systems.", "بنشغل أنظمة التسويق واكتساب العملاء.")], ["04", local("Measure", "قياس"), local("We track what matters and improve the system.", "بنقيس اللي يهم ونحسن النظام.")]].map(function (step) { return '<article class="public-operating-step"><span>' + step[0] + '</span><h3>' + esc(step[1]) + '</h3><p>' + esc(step[2]) + '</p></article>'; }).join("") + '</div></div></section>' +
      '<section class="public-section" id="why-witra"><div class="public-shell"><div class="public-section-head"><div class="public-eyebrow">' + esc(p("whyEyebrow")) + '</div><h2>' + esc(p("whyTitle")) + '</h2></div><div class="public-principles">' + p("principles").map(function (item) { return '<article class="public-principle"><h3>' + esc(item[0]) + '</h3><p>' + esc(item[1]) + '</p></article>'; }).join("") + '</div></div></section>' +
      '<section class="public-section alt" id="services"><div class="public-shell"><div class="public-section-head"><div class="public-eyebrow">' + esc(p("serviceEyebrow")) + '</div><h2>' + esc(p("serviceTitle")) + '</h2><p>' + esc(p("serviceText")) + '</p></div><div class="public-services-grid">' + serviceCards() + '</div></div></section>' +
      '<section class="public-section" id="pricing"><div class="public-shell"><div class="public-section-head"><div class="public-eyebrow">' + esc(p("plansEyebrow")) + '</div><h2>' + esc(p("plansTitle")) + '</h2><p>' + esc(p("plansText")) + '</p></div><div class="public-plans">' + planCards() + '</div></div></section>' +
      '<section class="public-section alt" id="how-it-works"><div class="public-shell"><div class="public-section-head"><div class="public-eyebrow">' + esc(p("processEyebrow")) + '</div><h2>' + esc(p("processTitle")) + '</h2></div><div class="public-process">' + p("process").map(function (step) { return '<article class="public-process-step"><span>' + esc(step[0]) + '</span><h3>' + esc(step[1]) + '</h3><p>' + esc(step[2]) + '</p></article>'; }).join("") + '</div></div></section>' +
      '<section class="public-section public-proof" id="about"><div class="public-shell"><div class="public-section-head"><div class="public-eyebrow">' + esc(p("proofEyebrow")) + '</div><h2>' + esc(p("proofTitle")) + '</h2><p>' + esc(p("proofText")) + '</p></div><div class="public-proof-frame"><div class="public-proof-main"><span>' + esc(local("THE STANDARD", "المعيار")) + '</span><strong>' + esc(local("Verified numbers or nothing published.", "أرقام مؤكدة أو مفيش نشر.")) + '</strong></div><div class="public-proof-note"><h3>' + esc(local("Case studies coming into view.", "قصص النجاح في الطريق.")) + '</h3><p>' + esc(local("Every partnership is documented through situation, diagnosis, system and result. When the numbers are ready, the work will speak for itself.", "كل شراكة بنوثقها من خلال الوضع، التشخيص، النظام والنتيجة. لما الأرقام تجهز، الشغل هيتكلم عن نفسه.")) + '</p></div></div><a class="public-ghost" style="margin-top:28px;" href="#diagnostic">' + esc(p("cta")) + ' <span aria-hidden="true">↗</span></a></div></section>' +
      '<section class="public-section public-final" id="diagnostic"><div class="public-shell public-final-inner"><div class="public-section-head"><div class="public-eyebrow">WITRA</div><h2>' + esc(p("finalTitle")) + '</h2><p>' + esc(p("finalText")) + '</p></div><div class="public-final-actions"><button class="public-cta" id="openDiagnostic">' + esc(p("cta")) + ' <span aria-hidden="true">↗</span></button><a class="public-ghost" href="#solutions">' + esc(p("explore")) + '</a></div></div></section>' +
      '</main><footer class="public-footer"><div class="public-shell public-footer-inner"><div><img src="/static/img/witra-logo-new.png" alt="WITRA"><p>' + esc(p("footer")) + '</p></div><div class="public-footer-columns"><div class="public-footer-column"><strong>' + esc(local("Navigate", "تصفح")) + '</strong><div class="public-footer-links">' + navLinks() + '</div></div><div class="public-footer-column"><strong>' + esc(local("Company", "الشركة")) + '</strong><a href="#about">' + esc(local("About WITRA", "عن WITRA")) + '</a><a href="#diagnostic">' + esc(local("Contact", "تواصل معنا")) + '</a><a href="/login">' + esc(p("login")) + '</a></div><div class="public-footer-column"><strong>' + esc(local("Language", "اللغة")) + '</strong><button class="public-lang" id="footerLang">' + (currentLanguage === "en" ? "العربية" : "English") + '</button></div></div></div></footer></div>';
  }
  function formHtml() {
    return '<div class="public-modal-backdrop" id="diagnosticModal"><div class="public-modal"><button class="public-modal-close" id="closeDiagnostic" aria-label="' + esc(t("close")) + '">×</button><h2>' + esc(t("formTitle")) + '</h2><p>' + esc(t("formText")) + '</p><form id="diagnosticForm"><div class="public-form-grid"><div class="public-form-field"><label>' + (currentLanguage === "ar" ? "الاسم *" : "Name *") + '</label><input name="name" required></div><div class="public-form-field"><label>' + (currentLanguage === "ar" ? "اسم البيزنس *" : "Business name *") + '</label><input name="businessName" required></div><div class="public-form-field"><label>Email *</label><input name="email" type="email" required></div><div class="public-form-field"><label>' + (currentLanguage === "ar" ? "رقم الهاتف / WhatsApp *" : "Phone / WhatsApp *") + '</label><input name="phone" required></div><div class="public-form-field"><label>' + (currentLanguage === "ar" ? "المجال" : "Industry") + '</label><input name="industry"></div><div class="public-form-field"><label>' + (currentLanguage === "ar" ? "حجم الفريق" : "Team size") + '</label><select name="teamSize"><option value="">-</option><option>1-5</option><option>6-20</option><option>21-50</option><option>50+</option></select></div><div class="public-form-field full"><label>' + (currentLanguage === "ar" ? "أكبر تحدي تسويقي عندك *" : "Your biggest marketing challenge *") + '</label><textarea name="challenge" required></textarea></div><div class="public-form-field"><label>' + (currentLanguage === "ar" ? "الميزانية التقريبية" : "Approximate budget") + '</label><select name="budget"><option value="">-</option><option>EGP 8,000 - 15,000</option><option>EGP 18,000 - 32,000</option><option>EGP 52,000+</option><option>Not sure yet</option></select></div><div class="public-form-field"><label>' + (currentLanguage === "ar" ? "موعد مناسب للتواصل" : "Preferred time") + '</label><input name="preferredTime" placeholder="e.g. Sunday afternoon"></div></div><div class="public-form-error" id="diagnosticError"></div><button class="public-cta" type="submit" id="diagnosticSubmit">' + esc(t("submit")) + '</button></form></div></div>';
  }
  function openDiagnostic() { document.body.insertAdjacentHTML("beforeend", formHtml()); bindForm(); }
  function bindForm() {
    document.getElementById("closeDiagnostic").addEventListener("click", function () { document.getElementById("diagnosticModal").remove(); });
    document.getElementById("diagnosticModal").addEventListener("click", function (event) { if (event.target.id === "diagnosticModal") event.currentTarget.remove(); });
    document.getElementById("diagnosticForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      var submit = document.getElementById("diagnosticSubmit");
      var error = document.getElementById("diagnosticError");
      var data = Object.fromEntries(new FormData(form).entries());
      submit.disabled = true; submit.textContent = t("working"); error.textContent = "";
      fetch("/api/public/diagnostic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(body.error || t("error")); return body; }); }).then(function () { form.innerHTML = '<div class="public-success">' + esc(t("success")) + '</div>'; }).catch(function (err) { submit.disabled = false; submit.textContent = t("submit"); error.textContent = err.message || t("error"); });
    });
  }
  function bindPage() {
    document.getElementById("publicLang").addEventListener("click", function () { currentLanguage = currentLanguage === "en" ? "ar" : "en"; localStorage.setItem("witra-public-lang", currentLanguage); document.documentElement.lang = currentLanguage; document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr"; renderPublicSite(); });
    document.getElementById("footerLang").addEventListener("click", function () { document.getElementById("publicLang").click(); });
    document.getElementById("publicMenu").addEventListener("click", function () { var open = document.getElementById("publicNavLinks").classList.toggle("open"); this.setAttribute("aria-expanded", open ? "true" : "false"); });
    window.addEventListener("scroll", function () { var header = document.querySelector(".public-header"); if (header) header.classList.toggle("scrolled", window.scrollY > 12); }, { passive: true });
    var sectionLinks = Array.prototype.slice.call(document.querySelectorAll(".public-nav-links a"));
    var sections = sectionLinks.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
    sectionLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        var target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("publicNavLinks").classList.remove("open");
        document.getElementById("publicMenu").setAttribute("aria-expanded", "false");
      });
    });
    document.querySelectorAll(".public-section, .public-hero-inner").forEach(function (element) { element.classList.add("public-reveal"); if (element.classList.contains("public-hero-inner")) element.classList.add("is-visible"); });
    var revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }); }, { threshold: .14 }) : null;
    document.querySelectorAll(".public-reveal").forEach(function (element) { if (revealObserver) revealObserver.observe(element); else element.classList.add("is-visible"); });
    var activeObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (!entry.isIntersecting) return; sectionLinks.forEach(function (link) { link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id); }); }); }, { rootMargin: "-35% 0px -55%", threshold: 0 }) : null;
    sections.forEach(function (section) { if (activeObserver) activeObserver.observe(section); });
    var processObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add("is-active"); }); }, { threshold: .55 }) : null;
    document.querySelectorAll(".public-process-step").forEach(function (step) { if (processObserver) processObserver.observe(step); });
    document.querySelectorAll(".public-node").forEach(function (node) { node.addEventListener("mouseenter", function () { document.querySelectorAll(".public-node").forEach(function (other) { other.classList.remove("is-selected"); }); node.classList.add("is-selected"); }); node.addEventListener("focus", function () { node.classList.add("is-selected"); }); });
    document.querySelectorAll('a[href="#diagnostic"]').forEach(function (link) { link.addEventListener("click", function (event) { event.preventDefault(); openDiagnostic(); }); });
    document.getElementById("openDiagnostic").addEventListener("click", openDiagnostic);
  }
  function loadCatalog() { return fetch("/api/public/catalog").then(function (response) { return response.ok ? response.json() : catalog; }).then(function (data) { catalog = data || catalog; }); }
  window.renderPublicSite = function () { document.documentElement.lang = currentLanguage; document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr"; document.getElementById("root").innerHTML = pageHtml(); bindPage(); loadCatalog().then(function () { var services = document.querySelector(".public-services-grid"); var plans = document.querySelector(".public-plans"); if (services) services.innerHTML = serviceCards(); if (plans) plans.innerHTML = planCards(); }); };
})();
