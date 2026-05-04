export type PublicLanguage = "en" | "ar";

export const PUBLIC_LANGUAGE_STORAGE_KEY = "mo3-public-language";

const ARABIC_TEXT_MAP: Record<string, string> = {
  Home: "الرئيسية",
  Work: "الأعمال",
  Clients: "العملاء",
  About: "من نحن",
  Testimonials: "آراء العملاء",
  FAQ: "الأسئلة الشائعة",
  Contact: "تواصل معنا",
  Menu: "القائمة",
  Close: "إغلاق",
  "View Work": "شاهد الأعمال",
  "Selected Work": "أعمال مختارة",
  "Stories designed for impact": "قصص مصممة لتترك أثراً",
  "Portrait Format": "تنسيق عمودي",
  "Featured Category": "فئة مميزة",
  Projects: "مشاريع",
  "Brands that trust MO3": "علامات تثق في MO3",
  "About MO3": "عن MO3",
  "Premium production with a sharp visual identity.": "إنتاج احترافي بهوية بصرية حادة.",
  "Videos Produced": "فيديوهات تم إنتاجها",
  Commercials: "إعلانات",
  "Years Experience": "سنوات خبرة",
  "Global Reach": "نطاق العمل",
  "Where The Work Lands": "أين تصل أعمالنا",
  "Every marker represents a real client location connected to a published project in the portfolio. Select a city to jump to that work instantly.":
    "كل علامة تمثل موقع عميل حقيقي مرتبط بمشروع منشور في المعرض. اختر مدينة للانتقال مباشرة إلى هذا العمل.",
  "Client project": "مشروع عميل",
  "Loading the map...": "جارٍ تحميل الخريطة...",
  "What clients say after launch": "ماذا يقول العملاء بعد الإطلاق",
  "Everything clients usually ask": "كل ما يسأل عنه العملاء عادة",
  "Let's build the next campaign": "لنصنع الحملة القادمة",
  "Send the brief through WhatsApp and MO3 will follow up with timing, scope, and production direction.":
    "أرسل الملخص عبر واتساب وسيتابع فريق MO3 معك بالوقت والنطاق واتجاه التنفيذ.",
  Name: "الاسم",
  Company: "الشركة",
  Service: "الخدمة",
  "Project details": "تفاصيل المشروع",
  "Your name": "اسمك",
  "Brand or company": "العلامة أو الشركة",
  "Commercial, reels, post-production...": "إعلان، ريلز، ما بعد الإنتاج...",
  "Tell MO3 what you want to produce.": "أخبر MO3 بما تريد إنتاجه.",
  "Send on WhatsApp": "أرسل عبر واتساب",
  "All rights reserved.": "جميع الحقوق محفوظة.",
  "Always dark. Always cinematic.": "دائماً مظلم. دائماً سينمائي.",
  "No thumbnail": "لا توجد صورة",
  "No mapped projects are available yet.": "لا توجد مشاريع مفعلة على الخريطة حالياً.",
  "Test Hero": "واجهة تجريبية",
  Start: "ابدأ",
  "Commercial Ads": "إعلانات تجارية",
  Reels: "ريلز",
  Podcast: "بودكاست",
  "Video Clips": "فيديو كليبات",
  "Start Your Project": "ابدأ مشروعك",
  "Cinematic stories built for brands that need to be remembered.":
    "قصص سينمائية تُصنع للعلامات التي يجب أن تبقى في الذاكرة.",
  "Commercials, reels, branded films, and premium post-production from concept to delivery.":
    "إعلانات، ريلز، أفلام للعلامات التجارية، وما بعد إنتاج احترافي من الفكرة حتى التسليم.",
  "MO3 brought speed, polish, and sharp creative direction from pre-production through final delivery.":
    "قدمت MO3 سرعة وجودة واتجاهاً إبداعياً واضحاً من التحضير وحتى التسليم النهائي.",
  "What does MO3 handle?": "ما الذي تقدمه MO3؟",
  "MO3 can handle creative development, production, editing, color, and delivery for commercials, reels, and branded content.":
    "تتولى MO3 التطوير الإبداعي والإنتاج والمونتاج والتلوين والتسليم للإعلانات والريلز والمحتوى الخاص بالعلامات التجارية.",
  "How do we start?": "كيف نبدأ؟",
  "Send a brief through WhatsApp with the timeline, goals, and deliverables. MO3 will reply with the best next step.":
    "أرسل ملخصاً عبر واتساب يتضمن الجدول الزمني والأهداف والمخرجات، وسيرد فريق MO3 بأفضل خطوة تالية.",
  "At MO3, we believe in the power of stories. Born from a passion for visual storytelling, we are more than a media company - we are architects of emotion.":
    "في MO3 نؤمن بقوة الحكايات. انطلقنا من شغف بالسرد البصري، ولسنا مجرد شركة إعلامية بل صناع للمشاعر.",
  "MO3 Production develops commercials, reels, branded films, and digital campaigns with a cinematic finish and disciplined execution from concept to delivery.":
    "تطوّر MO3 Production الإعلانات والريلز والأفلام الخاصة بالعلامات والحملات الرقمية بلمسة سينمائية وتنفيذ منظم من الفكرة حتى التسليم.",
  "Hello MO3 Production,": "مرحباً MO3 Production،",
  "Not provided": "غير متوفر",
};

