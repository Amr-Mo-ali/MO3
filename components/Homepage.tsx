"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { usePublicLanguage } from "@/app/providers";
import { getStaticCopy, translateSectionTitle, translateText } from "@/lib/public-i18n";
import MO3Logo from "@/components/MO3Logo";
import VideoLightbox from "@/components/VideoLightbox";
import type { Client, FAQ, HeroConfig, SectionWithWorks, Stat, Testimonial, Work } from "@/types";

const WorkMap = dynamic(() => import("@/components/WorkMap"), { ssr: false });

interface SiteConfigValues {
  aboutText: string;
  whatsapp: string;
  instagram: string;
  behance: string;
  facebook: string;
}

interface HomepageProps {
  siteConfig: SiteConfigValues;
  clients: Client[];
  sections: SectionWithWorks[];
  heroConfig: HeroConfig | null;
  stats: Stat[];
  testimonials: Testimonial[];
  faqs: FAQ[];
}

function makeExternalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function getWhatsAppHref(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

function AnimatedNumber({
  value,
  prefix,
  suffix,
  start,
  locale,
}: {
  value: number;
  prefix?: string | null;
  suffix?: string | null;
  start: boolean;
  locale: string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;

    const duration = 1200;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value]);

  return (
    <span>
      {prefix ?? ""}
      {current.toLocaleString(locale)}
      {suffix ?? ""}
    </span>
  );
}

