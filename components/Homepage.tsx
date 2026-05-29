"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { usePublicLanguage } from "@/app/providers";
import { getProjectCount, getStaticCopy, translateSectionTitle, translateText } from "@/lib/public-i18n";
import Container from "@/components/Container";
import HeroVideo from "@/components/HeroVideo";
import MO3Logo from "@/components/MO3Logo";
import SectionHeading from "@/components/SectionHeading";
import VideoLightbox from "@/components/VideoLightbox";
import type { Client, FAQ, HeroConfig, SectionWithWorks, Stat, Testimonial, Work } from "@/types";

const WorkMap = dynamic(() => import("@/components/WorkMap"), { ssr: false });

const NAV_SECTION_IDS = new Set(["home", "work", "about", "clients", "map", "contact"]);

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

function getSectionIdFromHref(href: string) {
  const hashIndex = href.indexOf("#");
  return hashIndex >= 0 ? href.slice(hashIndex + 1) : href.replace(/^#/, "");
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
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [expandedWorkId, setExpandedWorkId] = useState<string | null>(null);
  const [contactState, setContactState] = useState({
    name: "",
    company: "",
    service: "",
    message: "",
  });

  const statsRef = useRef<HTMLDivElement | null>(null);
  const whatsappHref = getWhatsAppHref(siteConfig.whatsapp);

  function openWork(work: Work | null) {
    if (!work?.videoUrl?.trim()) {
      return;
    }

    setSelectedWork(work);
  }

  function handleWorkCardClick(work: Work) {
    if (isMobileViewport) {
      setExpandedWorkId((current) => (current === work.id ? null : work.id));
      return;
    }

    openWork(work);
  }

  function handleAnchorClick(href: string) {
    const hashIndex = href.indexOf("#");
    const targetSelector = hashIndex >= 0 ? href.slice(hashIndex) : href;
    const target = document.querySelector<HTMLElement>(targetSelector);
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
        name: translateText(language, testimonial.name),
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
    const media = window.matchMedia("(max-width: 767px)");
    const handleViewportChange = () => setIsMobileViewport(media.matches);
    handleViewportChange();
    media.addEventListener("change", handleViewportChange);
    return () => media.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    const sectionElements = Array.from(document.querySelectorAll<HTMLElement>("section[id]")).filter((section) =>
      NAV_SECTION_IDS.has(section.id)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.35, 0.5, 0.7] }
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
    if (!isMobileViewport) {
      setExpandedWorkId(null);
    }
  }, [isMobileViewport]);

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
      title: copy.hero.title,
      subtitle: copy.hero.subtitle,
      ctaLabel: copy.hero.cta,
      ctaLink: whatsappHref || "#contact",
      videoUrl: "",
      posterUrl: null,
      isVisible: true,
    }),
    title: translateText(language, heroConfig?.title ?? copy.hero.title),
    subtitle: translateText(language, heroConfig?.subtitle ?? copy.hero.subtitle),
    ctaLabel: translateText(language, heroConfig?.ctaLabel ?? copy.hero.cta),
  };
  const translatedAboutText = translateText(language, siteConfig.aboutText) || copy.about.body;

  return (
    <main dir={copy.direction} className="relative overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Toaster position={isArabic ? "top-left" : "top-right"} />
      <div className="film-grain" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--color-border)] bg-black/75 backdrop-blur-xl">
        <Container className="flex items-center justify-between gap-4 py-4">
          <a href="/#home" className="flex items-center" onClick={(event) => { event.preventDefault(); handleAnchorClick("/#home"); }}>
            <MO3Logo className="h-10 w-auto sm:h-12" alt={copy.labels.logoAlt} />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {copy.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => handleAnchorClick(item.href)}
                className={`group relative pb-2 text-sm transition-colors duration-300 ${isArabic ? "font-semibold tracking-normal" : "uppercase tracking-[0.28em]"} ${
                  activeSection === getSectionIdFromHref(item.href) ? "text-[#E31212]" : "text-[color:var(--color-gray)] hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute inset-x-0 -bottom-px h-0.5 origin-center rounded-full bg-[#E31212] transition-transform duration-300 ${
                    activeSection === getSectionIdFromHref(item.href) ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLanguage(isArabic ? "en" : "ar")}
              className="btn-secondary hidden text-sm font-semibold text-white transition hover:border-[color:var(--color-primary)] md:inline-flex"
              aria-label={copy.labels.switchLanguage}
            >
              {copy.labels.switchLanguage}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="btn-secondary inline-flex h-11 w-11 items-center justify-center px-0 text-sm font-medium text-white md:hidden"
              aria-label={copy.labels.openMenu}
            >
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <div className="touch-scroll flex h-full flex-col px-0 py-6" onClick={(event) => event.stopPropagation()}>
              <Container className="flex items-center justify-between gap-4">
                <MO3Logo className="h-10 w-auto" alt={copy.labels.logoAlt} />
                <div className="flex items-center gap-3 md:hidden">
                  <button
                    type="button"
                    onClick={() => setLanguage(isArabic ? "en" : "ar")}
                    className="btn-secondary text-sm text-white"
                  >
                    {copy.labels.switchLanguage}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="btn-secondary h-11 w-11 px-0 text-sm text-white"
                  >
                    X
                  </button>
                </div>
              </Container>

              <nav className="mt-8 flex flex-1 flex-col justify-center">
                {copy.nav.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleAnchorClick(item.href)}
                    className={`mobile-menu-link transition-colors duration-300 ${
                      activeSection === getSectionIdFromHref(item.href) ? "text-[#E31212]" : "text-white"
                    }`}
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
            <div className="absolute inset-0">
              <HeroVideo
                url={currentHero.videoUrl}
                posterUrl={currentHero.posterUrl}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,#331010_0%,#120404_45%,#000000_100%)]" />
          )}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.72)_55%,rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,18,18,0.35),transparent_30%)]" />

        <Container className="relative z-10 flex min-h-screen items-end pb-20 pt-28 sm:pb-20 sm:pt-32">
          <div className="max-w-4xl">
            <p className="section-label text-[color:var(--color-gray-light)]">
              {copy.labels.brand}
            </p>
            <h1 className="hero-title mt-5 text-white">
              {currentHero.title}
            </h1>
            <p className="hero-subtitle mt-6 max-w-[32rem] text-[14px] leading-6 text-[color:var(--color-gray-light)] sm:max-w-[600px] sm:text-base sm:leading-7">
              {currentHero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={currentHero.ctaLink}
                target={currentHero.ctaLink.startsWith("http") ? "_blank" : undefined}
                rel={currentHero.ctaLink.startsWith("http") ? "noreferrer" : undefined}
                className={`btn-primary inline-flex w-full items-center justify-center text-sm font-semibold transition hover:bg-[color:var(--color-red-dim)] sm:w-auto ${isArabic ? "" : "uppercase tracking-[0.2em]"}`}
              >
                {currentHero.ctaLabel}
              </a>
              <button
                type="button"
                onClick={() => handleAnchorClick("/#work")}
                className={`btn-secondary inline-flex w-full items-center justify-center bg-black/30 text-sm font-semibold text-white transition hover:border-[color:var(--color-primary)] sm:w-auto ${isArabic ? "" : "uppercase tracking-[0.2em]"}`}
              >
                {copy.work.view}
              </button>
            </div>
          </div>
        </Container>

      </section>

      <section id="about" className="section border-t border-[color:var(--color-border)] bg-[color:var(--background)]">
        <Container>
          <SectionHeading
            label={copy.about.eyebrow}
            title={copy.about.title}
            subtitle={translatedAboutText}
          />
        </Container>
      </section>

      <section className="section border-t border-[color:var(--color-border)] bg-[color:var(--surface)]">
        <Container>
          <SectionHeading
            label={copy.labels.statistics}
            title={copy.labels.statistics}
            subtitle="A quick snapshot of production volume, partnerships, and years in motion."
          />
          <div ref={statsRef} className="mt-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {statsToRender.map((stat) => (
              <div
                key={stat.id}
                className="card-surface p-6"
              >
                <p className="text-[clamp(3rem,15vw,5rem)] font-semibold leading-none text-[color:var(--color-primary)]">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} start={statsVisible} locale={copy.locale} />
                </p>
                <p className={`mt-3 text-[11px] text-[color:var(--color-gray)] ${isArabic ? "font-semibold" : "uppercase tracking-[0.28em]"}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="clients" className="section border-t border-[color:var(--color-border)] bg-[color:var(--surface-strong)]">
        <Container>
          <SectionHeading
            label={copy.clients.eyebrow}
            title={copy.clients.title}
            subtitle="Trusted by brands looking for cinematic craft, fast turnaround, and production discipline."
          />

          <div className="mt-12 space-y-4">
            <div className="relative marquee">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[color:var(--surface-strong)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[color:var(--surface-strong)] to-transparent" />
              <div className="marquee-track gap-3 sm:gap-5">
                {marqueeClients.map((client, index) => (
                  <div
                    key={`client-a-${client.id}-${index}`}
                    className="card-surface group relative flex h-16 w-32 shrink-0 items-center justify-center px-3 sm:h-24 sm:w-44 sm:px-5"
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain p-3 grayscale transition duration-300 group-hover:grayscale-0 sm:p-5"
                      sizes="(max-width: 767px) 128px, 176px"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative marquee">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[color:var(--surface-strong)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[color:var(--surface-strong)] to-transparent" />
              <div className="marquee-track marquee-reverse gap-3 sm:gap-5">
                {marqueeClients.map((client, index) => (
                  <div
                    key={`client-b-${client.id}-${index}`}
                    className="card-surface group relative flex h-16 w-32 shrink-0 items-center justify-center px-3 sm:h-24 sm:w-44 sm:px-5"
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain p-3 grayscale transition duration-300 group-hover:grayscale-0 sm:p-5"
                      sizes="(max-width: 767px) 128px, 176px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="work" className="section border-t border-[color:var(--color-border)] bg-[color:var(--background)]">
        <Container>
          <SectionHeading
            label={copy.work.selected}
            title={copy.work.title}
            subtitle="Explore featured campaigns, branded stories, and vertical reels from across the portfolio."
          />

          <div className="mt-14 space-y-16">
            {translatedSections.map((section) => {
              const isReels = section.slug === "reels" || section.title.toLowerCase().includes("reel");

              return (
                <div key={section.id} className="space-y-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="section-label text-[color:var(--color-gray)]">{isReels ? copy.work.portrait : copy.work.featured}</p>
                      <h3 className="mt-2 text-4xl text-white sm:text-5xl">{section.title}</h3>
                    </div>
                    <span className={`text-sm text-[color:var(--color-primary)] ${isArabic ? "font-semibold" : "uppercase tracking-[0.18em]"}`}>
                      {getProjectCount(section.works.length, language)}
                    </span>
                  </div>

                  <div className={`grid gap-5 ${isReels ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                    {section.works.map((work) => {
                      const isExpanded = expandedWorkId === work.id;

                      return (
                      <article
                        key={work.id}
                        onClick={() => handleWorkCardClick(work)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleWorkCardClick(work);
                          }
                        }}
                        id={`work-card-${work.id}`}
                        tabIndex={0}
                        role="button"
                        aria-expanded={isMobileViewport ? isExpanded : undefined}
                        className="work-card group overflow-hidden text-start transition hover:-translate-y-1 hover:border-[color:var(--color-primary)]"
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
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openWork(work);
                            }}
                            className="btn-primary absolute bottom-4 left-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full px-0 text-lg md:opacity-0 md:transition md:duration-300 md:group-hover:opacity-100"
                            aria-label={`Play ${work.title}`}
                          >
                            &gt;
                          </button>
                        </div>
                        <div className="space-y-3 p-5">
                          <p className="section-label">{work.client || copy.labels.projectFallbackClient}</p>
                          <h4 className="text-xl font-semibold text-white">{work.title}</h4>
                          {work.description ? <p className={`text-sm leading-6 text-[color:var(--color-gray-light)] ${isMobileViewport && !isExpanded ? "line-clamp-2" : ""}`}>{work.description}</p> : null}
                          {isMobileViewport ? (
                            <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ${isExpanded ? "max-h-28 opacity-100" : "max-h-0 opacity-0"}`}>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openWork(work);
                                }}
                                className="btn-secondary mt-2 inline-flex w-full items-center justify-center text-sm font-semibold text-white"
                              >
                                Watch Project
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    )})}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="testimonials" className="section border-t border-[color:var(--color-border)] bg-[color:var(--surface-strong)]">
        <Container>
          <SectionHeading
            label={copy.testimonials.eyebrow}
            title={copy.testimonials.title}
            subtitle="What collaborators say after the brief, the production days, and the final delivery."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonialsToRender.map((testimonial) => (
              <article
                key={testimonial.id}
                className="card-surface p-6"
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
                    <p className="mt-4 text-[clamp(0.875rem,2.5vw,1rem)] leading-7 text-[color:var(--color-gray-light)]">"{testimonial.quote}"</p>
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
        </Container>
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

      <section id="faq" className="section border-t border-[color:var(--color-border)] bg-[color:var(--surface-strong)]">
        <Container>
          <SectionHeading
            label={copy.faq.eyebrow}
            title={copy.faq.title}
            subtitle="Quick answers on scope, process, timelines, and how to start a project with MO3."
          />

          <div className="mt-12 space-y-4">
            {faqsToRender.map((faq) => {
              const open = openFaqId === faq.id;

              return (
                <div key={faq.id} className="card-surface overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(open ? null : faq.id)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-5 text-start sm:px-7"
                  >
                    <span className="whitespace-normal text-base font-semibold text-white sm:text-lg">{faq.question}</span>
                    <span className="text-2xl text-[color:var(--color-primary)]">{open ? "-" : "+"}</span>
                  </button>
                  {open ? (
                    <div className="border-t border-[color:var(--color-border)] px-5 py-5 text-[clamp(0.875rem,2.5vw,1rem)] leading-7 text-[color:var(--color-gray-light)] sm:px-7">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="contact" className="section border-t border-[color:var(--color-border)] bg-[color:var(--background)]">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="section-header items-start text-left">
              <p className="section-label">{copy.contact.eyebrow}</p>
              <h2 className="section-title mt-4 text-white">{copy.contact.title}</h2>
              <div className="section-divider" />
            </div>
            <p className="section-subtitle mt-6 max-w-[600px] text-left">
              {copy.contact.body}
            </p>

            <div className="mobile-social-grid mt-8 gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary inline-flex w-full items-center justify-center bg-[color:var(--surface)] text-sm font-medium text-white transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="admin-card p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)]">
                <span>{copy.contact.name}</span>
                <input
                  required
                  value={contactState.name}
                  onChange={(event) => setContactState((current) => ({ ...current, name: event.target.value }))}
                  className="form-input px-4 py-3"
                  placeholder={copy.contact.namePlaceholder}
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)]">
                <span>{copy.contact.company}</span>
                <input
                  value={contactState.company}
                  onChange={(event) => setContactState((current) => ({ ...current, company: event.target.value }))}
                  className="form-input px-4 py-3"
                  placeholder={copy.contact.companyPlaceholder}
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)] sm:col-span-2">
                <span>{copy.contact.service}</span>
                <input
                  value={contactState.service}
                  onChange={(event) => setContactState((current) => ({ ...current, service: event.target.value }))}
                  className="form-input px-4 py-3"
                  placeholder={copy.contact.servicePlaceholder}
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)] sm:col-span-2">
                <span>{copy.contact.details}</span>
                <textarea
                  required
                  value={contactState.message}
                  onChange={(event) => setContactState((current) => ({ ...current, message: event.target.value }))}
                  className="form-input min-h-[180px] px-4 py-3"
                  placeholder={copy.contact.detailsPlaceholder}
                />
              </label>
            </div>

            <button
              type="submit"
              className={`btn-primary mt-6 inline-flex w-full items-center justify-center text-sm font-semibold transition hover:bg-[color:var(--color-red-dim)] ${isArabic ? "" : "uppercase tracking-[0.2em]"}`}
            >
              {copy.contact.button}
            </button>
          </form>
        </Container>
      </section>

      <footer className="section-sm border-t border-[color:var(--color-border)] bg-black">
        <Container className="flex flex-col gap-3 text-sm text-[color:var(--color-gray)] sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.footer.rights}</p>
          <p>{copy.footer.tagline}</p>
        </Container>
      </footer>

      {selectedWork?.videoUrl ? (
        <VideoLightbox
          url={selectedWork.videoUrl}
          title={selectedWork.title}
          onClose={() => setSelectedWork(null)}
        />
      ) : null}
    </main>
  );
}