export function translateText(language: PublicLanguage, value: string | null | undefined) {
  if (!value) return value ?? "";
  if (language === "en") return value;
  return ARABIC_TEXT_MAP[value] ?? value;
}

export function translateSectionTitle(language: PublicLanguage, slug: string, title: string) {
  if (language === "en") return title;

  const sectionMap: Record<string, string> = {
    "commercial-ads": "إعلانات تجارية",
    reels: "ريلز",
    podcast: "بودكاست",
    "video-clips": "فيديو كليبات",
  };

  return sectionMap[slug] ?? translateText(language, title);
}

export function getStaticCopy(language: PublicLanguage) {
  const isArabic = language === "ar";

  return {
    isArabic,
    direction: isArabic ? "rtl" : "ltr",
    locale: isArabic ? "ar-EG" : "en-US",
    nav: [
      { label: isArabic ? "الرئيسية" : "Home", href: "#home" },
      { label: isArabic ? "الأعمال" : "Work", href: "#work" },
      { label: isArabic ? "العملاء" : "Clients", href: "#clients" },
      { label: isArabic ? "من نحن" : "About", href: "#about" },
      { label: isArabic ? "آراء العملاء" : "Testimonials", href: "#testimonials" },
      { label: isArabic ? "الأسئلة الشائعة" : "FAQ", href: "#faq" },
      { label: isArabic ? "تواصل معنا" : "Contact", href: "#contact" },
    ],
    labels: {
      menu: isArabic ? "القائمة" : "Menu",
      close: isArabic ? "إغلاق" : "Close",
      openMenu: isArabic ? "فتح القائمة" : "Open navigation menu",
      noThumbnail: isArabic ? "لا توجد صورة" : "No thumbnail",
      loadingMap: isArabic ? "جارٍ تحميل الخريطة..." : "Loading the map...",
      noMapProjects: isArabic ? "لا توجد مشاريع مفعلة على الخريطة حالياً." : "No mapped projects are available yet.",
      activeLanguage: isArabic ? "العربية" : "English",
      switchLanguage: isArabic ? "English" : "العربية",
      projects: isArabic ? "مشاريع" : "Projects",
    },
    work: {
      title: isArabic ? "قصص مصممة لتترك أثراً" : "Stories designed for impact",
      portrait: isArabic ? "تنسيق عمودي" : "Portrait Format",
      featured: isArabic ? "فئة مميزة" : "Featured Category",
      selected: isArabic ? "أعمال مختارة" : "Selected Work",
      view: isArabic ? "شاهد الأعمال" : "View Work",
    },
    clients: {
      title: isArabic ? "علامات تثق في MO3" : "Brands that trust MO3",
    },
    about: {
      eyebrow: isArabic ? "عن MO3" : "About MO3",
      title: isArabic ? "إنتاج احترافي بهوية بصرية حادة." : "Premium production with a sharp visual identity.",
    },
    map: {
      eyebrow: isArabic ? "نطاق العمل" : "Global Reach",
      title: isArabic ? "أين تصل أعمالنا" : "Where The Work Lands",
      body: isArabic
        ? "كل علامة تمثل موقع عميل حقيقي مرتبط بمشروع منشور في المعرض. اختر مدينة للانتقال مباشرة إلى هذا العمل."
        : "Every marker represents a real client location connected to a published project in the portfolio. Select a city to jump to that work instantly.",
      clientProject: isArabic ? "مشروع عميل" : "Client project",
    },
    testimonials: {
      title: isArabic ? "ماذا يقول العملاء بعد الإطلاق" : "What clients say after launch",
    },
    faq: {
      title: isArabic ? "كل ما يسأل عنه العملاء عادة" : "Everything clients usually ask",
    },
    contact: {
      eyebrow: isArabic ? "تواصل معنا" : "Contact",
      title: isArabic ? "لنصنع الحملة القادمة" : "Let's build the next campaign",
      body: isArabic
        ? "أرسل الملخص عبر واتساب وسيتابع فريق MO3 معك بالوقت والنطاق واتجاه التنفيذ."
        : "Send the brief through WhatsApp and MO3 will follow up with timing, scope, and production direction.",
      name: isArabic ? "الاسم" : "Name",
      company: isArabic ? "الشركة" : "Company",
      service: isArabic ? "الخدمة" : "Service",
      details: isArabic ? "تفاصيل المشروع" : "Project details",
      namePlaceholder: isArabic ? "اسمك" : "Your name",
      companyPlaceholder: isArabic ? "العلامة أو الشركة" : "Brand or company",
      servicePlaceholder: isArabic ? "إعلان، ريلز، ما بعد الإنتاج..." : "Commercial, reels, post-production...",
      detailsPlaceholder: isArabic ? "أخبر MO3 بما تريد إنتاجه." : "Tell MO3 what you want to produce.",
      button: isArabic ? "أرسل عبر واتساب" : "Send on WhatsApp",
      notProvided: isArabic ? "غير متوفر" : "Not provided",
      greeting: isArabic ? "مرحباً MO3 Production،" : "Hello MO3 Production,",
    },
    footer: {
      rights: isArabic ? "© 2026 MO3 Production. جميع الحقوق محفوظة." : "© 2026 MO3 Production. All rights reserved.",
      tagline: isArabic ? "دائماً مظلم. دائماً سينمائي." : "Always dark. Always cinematic.",
    },
  };
}
