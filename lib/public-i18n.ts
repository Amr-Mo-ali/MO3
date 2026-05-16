export type PublicLanguage = "en" | "ar";

export const PUBLIC_LANGUAGE_STORAGE_KEY = "mo3-public-language";

export const translations = {
  en: {
    "nav.home": "Home",
    "nav.work": "Work",
    "nav.about": "About",
    "nav.clients": "Clients",
    "nav.contact": "Contact",
    "nav.map": "Map",
    "nav.testimonials": "Testimonials",
    "nav.faq": "FAQ",
    "labels.menu": "Menu",
    "labels.close": "Close",
    "labels.openMenu": "Open navigation menu",
    "labels.closeVideo": "Close video",
    "labels.noThumbnail": "No thumbnail",
    "labels.loadingMap": "Loading the map...",
    "labels.noMapProjects": "No mapped projects are available yet.",
    "labels.activeLanguage": "English",
    "labels.switchLanguage": "العربية",
    "labels.brand": "MO3 Production",
    "labels.logoAlt": "MO3 Media Production Logo",
    "labels.projectFallbackClient": "MO3 Production",
    "labels.projects": "Projects",
    "labels.statistics": "Statistics",
    "labels.clientProject": "Client project",
    "work.title": "Stories designed for impact",
    "work.portrait": "Portrait Format",
    "work.featured": "Featured Category",
    "work.selected": "Selected Work",
    "work.view": "View Work",
    "clients.eyebrow": "Clients",
    "clients.title": "Brands that trust MO3",
    "about.eyebrow": "About MO3",
    "about.title": "Premium production with a sharp visual identity.",
    "about.body":
      "MO3 Production develops commercials, reels, branded films, and digital campaigns with a cinematic finish and disciplined execution from concept to delivery.",
    "map.eyebrow": "Global Reach",
    "map.title": "Where The Work Lands",
    "map.body":
      "Every marker represents a real client location connected to a published project in the portfolio. Select a city to jump to that work instantly.",
    "testimonials.eyebrow": "Testimonials",
    "testimonials.title": "What clients say after launch",
    "faq.eyebrow": "FAQ",
    "faq.title": "Everything clients usually ask",
    "contact.eyebrow": "Contact",
    "contact.title": "Let's build the next campaign",
    "contact.body":
      "Send the brief through WhatsApp and MO3 will follow up with timing, scope, and production direction.",
    "contact.name": "Name",
    "contact.company": "Company",
    "contact.service": "Service",
    "contact.details": "Project details",
    "contact.namePlaceholder": "Your name",
    "contact.companyPlaceholder": "Brand or company",
    "contact.servicePlaceholder": "Commercial, reels, post-production...",
    "contact.detailsPlaceholder": "Tell MO3 what you want to produce.",
    "contact.button": "Send on WhatsApp",
    "contact.notProvided": "Not provided",
    "contact.greeting": "Hello MO3 Production,",
    "footer.rights": "© 2026 MO3 Production. All rights reserved.",
    "footer.tagline": "Always dark. Always cinematic.",
    "hero.title": "Cinematic stories built for brands that need to be remembered.",
    "hero.subtitle": "Commercials, reels, branded films, and premium post-production from concept to delivery.",
    "hero.cta": "Start Your Project",
    "stats.videosProduced": "Videos Produced",
    "stats.clients": "Clients",
    "stats.commercials": "Commercials",
    "stats.yearsExperience": "Years Experience",
    "testimonial.fallback.name": "MO3 Client",
    "testimonial.fallback.role": "Marketing Lead",
    "testimonial.fallback.company": "Brand Partner",
    "testimonial.fallback.quote":
      "MO3 brought speed, polish, and sharp creative direction from pre-production through final delivery.",
    "faq.fallback.q1": "What does MO3 handle?",
    "faq.fallback.a1":
      "MO3 can handle creative development, production, editing, color, and delivery for commercials, reels, and branded content.",
    "faq.fallback.q2": "How do we start?",
    "faq.fallback.a2":
      "Send a brief through WhatsApp with the timeline, goals, and deliverables. MO3 will reply with the best next step.",
    "section.commercial-ads": "Commercial Ads",
    "section.reels": "Reels",
    "section.podcast": "Podcast",
    "section.video-clips": "Video Clips",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.work": "الأعمال",
    "nav.about": "من نحن",
    "nav.clients": "العملاء",
    "nav.contact": "تواصل معنا",
    "nav.map": "الخريطة",
    "nav.testimonials": "آراء العملاء",
    "nav.faq": "الأسئلة الشائعة",
    "labels.menu": "القائمة",
    "labels.close": "إغلاق",
    "labels.openMenu": "فتح القائمة",
    "labels.closeVideo": "إغلاق الفيديو",
    "labels.noThumbnail": "لا توجد صورة",
    "labels.loadingMap": "جارٍ تحميل الخريطة...",
    "labels.noMapProjects": "لا توجد مشاريع مفعلة على الخريطة حالياً.",
    "labels.activeLanguage": "العربية",
    "labels.switchLanguage": "English",
    "labels.brand": "MO3 Production",
    "labels.logoAlt": "شعار MO3 للإنتاج الإعلامي",
    "labels.projectFallbackClient": "MO3 Production",
    "labels.projects": "مشاريع",
    "labels.statistics": "الإحصائيات",
    "labels.clientProject": "مشروع عميل",
    "work.title": "قصص مصممة لتترك أثراً",
    "work.portrait": "تنسيق عمودي",
    "work.featured": "فئة مميزة",
    "work.selected": "أعمال مختارة",
    "work.view": "شاهد الأعمال",
    "clients.eyebrow": "العملاء",
    "clients.title": "علامات تثق في MO3",
    "about.eyebrow": "عن MO3",
    "about.title": "إنتاج احترافي بهوية بصرية حادة.",
    "about.body":
      "تطوّر MO3 Production الإعلانات والريلز والأفلام الخاصة بالعلامات والحملات الرقمية بلمسة سينمائية وتنفيذ منظم من الفكرة حتى التسليم.",
    "map.eyebrow": "نطاق العمل",
    "map.title": "أين تصل أعمالنا",
    "map.body":
      "كل علامة تمثل موقع عميل حقيقي مرتبط بمشروع منشور في المعرض. اختر مدينة للانتقال مباشرة إلى هذا العمل.",
    "testimonials.eyebrow": "آراء العملاء",
    "testimonials.title": "ماذا يقول العملاء بعد الإطلاق",
    "faq.eyebrow": "الأسئلة الشائعة",
    "faq.title": "كل ما يسأل عنه العملاء عادة",
    "contact.eyebrow": "تواصل معنا",
    "contact.title": "لنصنع الحملة القادمة",
    "contact.body":
      "أرسل الملخص عبر واتساب وسيتابع فريق MO3 معك بالوقت والنطاق واتجاه التنفيذ.",
    "contact.name": "الاسم",
    "contact.company": "الشركة",
    "contact.service": "الخدمة",
    "contact.details": "تفاصيل المشروع",
    "contact.namePlaceholder": "اسمك",
    "contact.companyPlaceholder": "العلامة أو الشركة",
    "contact.servicePlaceholder": "إعلان، ريلز، ما بعد الإنتاج...",
    "contact.detailsPlaceholder": "أخبر MO3 بما تريد إنتاجه.",
    "contact.button": "أرسل عبر واتساب",
    "contact.notProvided": "غير متوفر",
    "contact.greeting": "مرحباً MO3 Production،",
    "footer.rights": "© 2026 MO3 Production. جميع الحقوق محفوظة.",
    "footer.tagline": "دائماً مظلم. دائماً سينمائي.",
    "hero.title": "قصص سينمائية تُصنع للعلامات التي يجب أن تبقى في الذاكرة.",
    "hero.subtitle": "إعلانات، ريلز، أفلام للعلامات التجارية، وما بعد إنتاج احترافي من الفكرة حتى التسليم.",
    "hero.cta": "ابدأ مشروعك",
    "stats.videosProduced": "فيديوهات تم إنتاجها",
    "stats.clients": "العملاء",
    "stats.commercials": "إعلانات",
    "stats.yearsExperience": "سنوات خبرة",
    "testimonial.fallback.name": "عميل MO3",
    "testimonial.fallback.role": "مدير تسويق",
    "testimonial.fallback.company": "شريك علامة",
    "testimonial.fallback.quote":
      "قدمت MO3 سرعة وجودة واتجاهاً إبداعياً واضحاً من التحضير وحتى التسليم النهائي.",
    "faq.fallback.q1": "ما الذي تقدمه MO3؟",
    "faq.fallback.a1":
      "تتولى MO3 التطوير الإبداعي والإنتاج والمونتاج والتلوين والتسليم للإعلانات والريلز والمحتوى الخاص بالعلامات التجارية.",
    "faq.fallback.q2": "كيف نبدأ؟",
    "faq.fallback.a2":
      "أرسل ملخصاً عبر واتساب يتضمن الجدول الزمني والأهداف والمخرجات، وسيرد فريق MO3 بأفضل خطوة تالية.",
    "section.commercial-ads": "إعلانات تجارية",
    "section.reels": "ريلز",
    "section.podcast": "بودكاست",
    "section.video-clips": "فيديو كليبات",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

const englishValueToKey = Object.entries(translations.en).reduce<Record<string, TranslationKey>>((acc, [key, value]) => {
  acc[value] = key as TranslationKey;
  return acc;
}, {});

export function t(language: PublicLanguage, key: TranslationKey) {
  return translations[language][key];
}

export function translateText(language: PublicLanguage, value: string | null | undefined) {
  if (!value) return value ?? "";
  if (language === "en") return value;

  const key = englishValueToKey[value];
  if (key) {
    return t(language, key);
  }

  return value;
}

export function getProjectCount(count: number, lang: string): string {
  if (lang === "ar") {
    if (count === 0) return "لا توجد مشاريع";
    if (count === 1) return "مشروع واحد";
    if (count === 2) return "مشروعان";
    if (count >= 3 && count <= 10) return `${count} مشاريع`;
    return `${count} مشروع`;
  }

  if (count === 0) return "No Projects";
  if (count === 1) return "1 Project";
  return `${count} Projects`;
}

export function translateSectionTitle(language: PublicLanguage, slug: string, title: string) {
  const sectionKey = `section.${slug}` as TranslationKey;

  if (sectionKey in translations.en) {
    return t(language, sectionKey);
  }

  return translateText(language, title);
}

export function getStaticCopy(language: PublicLanguage) {
  const isArabic = language === "ar";

  return {
    isArabic,
    direction: isArabic ? "rtl" : "ltr",
    locale: isArabic ? "ar-EG" : "en-US",
    nav: [
      { label: t(language, "nav.home"), href: "#home" },
      { label: t(language, "nav.work"), href: "#work" },
      { label: t(language, "nav.about"), href: "#about" },
      { label: t(language, "nav.clients"), href: "#clients" },
      { label: t(language, "nav.map"), href: "#map" },
      { label: t(language, "nav.contact"), href: "#contact" },
    ],
    labels: {
      menu: t(language, "labels.menu"),
      close: t(language, "labels.close"),
      openMenu: t(language, "labels.openMenu"),
      closeVideo: t(language, "labels.closeVideo"),
      noThumbnail: t(language, "labels.noThumbnail"),
      loadingMap: t(language, "labels.loadingMap"),
      noMapProjects: t(language, "labels.noMapProjects"),
      activeLanguage: t(language, "labels.activeLanguage"),
      switchLanguage: t(language, "labels.switchLanguage"),
      brand: t(language, "labels.brand"),
      logoAlt: t(language, "labels.logoAlt"),
      projectFallbackClient: t(language, "labels.projectFallbackClient"),
      projects: t(language, "labels.projects"),
      statistics: t(language, "labels.statistics"),
      clientProject: t(language, "labels.clientProject"),
    },
    work: {
      title: t(language, "work.title"),
      portrait: t(language, "work.portrait"),
      featured: t(language, "work.featured"),
      selected: t(language, "work.selected"),
      view: t(language, "work.view"),
    },
    clients: {
      eyebrow: t(language, "clients.eyebrow"),
      title: t(language, "clients.title"),
    },
    about: {
      eyebrow: t(language, "about.eyebrow"),
      title: t(language, "about.title"),
      body: t(language, "about.body"),
    },
    map: {
      eyebrow: t(language, "map.eyebrow"),
      title: t(language, "map.title"),
      body: t(language, "map.body"),
      clientProject: t(language, "labels.clientProject"),
    },
    testimonials: {
      eyebrow: t(language, "testimonials.eyebrow"),
      title: t(language, "testimonials.title"),
    },
    faq: {
      eyebrow: t(language, "faq.eyebrow"),
      title: t(language, "faq.title"),
    },
    contact: {
      eyebrow: t(language, "contact.eyebrow"),
      title: t(language, "contact.title"),
      body: t(language, "contact.body"),
      name: t(language, "contact.name"),
      company: t(language, "contact.company"),
      service: t(language, "contact.service"),
      details: t(language, "contact.details"),
      namePlaceholder: t(language, "contact.namePlaceholder"),
      companyPlaceholder: t(language, "contact.companyPlaceholder"),
      servicePlaceholder: t(language, "contact.servicePlaceholder"),
      detailsPlaceholder: t(language, "contact.detailsPlaceholder"),
      button: t(language, "contact.button"),
      notProvided: t(language, "contact.notProvided"),
      greeting: t(language, "contact.greeting"),
    },
    footer: {
      rights: t(language, "footer.rights"),
      tagline: t(language, "footer.tagline"),
    },
    hero: {
      title: t(language, "hero.title"),
      subtitle: t(language, "hero.subtitle"),
      cta: t(language, "hero.cta"),
    },
  };
}