export default function Homepage({
  siteConfig,
  clients,
  sections,
  heroConfig,
  stats,
  testimonials,
  faqs,
}: HomepageProps) {
  const { language, setLanguage, isArabic } = usePublicLanguage();
  const copy = useMemo(() => getStaticCopy(language), [language]);
  const [selectedWork, setSelectedWork] = useState<(Work & { sectionTitle?: string }) | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [statsVisible, setStatsVisible] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id ?? null);
  const [contactState, setContactState] = useState({
    name: "",
    company: "",
    service: "",
    message: "",
  });

  const statsRef = useRef<HTMLDivElement | null>(null);
  const whatsappHref = getWhatsAppHref(siteConfig.whatsapp);
  const sectionEyebrowClass = isArabic
    ? "text-sm font-semibold text-[color:var(--color-primary)]"
    : "font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-primary)]";
  const mutedEyebrowClass = isArabic
    ? "text-sm font-semibold text-[color:var(--color-gray)]"
    : "font-mono text-[11px] uppercase tracking-[0.35em] text-[color:var(--color-gray)]";

  function openWork(work: Work | null) {
    if (!work?.videoUrl?.trim()) {
      return;
    }

    setSelectedWork(work);
  }

  function handleAnchorClick(href: string) {
    const target = document.querySelector<HTMLElement>(href);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  const translatedSections = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        title: translateSectionTitle(language, section.slug, section.title),
        works: section.works.map((work) => ({
          ...work,
          title: translateText(language, work.title),
          description: translateText(language, work.description),
          locationLabel: translateText(language, work.locationLabel),
          locationCity: translateText(language, work.locationCity),
          locationCountry: translateText(language, work.locationCountry),
        })),
      })),
    [language, sections]
  );

  const allWorks = useMemo(
    () =>
      translatedSections.flatMap((section) =>
        section.works.map((work) => ({
          ...work,
          sectionTitle: section.title,
        }))
      ),
    [translatedSections]
  );

  const socialLinks = useMemo(
    () =>
      [
        { label: "WhatsApp", href: whatsappHref },
        { label: "Instagram", href: makeExternalUrl(siteConfig.instagram) },
        { label: "Behance", href: makeExternalUrl(siteConfig.behance) },
        { label: "Facebook", href: makeExternalUrl(siteConfig.facebook) },
      ].filter((item) => item.href),
    [siteConfig.behance, siteConfig.facebook, siteConfig.instagram, whatsappHref]
  );

  const marqueeClients = useMemo(() => [...clients, ...clients], [clients]);
  const statsToRender = useMemo(
    () =>
      (stats.length
        ? stats
        : [
            { id: "videos", label: "Videos Produced", value: 120, prefix: null, suffix: "+", order: 1, isVisible: true },
            { id: "clients", label: "Clients", value: 45, prefix: null, suffix: "+", order: 2, isVisible: true },
            { id: "commercials", label: "Commercials", value: 65, prefix: null, suffix: "+", order: 3, isVisible: true },
            { id: "years", label: "Years Experience", value: 8, prefix: null, suffix: "+", order: 4, isVisible: true },
          ]
      ).map((stat) => ({
        ...stat,
        label: translateText(language, stat.label),
      })),
    [language, stats]
  );

  const testimonialsToRender = useMemo(
    () =>
      (testimonials.length
        ? testimonials
        : [
            {
              id: "fallback-testimonial",
              name: "MO3 Client",
              role: "Marketing Lead",
              company: "Brand Partner",
              quote: "MO3 brought speed, polish, and sharp creative direction from pre-production through final delivery.",
              rating: 5,
              photo: null,
              order: 1,
              isVisible: true,
            },
          ]
      ).map((testimonial) => ({
        ...testimonial,
        role: translateText(language, testimonial.role),
        company: translateText(language, testimonial.company),
        quote: translateText(language, testimonial.quote),
      })),
    [language, testimonials]
  );

  const faqsToRender = useMemo(
    () =>
      (faqs.length
        ? faqs
        : [
            {
              id: "fallback-faq-1",
              question: "What does MO3 handle?",
              answer: "MO3 can handle creative development, production, editing, color, and delivery for commercials, reels, and branded content.",
              order: 1,
              isVisible: true,
            },
            {
              id: "fallback-faq-2",
              question: "How do we start?",
              answer: "Send a brief through WhatsApp with the timeline, goals, and deliverables. MO3 will reply with the best next step.",
              order: 2,
              isVisible: true,
            },
          ]
      ).map((faq) => ({
        ...faq,
        question: translateText(language, faq.question),
        answer: translateText(language, faq.answer),
      })),
    [faqs, language]
  );

  useEffect(() => {
    const sectionElements = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.2 }
    );

    sectionElements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!openFaqId && faqsToRender[0]?.id) {
      setOpenFaqId(faqsToRender[0].id);
    }
  }, [faqsToRender, openFaqId]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const lines = [
      copy.contact.greeting,
      `${copy.contact.name}: ${contactState.name}`,
      `${copy.contact.company}: ${contactState.company || copy.contact.notProvided}`,
      `${copy.contact.service}: ${contactState.service || copy.contact.notProvided}`,
      `${copy.contact.details}:`,
      contactState.message,
    ];

    if (!whatsappHref) return;
    window.open(`${whatsappHref}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  }

  const currentHero = {
    ...(heroConfig ?? {
      id: "fallback",
      title: "Cinematic stories built for brands that need to be remembered.",
      subtitle: "Commercials, reels, branded films, and premium post-production from concept to delivery.",
      ctaLabel: "Start Your Project",
      ctaLink: whatsappHref || "#contact",
      videoUrl: "",
      posterUrl: null,
      isVisible: true,
    }),
    title: translateText(language, heroConfig?.title ?? "Cinematic stories built for brands that need to be remembered."),
    subtitle: translateText(
      language,
      heroConfig?.subtitle ?? "Commercials, reels, branded films, and premium post-production from concept to delivery."
    ),
    ctaLabel: translateText(language, heroConfig?.ctaLabel ?? "Start Your Project"),
  };

  const translatedAboutText =
    translateText(language, siteConfig.aboutText) ||
    translateText(
      language,
      "MO3 Production develops commercials, reels, branded films, and digital campaigns with a cinematic finish and disciplined execution from concept to delivery."
    );

  return (
    <main dir={copy.direction} className="relative overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Toaster position={isArabic ? "top-left" : "top-right"} />
      <div className="film-grain" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--color-border)] bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="#home" className="flex items-center" onClick={(event) => { event.preventDefault(); handleAnchorClick("#home"); }}>
            <MO3Logo className="h-11 w-auto sm:h-12" />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {copy.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => handleAnchorClick(item.href)}
                className={`text-sm transition ${isArabic ? "font-semibold tracking-normal" : "uppercase tracking-[0.28em]"} ${
                  activeSection === item.href.slice(1) ? "text-white" : "text-[color:var(--color-gray)] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLanguage(isArabic ? "en" : "ar")}
              className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-white transition hover:border-[color:var(--color-primary)]"
              aria-label={copy.labels.switchLanguage}
            >
              {copy.labels.switchLanguage}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-white md:hidden"
              aria-label={copy.labels.openMenu}
            >
              {copy.labels.menu}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 px-6 py-6 md:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <MO3Logo className="h-10 w-auto" />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage(isArabic ? "en" : "ar")}
                    className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-white"
                  >
                    {copy.labels.switchLanguage}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-white"
                  >
                    {copy.labels.close}
                  </button>
                </div>
              </div>

              <nav className="flex flex-1 flex-col justify-center gap-5">
                {copy.nav.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleAnchorClick(item.href)}
                    className={`rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] px-5 py-4 text-center text-xl text-white ${isArabic ? "font-semibold" : "uppercase tracking-[0.2em]"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section id="home" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          {currentHero.videoUrl ? (
            <video
              key={currentHero.videoUrl}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={currentHero.posterUrl ?? undefined}
            >
              <source src={currentHero.videoUrl} />
            </video>
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,#331010_0%,#120404_45%,#000000_100%)]" />
          )}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.72)_55%,rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,18,18,0.35),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-4 pb-16 pt-32 sm:px-6 sm:pb-20">
          <div className="max-w-4xl">
            <p className={isArabic ? "text-sm font-semibold text-[color:var(--color-gray-light)]" : "font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-gray-light)]"}>
              MO3 Production
            </p>
            <h1 className={isArabic ? "mt-5 text-4xl leading-tight text-white sm:text-6xl lg:text-7xl" : "mt-5 text-5xl uppercase leading-[0.9] text-white sm:text-7xl lg:text-[6.5rem]"}>
              {currentHero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--color-gray-light)] sm:text-lg">
              {currentHero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={currentHero.ctaLink}
                target={currentHero.ctaLink.startsWith("http") ? "_blank" : undefined}
                rel={currentHero.ctaLink.startsWith("http") ? "noreferrer" : undefined}
                className={`inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary)] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-red-dim)] ${isArabic ? "" : "uppercase tracking-[0.2em]"}`}
              >
                {currentHero.ctaLabel}
              </a>
              <button
                type="button"
                onClick={() => handleAnchorClick("#work")}
                className={`inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] bg-black/30 px-7 py-3 text-sm font-semibold text-white transition hover:border-[color:var(--color-primary)] ${isArabic ? "" : "uppercase tracking-[0.2em]"}`}
              >
                {copy.work.view}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="border-t border-[color:var(--color-border)] bg-[color:var(--background)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className={sectionEyebrowClass}>{copy.work.selected}</p>
          <h2 className={`mt-4 text-4xl text-white sm:text-6xl ${isArabic ? "" : "uppercase"}`}>{copy.work.title}</h2>

          <div className="mt-14 space-y-16">
            {translatedSections.map((section) => {
              const isReels = section.slug === "reels" || section.title.toLowerCase().includes("reel");

              return (
                <div key={section.id} className="space-y-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className={mutedEyebrowClass}>{isReels ? copy.work.portrait : copy.work.featured}</p>
                      <h3 className={`mt-2 text-3xl text-white sm:text-5xl ${isArabic ? "" : "uppercase"}`}>{section.title}</h3>
                    </div>
                    <span className={`text-sm text-[color:var(--color-primary)] ${isArabic ? "font-semibold" : "uppercase tracking-[0.25em]"}`}>
                      {section.works.length.toLocaleString(copy.locale)} {copy.labels.projects}
                    </span>
                  </div>

                  <div className={`grid gap-5 ${isReels ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                    {section.works.map((work) => (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => openWork(work)}
                        id={`work-card-${work.id}`}
                        className="group overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--surface)] text-start transition hover:-translate-y-1 hover:border-[color:var(--color-primary)]"
                      >
                        <div className={`relative overflow-hidden bg-black ${isReels ? "aspect-[9/16]" : "aspect-[16/9]"}`}>
                          {work.thumbnail ? (
                            <Image
                              src={work.thumbnail}
                              alt={work.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-105"
                              sizes={isReels ? "(max-width: 768px) 100vw, 25vw" : "(max-width: 768px) 100vw, 33vw"}
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-sm text-[color:var(--color-gray)]">{copy.labels.noThumbnail}</div>
                          )}
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.82)_100%)]" />
                        </div>
                        <div className="space-y-3 p-5">
                          <p className={sectionEyebrowClass}>{work.client || "MO3 Production"}</p>
                          <h4 className="text-xl font-semibold text-white">{work.title}</h4>
                          {work.description ? (
                            <p className="line-clamp-2 text-sm leading-6 text-[color:var(--color-gray-light)]">{work.description}</p>
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="clients" className="border-t border-[color:var(--color-border)] bg-[color:var(--surface-strong)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className={sectionEyebrowClass}>{isArabic ? "العملاء" : "Clients"}</p>
          <h2 className={`mt-4 text-4xl text-white sm:text-6xl ${isArabic ? "" : "uppercase"}`}>{copy.clients.title}</h2>

          <div className="mt-12 space-y-5">
            <div className="marquee">
              <div className="marquee-track gap-5">
                {marqueeClients.map((client, index) => (
                  <div
                    key={`client-a-${client.id}-${index}`}
                    className="group relative flex h-24 w-44 shrink-0 items-center justify-center rounded-[28px] border border-[color:var(--color-border)] bg-black px-5"
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain p-5 grayscale transition duration-300 group-hover:grayscale-0"
                      sizes="176px"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="marquee">
              <div className="marquee-track marquee-reverse gap-5">
                {marqueeClients.map((client, index) => (
                  <div
                    key={`client-b-${client.id}-${index}`}
                    className="group relative flex h-24 w-44 shrink-0 items-center justify-center rounded-[28px] border border-[color:var(--color-border)] bg-black px-5"
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain p-5 grayscale transition duration-300 group-hover:grayscale-0"
                      sizes="176px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-[color:var(--color-border)] bg-[color:var(--background)] px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className={sectionEyebrowClass}>{copy.about.eyebrow}</p>
            <h2 className={`mt-4 text-4xl leading-tight text-white sm:text-6xl ${isArabic ? "" : "uppercase"}`}>{copy.about.title}</h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:var(--color-gray-light)]">
              {translatedAboutText}
            </p>
          </div>

          <div ref={statsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {statsToRender.map((stat) => (
              <div
                key={stat.id}
                className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6"
              >
                <p className="text-4xl font-semibold text-[color:var(--color-primary)] sm:text-5xl">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} start={statsVisible} locale={copy.locale} />
                </p>
                <p className={`mt-3 text-sm text-[color:var(--color-gray)] ${isArabic ? "font-semibold" : "uppercase tracking-[0.28em]"}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorkMap
        works={allWorks}
        onSelectWork={(workId) => {
          const work = allWorks.find((item) => item.id === workId) ?? null;
          openWork(work);
          const card = document.getElementById(`work-card-${workId}`);
          card?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        language={language}
      />

      <section id="testimonials" className="border-t border-[color:var(--color-border)] bg-[color:var(--surface-strong)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className={sectionEyebrowClass}>{isArabic ? "آراء العملاء" : "Testimonials"}</p>
          <h2 className={`mt-4 text-4xl text-white sm:text-6xl ${isArabic ? "" : "uppercase"}`}>{copy.testimonials.title}</h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonialsToRender.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6"
              >
                <div className="flex items-start gap-4">
                  {testimonial.photo ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[color:var(--color-border)]">
                      <Image src={testimonial.photo} alt={testimonial.name} fill className="object-cover" sizes="56px" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-black text-lg font-semibold text-[color:var(--color-primary)]">
                      {testimonial.name.slice(0, 1)}
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap gap-1 text-[color:var(--color-primary)]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index}>{index < testimonial.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <p className="mt-4 text-base leading-7 text-[color:var(--color-gray-light)]">"{testimonial.quote}"</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-[color:var(--color-border)] pt-4">
                  <p className="text-lg font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-[color:var(--color-gray)]">
                    {testimonial.role} - {testimonial.company}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-[color:var(--color-border)] bg-[color:var(--surface-strong)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className={sectionEyebrowClass}>{isArabic ? "الأسئلة الشائعة" : "FAQ"}</p>
          <h2 className={`mt-4 text-4xl text-white sm:text-6xl ${isArabic ? "" : "uppercase"}`}>{copy.faq.title}</h2>

          <div className="mt-12 space-y-4">
            {faqsToRender.map((faq) => {
              const open = openFaqId === faq.id;

              return (
                <div key={faq.id} className="overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--surface)]">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(open ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start sm:px-7"
                  >
                    <span className="text-lg font-semibold text-white">{faq.question}</span>
                    <span className="text-2xl text-[color:var(--color-primary)]">{open ? "-" : "+"}</span>
                  </button>
                  {open ? (
                    <div className="border-t border-[color:var(--color-border)] px-5 py-5 text-sm leading-7 text-[color:var(--color-gray-light)] sm:px-7">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-[color:var(--color-border)] bg-[color:var(--background)] px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className={sectionEyebrowClass}>{copy.contact.eyebrow}</p>
            <h2 className={`mt-4 text-4xl text-white sm:text-6xl ${isArabic ? "" : "uppercase"}`}>{copy.contact.title}</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[color:var(--color-gray-light)]">
              {copy.contact.body}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--surface)] px-5 py-3 text-sm font-medium text-white transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--surface)] p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)]">
                <span>{copy.contact.name}</span>
                <input
                  required
                  value={contactState.name}
                  onChange={(event) => setContactState((current) => ({ ...current, name: event.target.value }))}
                  className="rounded-2xl px-4 py-3"
                  placeholder={copy.contact.namePlaceholder}
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)]">
                <span>{copy.contact.company}</span>
                <input
                  value={contactState.company}
                  onChange={(event) => setContactState((current) => ({ ...current, company: event.target.value }))}
                  className="rounded-2xl px-4 py-3"
                  placeholder={copy.contact.companyPlaceholder}
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)] sm:col-span-2">
                <span>{copy.contact.service}</span>
                <input
                  value={contactState.service}
                  onChange={(event) => setContactState((current) => ({ ...current, service: event.target.value }))}
                  className="rounded-2xl px-4 py-3"
                  placeholder={copy.contact.servicePlaceholder}
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)] sm:col-span-2">
                <span>{copy.contact.details}</span>
                <textarea
                  required
                  value={contactState.message}
                  onChange={(event) => setContactState((current) => ({ ...current, message: event.target.value }))}
                  className="min-h-[180px] rounded-[24px] px-4 py-3"
                  placeholder={copy.contact.detailsPlaceholder}
                />
              </label>
            </div>

            <button
              type="submit"
              className={`mt-6 inline-flex w-full items-center justify-center rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-red-dim)] ${isArabic ? "" : "uppercase tracking-[0.2em]"}`}
            >
              {copy.contact.button}
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-[color:var(--color-border)] bg-black px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[color:var(--color-gray)] sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.footer.rights}</p>
          <p>{copy.footer.tagline}</p>
        </div>
      </footer>

      <VideoLightbox work={selectedWork} onClose={() => setSelectedWork(null)} />
    </main>
  );
}
