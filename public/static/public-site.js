(function () {
  "use strict";

  var currentLanguage = localStorage.getItem("witra-public-lang") || "en";
  var catalog = { services: [], plans: [] };

  var copy = {
    en: {
      nav: ["The System", "Identity", "Services", "How It Works", "Why WITRA", "Pricing"],
      login: "Login", cta: "Start your journey", explore: "See How WITRA Works",

      heroTitle: "Business Is a System.",
      heroSubtitle: "WITRA Designs Growth Systems.",
      heroSupport: "Businesses don't need more posts — they need commercial systems.",
      heroText: "Stop creating more. Start building what drives growth. WITRA turns business challenges into clear, connected growth systems — Marketing strategy / Plan , creative, digital / Offline marketing, and performance into one system built around your business.",

      problemHeadline: "Most Agencies Sell Activity.\nWITRA Builds the System Behind Growth.",
      problemCopy2: "Random content. Disconnected campaigns. Unclear positioning. Reports full of numbers that don't explain what changed.",
      problemCopy3: "WITRA takes a different approach: diagnose the business first, design the growth system second, then operate and measure what actually matters.",
      problemBeforeTitle: "BEFORE WITRA",
      problemBeforeList: ["Unclear strategy", "Random content", "Disconnected campaigns", "Vanity metrics", "Reactive decisions", "Agency dependency", "Fragmented results"],
      problemWithTitle: "WITH WITRA",
      problemWithList: ["Diagnosed problems", "Clear Strategy", "Connected marketing system", "Business-focused metrics", "Data-led decisions", "Documented processes", "Clear growth roadmap"],

      anatomyEyebrow: "BRAND CONCEPT",
      anatomyHeadline: "The Anatomy of WITRA",
      anatomyItems: [
        ["<img src='/static/img/icon-new-w.png?v=1' style='width: 100%; height: 100%; object-fit: contain;' alt='W'>", "The Letter \"W\"", "Strength, stability and reliability."],
        ["<img src='/static/img/icon-new-y.png?v=1' style='width: 100%; height: 100%; object-fit: contain;' alt='Y'>", "The Letter \"Y\"", "Growth, forward movement and ambition."],
        ["<img src='/static/img/icon-new-tri.png?v=1' style='width: 100%; height: 100%; object-fit: contain;' alt='Triangle'>", "The Triangle", "Direction, focus and innovation."],
        ["<span style='font-family: \"Playfair Display\", serif; font-size: 20px; font-weight: 700; color: var(--w-gold); line-height: 1;'>WIT</span>", "The Core 'Wit'", "Sharp intelligence, strategic thinking, precise execution, and distinctive creative vision."]
      ],



      identityHeadline: "Built on Four Principles.",
      identitySubtitle: "The way we think about business is the way we build marketing.",
      identityVals: [
        ["SHARP", "Precise diagnosis before any prescription.", "We never guess. We analyze, understand, then act."],
        ["SIMPLE", "No jargon. No unnecessary complexity.", "Clear plans. Clear priorities. Clear prices. Clear results."],
        ["UNIQUE", "Every client gets a system designed for their business.", "Never a recycled template disguised as strategy."],
        ["RESULTS", "Weekly metrics. Monthly reviews. Real business impact.", "If it doesn’t move the business forward, it doesn’t belong in the system."]],

      missionHeadline: "From Invisible to Unmissable.",
      missionCopy: "Our mission is to transform Egyptian small and medium businesses from invisible to unmissable — through honest, data-driven marketing systems that generate real revenue, Actionable Business Metrics.",
      missionHighlight: "We measure ourselves by one number: client growth.",
      visionHeadline: "Our Vision",
      visionCopy: "To be the defining growth partner for Egyptian SMEs (Small & medium enterprises), setting the standard for how marketing should operate and generate real impact.",

      servicesHeadline: "The Full Service Stack",
      servicesSubtitle: "FIVE lines of work. One connected system.",
      servicesIntro: "Strategy is only valuable when it can be executed. WITRA connects strategy, marketing, creative, technology, and commercial thinking under one operating system.",
      servicesList: [
        ["01 — BUSINESS CONSULTING", "Marketing and commercial consulting, sales enablement, offer design, and business reviews focused on the numbers that matter."],
        ["02 — MARKETING STRATEGY", "Market & competitor analysis, target-audience definition, positioning, and growth roadmaps built around real business goals."],
        ["03 — BRANDING & IDENTITY", "Brand development, brand strategy, logo design, visual identity systems, and brand guidelines that make businesses recognizable and credible."],
        ["04 — MARKETING & CREATIVE", "Integrated digital and offline marketing, creative design, content, and paid campaigns — built as one connected system to strengthen your brand, engage your audience, and drive measurable growth."],
        ["05 — WEB & MOBILE DEVELOPMENT", "Websites, e-commerce stores, mobile applications, performance optimization, security, and conversion-focused digital experiences."]
      ],

      engineHeadline: "The WITRA Growth System",
      engineSubtitle: "Diagnose. Design. Build. Operate. Measure. Optimize.",
      engineIntro: "Growth doesn't come from isolated campaigns. It comes from a connected system where strategy, creative, execution, data, and optimization work together.",
      engineStages: [
        ["01 — DIAGNOSE", "Find what's actually holding the business back.", "We audit the current marketing, positioning, customer journey, and numbers to diagnose the real bottlenecks."],
        ["02 — DESIGN & STRATEGY", "We build the direction together.", "A founder-level strategy session focused on building the growth architecture around your actual business goals and constraints."],
        ["03 — BUILD", "Strategy becomes execution.", "We create the assets, campaigns, branding, and digital infrastructure that make the strategy real and ready to launch."],
        ["04 — OPERATE", "Run the system with the client — not around the client.", "WITRA operates alongside your team. We don't disappear after the strategy deck; we execute daily and communicate clearly."],
        ["05 — MEASURE", "Using WITRA’s Performance Tracking System.", "We move past vanity metrics to measure real business performance, tracking what truly impacts your bottom line."],
        ["06 — OPTIMIZE", "Learn from the numbers and improve.", "Every month, we review what worked and what didn't. We refine the system continuously to maximize growth and efficiency."]
      ],

      icpHeadline: "Who WITRA Is Built For",
      icpSubtitle: "Not every business needs WITRA. That's intentional.",
      icpA: {
        title: "THE GROWING SME", subtitle: "The Business Owner Who's Tired of Agencies",
        copy: "You've paid for posts, campaigns, and reports. What you actually need is a marketing system connected to the business.",
        suitable: "Clinics • Real Estate • F&B • Academies • Service Businesses • Growing SMEs",
        trigger: "I need marketing that actually brings me clients."
      },
      icpB: {
        title: "THE AMBITIOUS FOUNDER", subtitle: "The Startup Builder",
        copy: "You're building something with potential and need positioning, validation, credibility, and a growth engine that can scale.",
        suitable: "Startups • New Brands • Tech Businesses • Service Startups",
        trigger: "I need to look credible and grow fast with a focused budget."
      },

      uspsHeadline: "Why WITRA",
      uspsSubtitle: "A different operating model for businesses that want more than activity.",
      uspsList: [
        ["01 — DIAGNOSE BEFORE YOU PRESCRIBE™", "Every engagement starts by understanding the business before prescribing the solution.", "We look at the problem before we tell you what to do."],
        ["02 — ONE-TO-ONE CONSULTING", "Founder-level strategy sessions built around real conversations.", "We believe Egyptian business is built on relationships. That's why we work closely, directly, and one-to-one."],
        ["03 — RADICAL REPORTING", "No disappearing act after the campaign launches.", "Weekly numbers. Monthly business reviews. Clear reporting."],
        ["04 — SYSTEMS, NOT CAMPAIGNS", "We don't want your marketing to depend on one campaign.", "We build systems that continue working and improving."],
        ["05 — COPY CRAFT", "Sharp messaging designed for how Egyptian customers actually think, talk, and buy.", "Clear offers. Strong hooks. No artificial translation feel."],
        ["06 — LUXURY EXPERIENCE. SME PRICE.", "Premium thinking, premium design, premium service — packaged for ambitious businesses without unnecessary enterprise overhead."]
      ],

      operateHeadline: "How We Operate",
      operateSubtitle: "Senior-level attention. Direct communication. Transparent numbers. Continuous optimization.",
      operateList: [
        ["ONE-TO-ONE", "Direct access and strategic collaboration."],
        ["DATA-LED", "Decisions backed by numbers, not assumptions."],
        ["CONNECTED", "Strategy, creative, marketing, technology, and commercial thinking working together."]
      ],

      pricingHeadline: "Choose the Level of Growth You Need",
      pricingSubtitle: "Start where your business is. Build from there.",
      pricingPlans: [
        ["BUSINESS CONSULTING", ["Marketing diagnosis", "Strategic consulting", "Commercial direction", "90-Day Action Plan"]],
        ["CORE", ["Strategy", "Content Plan", "Creative & Design", "Digital Marketing"]],
        ["GOLD", ["Strategy", "Content Plan", "Creative & Design", "Digital Marketing", "Branding & Identity"]],
        ["PREMIUM", ["Strategy", "Content Plan", "Creative & Design", "Digital Marketing", "Branding & Identity", "Offline Campaigns"]]
      ],
      contactPricing: "Contact for pricing",

      diagHeadline: "Start With a Diagnosis.",
      diagCopy2: "Tell us where the business is today, where you want it to go, and what's currently getting in the way. We'll start there.",

      footer: "Designing the systems behind business growth.",
      close: "Close", success: "Thank you. Your diagnostic request is with the WITRA team.", submit: "Send Diagnostic Request", formTitle: "Let's Find What Your Business Needs Next.", formText: "A short conversation to understand the business before recommending anything.", required: "Please complete the required fields.", working: "Sending...", error: "Something went wrong. Please try again."
    },
    ar: {
      nav: ["المنظومة", "هويتنا", "الخدمات", "بنشتغل إزاي", "ليه WITRA", "الأسعار"],
      login: "تسجيل الدخول", cta: "ابدأ رحلتك", explore: "اعرف بنشتغل إزاي",

      heroTitle: "البيزنس منظومة.",
      heroSubtitle: "WITRA تبني منظومة النمو.",
      heroSupport: "الشركات مش محتاجة محتوى أكتر؛ محتاجة منظومة تسويق مرتبطة بالبيزنس وبتحقق نمو حقيقي.",
      heroText: "توقف عن مجرد صناعة المزيد، وابدأ في بناء ما يحرك النمو. WITRA تحول تحديات البيزنس إلى منظومات نمو واضحة ومترابطة — من خلال دمج استراتيجية / خطة التسويق، الـ Creative، الـ Digital / Offline Marketing، وقياس الأداء في منظومة واحدة مبنية حول البيزنس الخاص بك.",

      problemHeadline: "معظم الوكالات بتبيع صور / ريلز.\nWITRA بتبني المنظومة وراء النمو.",
      problemCopy2: "محتوى عشوائي. حملات منفصلة. Positioning غير واضح. وتقارير مليانة أرقام من غير ما تقولك إيه اللي اتغير فعلًا.",
      problemCopy3: "WITRA بتشتغل بطريقة مختلفة: نشخّص المشكلة الأول، نبني منظومة النمو ثانيًا، وبعدها ننفّذ ونقيس ونطوّر اللي بيحقق نتيجة حقيقية.",
      problemBeforeTitle: "قبل WITRA",
      problemBeforeList: ["استراتيجية غير واضحة", "محتوى عشوائي", "حملات منفصلة", "أرقام شكلية", "قرارات رد فعل", "اعتماد كامل على الوكالة", "نتائج مشتتة"],
      problemWithTitle: "مع WITRA",
      problemWithList: ["مشكلة واضحة ومُشخّصة", "استراتيجية واضحة", "Marketing System متكامل", "مؤشرات مرتبطة بالبيزنس", "قرارات مبنية على البيانات", "نظام واضح قابل للتطوير", "خطة نمو محددة"],

      anatomyEyebrow: "مفهوم العلامة التجارية",
      anatomyHeadline: "WITRA",
      anatomyItems: [
        ["<img src='/static/img/icon-new-w.png?v=1' style='width: 100%; height: 100%; object-fit: contain;' alt='W'>", 'حرف "W"', "القوة، الاستقرار والاعتمادية."],
        ["<img src='/static/img/icon-new-y.png?v=1' style='width: 100%; height: 100%; object-fit: contain;' alt='Y'>", 'حرف "Y"', "النمو، التقدم للأمام والطموح."],
        ["<img src='/static/img/icon-new-tri.png?v=1' style='width: 100%; height: 100%; object-fit: contain;' alt='Triangle'>", "المثلث", "التوجيه، التركيز والابتكار."],
        ["<span style='font-family: \"Playfair Display\", serif; font-size: 20px; font-weight: 700; color: var(--w-gold); line-height: 1;'>WIT</span>", "جوهر 'Wit'", "الذكاء الحاد، التفكير الاستراتيجي، التنفيذ الدقيق، والرؤية الإبداعية الاستثنائية."]
      ],



      identityHeadline: "أربع مبادئ أصيلة لكل خطوة.",
      identitySubtitle: "رؤية واضحة - هوية حقيقية - طريق واحد للبيزنس والتسويق",
      identityVals: [
        ["SHARP — دقيق", "نشخّص قبل ما نوصف الحل.", "مش بنفترض. بنفهم، نحلّل، وبعدها نتحرك."],
        ["SIMPLE — بسيط", "من غير تعقيد ولا كلام تسويقي فارغ.", "خطة واضحة. أولويات واضحة. أسعار واضحة. نتائج واضحة."],
        ["UNIQUE — مختلف", "كل بيزنس له منظومته الخاصة.", "مش بنعيد استخدام Template ونقدمه على إنه Strategy."],
        ["RESULTS — نتائج", "أرقام أسبوعية. مراجعات شهرية. ونتائج حقيقية للبيزنس.", "لو مش بيحقق أثر حقيقي، ملوش مكان في النظام."]
      ],

      missionHeadline: "من غير ظاهر... إلى مستحيل يتجاهلوه.",
      missionCopy: "مهمتنا إننا نحول الشركات الصغيرة والمتوسطة في مصر من بيزنس غير ظاهر إلى بيزنس واضح، قوي، ومميز في سوقه — من خلال منظومات تسويق مبنية على البيانات وتحقق نمو حقيقي، مش مجرد أرقام شكلية.",
      missionHighlight: "المقياس الوحيد لنجاحنا هو نمو العميل.",
      visionHeadline: "رؤيتنا",
      visionCopy: "أن نكون شريك النمو الأساسي للشركات المصرية الصغيرة والمتوسطة، وأن نضع معياراً جديداً لكيفية عمل وكالات التسويق وتأثيرها الحقيقي.",

      servicesHeadline: "منظومة خدمات متكاملة",
      servicesSubtitle: "خمس خدمات. منظومة واحدة.",
      servicesIntro: "الاستراتيجية قيمتها الحقيقية بتظهر في التنفيذ. عشان كده بنربط الاستراتيجية، التسويق، الـ Creative، التكنولوجيا، والتفكير التجاري داخل منظومة واحدة.",
      servicesList: [
        ["01 — استشارات تجارية (نمو)", "استشارات تسويقية وتجارية، تطوير الـ Offers، دعم المبيعات، ومراجعات دورية تركز على الأرقام التي تؤثر في البيزنس."],
        ["02 — استراتيجية التسويق", "تحليل السوق والمنافسين، تحديد الجمهور، بناء الـ Positioning، ووضع خطط نمو مرتبطة بأهداف البيزنس الحقيقية."],
        ["03 — الهوية والعلامة التجارية", "بناء العلامة التجارية، الاستراتيجية، تصميم الـ Logo، الهوية البصرية، والـ Brand Guidelines."],
        ["04 — التسويق والإبداع", "تسويق رقمي وميداني متكامل، تصميم إبداعي، صناعة محتوى، وحملات مدفوعة — مبنية كمنظومة واحدة لتعزيز علامتك التجارية، التفاعل مع جمهورك، وتحقيق نمو حقيقي."],
        ["05 — تطوير المواقع والتطبيقات", "تصميم وتطوير المواقع، متاجر الـ E-commerce، التطبيقات، وتحسين الأداء والأمان وتجربة المستخدم والتحويلات."]
      ],

      engineHeadline: "منظومة WITRA للنمو",
      engineSubtitle: "نشخّص. نصمّم. نبني. نشغّل. نقيس. نطوّر.",
      engineIntro: "النمو مش نتيجة حملة منفصلة. النمو بيحصل لما الاستراتيجية، والـ Creative، والتنفيذ، والبيانات، والتحسين يشتغلوا مع بعض كمنظومة واحدة.",
      engineStages: [
        ["01 — التشخيص", "نفهم إيه اللي معطّل النمو فعلًا.", "بنراجع التسويق الحالي، الـ Positioning، رحلة العميل، والأرقام عشان نفهم إيه اللي موقف النمو."],
        ["02 — الاستراتيجية والتصميم", "بنحدد الاتجاه ونبني الخطة مع بعض.", "استراتيجية مباشرة لتصميم خطة النمو حول البيزنس الحقيقي، أهدافه، والتحديات اللي بتواجهه."],
        ["03 — بناء المنظومة", "الاستراتيجية تتحول إلى تنفيذ.", "بنطوّر الـ Creative، المحتوى، الـ Branding، والأنظمة المطلوبة لتحويل الخطة لواقع جاهز للانطلاق."],
        ["04 — التنفيذ", "نشغّل المنظومة معاك، مش بعيد عنك.", "مش بنختفي بعد تسليم الخطة. بننفذ الشغل يومياً، نتابع الأداء، ونتواصل بوضوح كجزء من فريقك."],
        ["05 — القياس", "باستخدام نظام تتبع الأداء الخاص بـ WITRA", "بنبعد عن الأرقام الشكلية ونقيس الأداء الحقيقي اللي بيأثر على مبيعاتك ونموك."],
        ["06 — التطوير", "نتعلم من الأرقام ونطوّر اللي بيحقق نتيجة.", "كل شهر بنراجع إيه اللي نجح وإيه اللي محتاج تغيير، وبنحسن الأداء باستمرار لضمان أفضل نتيجة."]
      ],

      icpHeadline: "مين WITRA مناسبة له؟",
      icpSubtitle: "مش كل بيزنس محتاج WITRA. وده مقصود.",
      icpA: {
        title: "بزنس بيحاول يكبر", subtitle: "صاحب البيزنس اللي زهق من الوكالات.",
        copy: "دفعت في Posts وحملات وتقارير، لكن لسه مش شايف العلاقة الواضحة بين الـ Marketing وبين نمو البيزنس؟ أنت مش محتاج نشاط أكتر. أنت محتاج منظومة شغالة مع البيزنس.",
        suitable: "العيادات • العقارات • F&B • الأكاديميات • شركات الخدمات • الشركات الصغيرة والمتوسطة",
        trigger: "أنا محتاج Marketing يجيبلي عملاء فعلًا."
      },
      icpB: {
        title: "المؤسس الطموح", subtitle: "اللي بيبني حاجة تستاهل تكبر.",
        copy: "عندك منتج أو خدمة عندها Potential وعايز تبني Positioning قوي، حضور موثوق، وGrowth Engine يساعدك تكبر؟",
        suitable: "Startups • New Brands • Tech Businesses • Service Startups",
        trigger: "محتاج أبني حضور قوي وأكبر بسرعة من غير ما أهدر الميزانية."
      },

      uspsHeadline: "ليه WITRA؟",
      uspsSubtitle: "طريقة شغل مختلفة لبيزنس عايز أكتر من مجرد نشاط تسويقي.",
      uspsList: [
        ["01 — نشخّص قبل ما نقترح الحل™", "كل تعاون بيبدأ بفهم وتشخيص حقيقي للبيزنس قبل ما نقترح الحل.", "بنشوف المشكلة الأول، وبعدها نقولك إيه اللي محتاج يتعمل."],
        ["02 — استشارات واحد لواحد", "استراتيجية مع حد فاهم البيزنس، مش Meeting مليان كلام تسويقي.", "بنؤمن إن أفضل القرارات بتطلع من نقاش مباشر، عشان كده بنشتغل قريب من العميل وبشكل واحد لواحد."],
        ["03 — تقارير واضحة. بدون تجميل.", "مفيش اختفاء بعد إطلاق الحملة.", "أرقام أسبوعية. مراجعات شهرية. وتقارير واضحة."],
        ["04 — منظومات، مش حملات.", "مش عايزين تسويقك يعتمد على حملة واحدة.", "بنبني أنظمة تستمر في الشغل والتطور."],
        ["05 — أسلوب يفهم السوق", "رسائل تسويقية مصممة بالطريقة اللي العميل المصري بيفكر ويتكلم ويشتري بيها.", "Offers واضحة. Hooks قوية. ومن غير إحساس الترجمة أو الكلام المصطنع."],
        ["06 — تجربة Premium. بتكلفة تناسب الـ SME.", "استراتيجية قوية، Design احترافي، وخدمة على مستوى Senior — من غير تكلفة أو تعقيد أكبر من احتياج البيزنس."]
      ],

      operateHeadline: "طريقة شغلنا",
      operateSubtitle: "اهتمام مباشر. قرارات مبنية على البيانات. ومنظومة مترابطة.",
      operateList: [
        ["واحد لواحد", "تواصل مباشر وتعاون استراتيجي حقيقي."],
        ["بالبيانات", "القرارات مبنية على الأرقام، مش على التوقعات والانطباعات."],
        ["كل حاجة مرتبطة", "الاستراتيجية، الـ Creative، التسويق، التكنولوجيا، والتفكير التجاري بيشتغلوا مع بعض كمنظومة واحدة."]
      ],

      pricingHeadline: "اختار مستوى النمو المناسب لبيزنسك.",
      pricingSubtitle: "ابدأ من احتياجك الحالي، وابني عليه مع نمو البيزنس.",
      pricingPlans: [
        ["استشارات تجارية", ["استشارة تسويقية شاملة", "استراتيجية أعمال", "توجيه تجاري", "خطة عمل لـ 90 يوم"]],
        ["الباقة الأساسية", ["الاستراتيجية", "خطة المحتوى", "التصميم والابتكار", "التسويق الرقمي"]],
        ["الباقة الذهبية", ["الاستراتيجية", "خطة المحتوى", "التصميم والابتكار", "التسويق الرقمي", "الهوية البصرية"]],
        ["الباقة المتميزة", ["الاستراتيجية", "خطة المحتوى", "التصميم والابتكار", "التسويق الرقمي", "الهوية البصرية", "حملات ميدانية (Offline)"]]
      ],
      contactPricing: "تواصل لمعرفة الأسعار",

      diagHeadline: "ابدأ بالتشخيص.",
      diagCopy2: "قولنا البيزنس واقف فين دلوقتي، عايز توصله لفين، وإيه اللي معطّل النمو. ومن هنا نبدأ.",

      footer: "نبني المنظومات اللي بتخلي البيزنس ينمو.",
      close: "إغلاق", success: "شكرًا. فريق WITRA استلم طلب التشخيص.", submit: "إرسال طلب التشخيص", formTitle: "خلينا نحدد البزنس الخاص بيك محتاج أيه؟", formText: "مكالمة قصيرة نفهم فيها البيزنس قبل ما نقترح أي حاجة.", required: "من فضلك أكمل البيانات المطلوبة.", working: "جاري الإرسال...", error: "حصل خطأ. حاول مرة تانية."
    }
  };

  function t(key) { return copy[currentLanguage][key]; }
  function local(en, ar) { return currentLanguage === "ar" ? ar : en; }
  function esc(value) { return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function navLinks() {
    return t("nav").map((label, index) => {
      const ids = ["problem", "identity", "services", "engine", "usps", "pricing"];
      return `<a href="#${ids[index]}">${esc(label)}</a>`;
    }).join("");
  }

  function pageHtml() {
    const p = t;

    return `
      <div class="public-site theme-burgundy">
        
        <header class="public-header">
          <div class="public-header-inner public-nav">
            <a href="#top"><img class="public-logo" src="/static/img/logo-full-color.png?v=2" alt="WITRA"></a>
            <button class="public-mobile-menu" id="publicMenu" aria-expanded="false" aria-controls="publicNavLinks">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <nav class="public-nav-links" id="publicNavLinks">
              ${navLinks()}
            </nav>
            <div class="public-nav-actions">
              <button class="public-lang" id="publicLang">${currentLanguage === "en" ? "AR" : "EN"}</button>
              <a class="public-ghost" href="/login">${esc(p("login"))}</a>
              <a class="public-cta" href="#diagnostic">${esc(p("cta"))}</a>
            </div>
          </div>
        </header>



        <main id="top">
          
          <!-- HERO -->
          <section class="public-section public-hero">
            <div class="hero-bg-glow"></div>
            <div class="public-shell public-hero-inner">
              <div class="public-hero-content">
                <h1>
                  <span class="d-block">${esc(p("heroTitle"))}</span>
                  <span class="d-block text-gold">${esc(p("heroSubtitle"))}</span>
                </h1>
                <p class="hero-support">${esc(p("heroSupport"))}</p>
                <p class="hero-paragraph">${esc(p("heroText"))}</p>
                <div class="public-hero-actions">
                  <a class="public-cta" href="#diagnostic">${esc(p("cta"))}</a>
                  <a class="public-ghost" href="#problem">${esc(p("explore"))}</a>
                </div>
              </div>
            </div>
          </section>

          <!-- MISSION & VISION -->
          <section class="public-section mission-section">
            <div class="public-shell text-center">
              <h2 class="giant-text">${esc(p("missionHeadline"))}</h2>
              <p class="mission-copy">${esc(p("missionCopy"))}</p>
              <div class="vision-block">
                <h3>${esc(p("visionHeadline"))}</h3>
                <p>${esc(p("visionCopy"))}</p>
              </div>
              <p class="mission-highlight">${esc(p("missionHighlight"))}</p>
            </div>
          </section>

          <!-- IDENTITY (VALUES) -->
          <section class="public-section continuous-section" id="identity">
            <div class="public-shell">
              <div class="editorial-head text-center">
                <h2>${esc(p("identityHeadline"))}</h2>
                <p class="lead-text">${esc(p("identitySubtitle"))}</p>
              </div>
              
              <div class="identity-editorial">
                ${p("identityVals").map(val => `
                  <div class="identity-block">
                    <h3>${esc(val[0])}</h3>
                    <strong>${esc(val[1])}</strong>
                    <p>${esc(val[2])}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          </section>

        <!-- ANATOMY SECTION (BRAND CONCEPT) -->
        <section class="continuous-section anatomy-section" id="anatomy">
          <div class="public-shell">
            <div class="editorial-head text-center">
              <p class="lead-text">${esc(p("anatomyEyebrow"))}</p>
              <h2>${esc(p("anatomyHeadline"))}</h2>
            </div>
            
            <div class="anatomy-grid">
              <div class="anatomy-visual public-reveal">
                <img class="anatomy-top-logo" src="/static/img/logo-full-color.png?v=2" alt="WITRA Logo" />
                <div class="anatomy-core-values">
                  <div class="core-value-item">
                    <div class="core-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M22 2l-7 7"/><path d="M17 2h5v5"/></svg></div>
                    <div class="core-text">
                      <h5>STRATEGY</h5>
                      <p>Smart thinking,<br>real results.</p>
                    </div>
                  </div>
                  <div class="core-divider"></div>
                  <div class="core-value-item">
                    <div class="core-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-5 5"/><path d="M18 9v6"/><path d="M18 9h-6"/></svg></div>
                    <div class="core-text">
                      <h5>GROWTH</h5>
                      <p>Scaling brands.<br>Driving success.</p>
                    </div>
                  </div>
                  <div class="core-divider"></div>
                  <div class="core-value-item">
                    <div class="core-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 11v6"/><path d="M19 7l-1 1"/><path d="M6 8L5 7"/><path d="M2 12h1"/><path d="M21 12h1"/><path d="M12 4a6 6 0 0 0-6 6c0 2 1.5 4.5 3 6h6c1.5-1.5 3-4 3-6a6 6 0 0 0-6-6z"/></svg></div>
                    <div class="core-text">
                      <h5>CREATIVITY</h5>
                      <p>Creative ideas,<br>powerful impact.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="anatomy-content public-reveal">
                ${p("anatomyItems").map((item, i) => `
                  <div class="anatomy-item anatomy-anim-${i}">
                    <div class="anatomy-icon">${item[0]}</div>
                    <div class="anatomy-text">
                      <h4>${esc(item[1])}</h4>
                      <p>${esc(item[2])}</p>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </section>

        <!-- THE PROBLEM: COMPARISON -->
        <section class="continuous-section problem-section" id="problem">
            <div class="public-shell">
              <div class="editorial-head">
                <h2 class="pre-line">${esc(p("problemHeadline"))}</h2>
                <p class="lead-text">${esc(p("problemCopy2"))}</p>
                <p class="gold-text">${esc(p("problemCopy3"))}</p>
              </div>
              
              <div class="comparison-layout">
                <div class="comp-col before-col">
                  <h3>${esc(p("problemBeforeTitle"))}</h3>
                  <ul class="clean-list">
                    ${p("problemBeforeList").map(item => `<li>${esc(item)}</li>`).join("")}
                  </ul>
                </div>
                <div class="comp-col with-col">
                  <h3>${esc(p("problemWithTitle"))}</h3>
                  <ul class="clean-list gold-checks">
                    ${p("problemWithList").map(item => `<li>${esc(item)}</li>`).join("")}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- SERVICES -->
          <section class="public-section continuous-section" id="services">
            <div class="public-shell">
              <div class="editorial-head">
                <h2>${esc(p("servicesHeadline"))}</h2>
                <p class="lead-text">${esc(p("servicesSubtitle"))}</p>
                <p class="max-width-text-left">${esc(p("servicesIntro"))}</p>
              </div>
              
              <div class="services-composition">
                ${p("servicesList").map(srv => `
                  <div class="service-block">
                    <h4>${esc(srv[0])}</h4>
                    <p>${esc(srv[1])}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          </section>

          <!-- HOW IT WORKS (Merged Growth System) -->
          <section class="public-section continuous-section" id="engine">
            <div class="public-shell">
              <div class="editorial-head text-center">
                <h2>${esc(p("engineHeadline"))}</h2>
                <p class="lead-text">${esc(p("engineSubtitle"))}</p>
                <p class="max-width-text">${esc(p("engineIntro"))}</p>
              </div>
              
              <div class="timeline-layout">
                ${p("engineStages").map((stage, idx) => `
                  <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <h4>${esc(stage[0])}</h4>
                      <strong>${esc(stage[1])}</strong>
                      <p>${esc(stage[2])}</p>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </section>

          <!-- WHO WE SERVE -->
          <section class="public-section continuous-section" id="icp">
            <div class="public-shell">
              <div class="editorial-head text-center">
                <h2>${esc(p("icpHeadline"))}</h2>
                <p class="lead-text">${esc(p("icpSubtitle"))}</p>
              </div>
              
              <div class="split-layout">
                <div class="split-side">
                  <h3>${esc(p("icpA").title)}</h3>
                  <em class="icp-quote">${esc(p("icpA").subtitle)}</em>
                  <p>${esc(p("icpA").copy)}</p>
                  <div class="icp-meta">
                    <small>${esc(p("icpA").suitable)}</small>
                    <div class="icp-trigger">
                      <span>${esc(currentLanguage === "ar" ? "الدافع:" : "Trigger:")}</span> "${esc(p("icpA").trigger)}"
                    </div>
                  </div>
                </div>
                <div class="split-side">
                  <h3>${esc(p("icpB").title)}</h3>
                  <em class="icp-quote">${esc(p("icpB").subtitle)}</em>
                  <p>${esc(p("icpB").copy)}</p>
                  <div class="icp-meta">
                    <small>${esc(p("icpB").suitable)}</small>
                    <div class="icp-trigger">
                      <span>${esc(currentLanguage === "ar" ? "الدافع:" : "Trigger:")}</span> "${esc(p("icpB").trigger)}"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- WHY WITRA & HOW WE OPERATE (Blended) -->
          <section class="public-section continuous-section" id="usps">
            <div class="public-shell">
              <div class="editorial-head text-center">
                <h2>${esc(p("uspsHeadline"))}</h2>
                <p class="lead-text">${esc(p("uspsSubtitle"))}</p>
              </div>
              
              <div class="usps-editorial-grid">
                ${p("uspsList").map(usp => `
                  <div class="usp-editorial">
                    <h4>${esc(usp[0])}</h4>
                    <strong>${esc(usp[1])}</strong>
                    <p>${esc(usp[2])}</p>
                  </div>
                `).join("")}
              </div>

              <div class="operate-sub-section" style="margin-top: 100px;">
                <div class="editorial-head text-center">
                  <h2>${esc(p("operateHeadline"))}</h2>
                  <p class="lead-text">${esc(p("operateSubtitle"))}</p>
                </div>
                <div class="operate-flex">
                  ${p("operateList").map(op => `
                    <div class="operate-item">
                      <h4>${esc(op[0])}</h4>
                      <p>${esc(op[1])}</p>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </section>

          <!-- PRICING -->
          <section class="public-section continuous-section" id="pricing">
            <div class="public-shell">
              <div class="editorial-head text-center">
                <h2>${esc(p("pricingHeadline"))}</h2>
                <p class="lead-text">${esc(p("pricingSubtitle"))}</p>
              </div>
              
              <div class="pricing-system-grid">
                ${p("pricingPlans").map(plan => `
                  <div class="pricing-block">
                    <h4>${esc(plan[0])}</h4>
                    <ul class="pricing-features">
                      ${plan[1].map(f => '<li>' + esc(f) + '</li>').join("")}
                    </ul>
                    <a href="#diagnostic" class="pricing-label">${esc(p("contactPricing"))}</a>
                  </div>
                `).join("")}
              </div>
            </div>
          </section>

          <!-- FINAL CTA -->
          <section class="public-section continuous-section final-cta-section" id="diagnostic">
            <div class="public-shell text-center">
              <div class="cta-banner">
                <h2 class="giant-text" style="color: var(--w-gold);">${esc(p("diagHeadline"))}</h2>
                ${p("diagCopy") ? `<p class="lead-text" style="margin:24px auto; max-width:600px;">${esc(p("diagCopy"))}</p>` : ''}
                <p style="margin:24px auto 40px; max-width:600px; color: var(--w-muted); font-size: 18px; line-height: 1.6;">${esc(p("diagCopy2"))}</p>
                
                <div class="cta-button-wrapper">
                  <button class="public-cta large-cta shine-effect" id="openDiagnostic">
                    <span class="cta-text">${esc(p("cta"))}</span>
                    <span class="cta-icon">→</span>
                  </button>
                </div>
                ${p("diagSupport") ? `<p class="diag-support" style="margin-top: 16px; font-size: 14px; opacity: 0.6;">${esc(p("diagSupport"))}</p>` : ''}
              </div>
            </div>
          </section>
        </main>

        <footer class="public-footer">
          <div class="public-shell public-footer-inner">
            <div class="footer-brand">
              <img src="/static/img/logo-full-color.png?v=2" alt="WITRA">
              <p>${esc(p("footer"))}</p>
            </div>
            <div class="public-footer-columns">
              <div class="public-footer-column">
                <div class="public-footer-links">
                  ${navLinks()}
                  <a href="/login">${esc(p("login"))}</a>
                </div>
              </div>
              <div class="public-footer-column">
                <a href="#diagnostic" class="footer-cta-link">${esc(p("cta"))} →</a>
                <button class="public-lang footer-lang-btn" id="footerLang">${currentLanguage === "en" ? "العربية" : "English"}</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    `;
  }

  function formHtml() {
    return `
      <div class="public-modal-backdrop" id="diagnosticModal">
        <div class="public-modal">
          <button class="public-modal-close" id="closeDiagnostic" aria-label="${esc(t("close"))}">×</button>
          <h2>${esc(t("formTitle"))}</h2>
          <p>${esc(t("formText"))}</p>
          <form id="diagnosticForm">
            <div class="public-form-grid">
              <div class="public-form-field">
                <label>${currentLanguage === "ar" ? "الاسم *" : "Name *"}</label>
                <input name="name" required>
              </div>
              <div class="public-form-field">
                <label>${currentLanguage === "ar" ? "اسم البيزنس *" : "Business name *"}</label>
                <input name="businessName" required>
              </div>
              <div class="public-form-field">
                <label>Email *</label>
                <input name="email" type="email" required>
              </div>
              <div class="public-form-field">
                <label>${currentLanguage === "ar" ? "رقم الهاتف / WhatsApp *" : "Phone / WhatsApp *"}</label>
                <input name="phone" required>
              </div>
              <div class="public-form-field full">
                <label>${currentLanguage === "ar" ? "أكبر تحدي تسويقي عندك *" : "Your biggest marketing challenge *"}</label>
                <textarea name="challenge" required></textarea>
              </div>
            </div>
            <div class="public-form-error" id="diagnosticError"></div>
            <button class="public-cta" type="submit" id="diagnosticSubmit">${esc(t("submit"))}</button>
          </form>
        </div>
      </div>
    `;
  }

  function openDiagnostic() {
    document.body.insertAdjacentHTML("beforeend", formHtml());
    bindForm();
  }

  function bindForm() {
    document.getElementById("closeDiagnostic").addEventListener("click", () => { document.getElementById("diagnosticModal").remove(); });
    document.getElementById("diagnosticModal").addEventListener("click", (event) => { if (event.target.id === "diagnosticModal") event.currentTarget.remove(); });
    document.getElementById("diagnosticForm").addEventListener("submit", (event) => {
      event.preventDefault();
      var form = event.currentTarget;
      var submit = document.getElementById("diagnosticSubmit");
      var error = document.getElementById("diagnosticError");
      var data = Object.fromEntries(new FormData(form).entries());
      submit.disabled = true;
      submit.textContent = t("working");
      error.textContent = "";

      fetch("/api/public/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(response => {
        return response.json().then(body => {
          if (!response.ok) throw new Error(body.error || t("error"));
          return body;
        });
      }).then(() => {
        form.innerHTML = `<div class="public-success">${esc(t("success"))}</div>`;
      }).catch(err => {
        submit.disabled = false;
        submit.textContent = t("submit");
        error.textContent = err.message || t("error");
      });
    });
  }

  function bindPage() {
    document.getElementById("publicLang").addEventListener("click", () => {
      currentLanguage = currentLanguage === "en" ? "ar" : "en";
      localStorage.setItem("witra-public-lang", currentLanguage);
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
      renderPublicSite();
    });

    document.getElementById("footerLang").addEventListener("click", () => {
      document.getElementById("publicLang").click();
    });

    document.getElementById("publicMenu").addEventListener("click", function () {
      var open = document.getElementById("publicNavLinks").classList.toggle("open");
      this.setAttribute("aria-expanded", open ? "true" : "false");
    });

    window.addEventListener("scroll", () => {
      var header = document.querySelector(".public-header");
      if (header) header.classList.toggle("scrolled", window.scrollY > 12);
    }, { passive: true });

    var sectionLinks = Array.prototype.slice.call(document.querySelectorAll(".public-nav-links a"));
    var sections = sectionLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);

    sectionLinks.forEach(link => {
      link.addEventListener("click", (event) => {
        var href = link.getAttribute("href");
        if (href.startsWith("/")) return; // Login link
        var target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("publicNavLinks").classList.remove("open");
        document.getElementById("publicMenu").setAttribute("aria-expanded", "false");
      });
    });

    document.querySelectorAll(".continuous-section, .mission-section, .public-hero-inner").forEach(element => {
      element.classList.add("public-reveal");
      if (element.classList.contains("public-hero-inner")) element.classList.add("is-visible");
    });

    var revealObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: .1 }) : null;

    document.querySelectorAll(".public-reveal").forEach(element => {
      if (revealObserver) revealObserver.observe(element); else element.classList.add("is-visible");
    });

    var activeObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(link => {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -50%", threshold: 0 }) : null;

    sections.forEach(section => { if (activeObserver) activeObserver.observe(section); });

    document.querySelectorAll('a[href="#diagnostic"]').forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openDiagnostic();
      });
    });

    const diagBtn = document.getElementById("openDiagnostic");
    if (diagBtn) diagBtn.addEventListener("click", openDiagnostic);
  }

  window.renderPublicSite = function () {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.getElementById("root").innerHTML = pageHtml();
    bindPage();
  };
})();
