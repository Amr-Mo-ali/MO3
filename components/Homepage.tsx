"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import MO3Logo from "@/components/MO3Logo";
import VideoLightbox from "@/components/VideoLightbox";
import type {
  ActiveGovernorate,
  Client,
  FAQ,
  HeroConfig,
  SectionWithWorks,
  Stat,
  Testimonial,
  Work,
} from "@/types";
import { EGYPT_GOVERNORATES } from "@/lib/governorates";

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
  activeGovernorates: ActiveGovernorate[];
}

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

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
}: {
  value: number;
  prefix?: string | null;
  suffix?: string | null;
  start: boolean;
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
      {current.toLocaleString()}
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
  activeGovernorates,
}: HomepageProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
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

  function openWork(work: Work | null) {
    if (!work?.videoUrl?.trim()) {
      return;
    }

    setSelectedWork(work);
  }

  const allWorks = useMemo(
    () =>
      sections.flatMap((section) =>
        section.works.map((work) => ({
          ...work,
          sectionTitle: section.title,
        }))
      ),
    [sections]
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
  const activeGovernorateSet = useMemo(
    () => new Set(activeGovernorates.map((item) => item.slug)),
    [activeGovernorates]
  );
  const statsToRender = stats.length
    ? stats
    : [
        { id: "videos", label: "Videos Produced", value: 120, prefix: null, suffix: "+", order: 1, isVisible: true },
        { id: "clients", label: "Clients", value: 45, prefix: null, suffix: "+", order: 2, isVisible: true },
        { id: "commercials", label: "Commercials", value: 65, prefix: null, suffix: "+", order: 3, isVisible: true },
        { id: "years", label: "Years Experience", value: 8, prefix: null, suffix: "+", order: 4, isVisible: true },
      ];
  const testimonialsToRender = testimonials.length
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
      ];
  const faqsToRender = faqs.length
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
      ];

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
      "Hello MO3 Production,",
      `Name: ${contactState.name}`,
      `Company: ${contactState.company || "Not provided"}`,
      `Service: ${contactState.service || "Not provided"}`,
      "Project details:",
      contactState.message,
    ];

    const target = whatsappHref || "#";
    if (!target || target === "#") return;

    window.open(`${target}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  }

  const currentHero = heroConfig ?? {
    id: "fallback",
    title: "Cinematic stories built for brands that need to be remembered.",
    subtitle: "Commercials, reels, branded films, and premium post-production from concept to delivery.",
    ctaLabel: "Start Your Project",
    ctaLink: whatsappHref || "#contact",
    videoUrl: "",
    posterUrl: null,
    isVisible: true,
  };

  return (
    <main className="relative overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Toaster position="top-right" />
      <div className="film-grain" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--color-border)] bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="#home" className="flex items-center">
            <MO3Logo className="h-11 w-auto sm:h-12" />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm uppercase tracking-[0.28em] transition ${
                  activeSection === item.href.slice(1) ? "text-white" : "text-[color:var(--color-gray)] hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-white md:hidden"
            aria-label="Open navigation menu"
          >
            Menu
          </button>
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
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-white"
                >
                  Close
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center gap-5">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] px-5 py-4 text-center text-xl uppercase tracking-[0.2em] text-white"
                  >
                    {item.label}
                  </a>
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
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-gray-light)]">
              MO3 Production
            </p>
            <h1 className="mt-5 text-5xl uppercase leading-[0.9] text-white sm:text-7xl lg:text-[6.5rem]">
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
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary)] px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[color:var(--color-red-dim)]"
              >
                {currentHero.ctaLabel}
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] bg-black/30 px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[color:var(--color-primary)]"
              >
                View Work
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="border-t border-[color:var(--color-border)] bg-[color:var(--background)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-primary)]">Selected Work</p>
          <h2 className="mt-4 text-4xl uppercase text-white sm:text-6xl">Stories designed for impact</h2>

          <div className="mt-14 space-y-16">
            {sections.map((section) => {
              const isReels = section.slug === "reels" || section.title.toLowerCase().includes("reel");

              return (
                <div key={section.id} className="space-y-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[color:var(--color-gray)]">
                        {isReels ? "Portrait Format" : "Featured Category"}
                      </p>
                      <h3 className="mt-2 text-3xl uppercase text-white sm:text-5xl">{section.title}</h3>
                    </div>
                    <span className="text-sm uppercase tracking-[0.25em] text-[color:var(--color-primary)]">
                      {section.works.length} Projects
                    </span>
                  </div>

                  <div className={`grid gap-5 ${isReels ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                    {section.works.map((work) => (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => openWork(work)}
                        id={`work-card-${work.id}`}
                        className="group overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--surface)] text-left transition hover:-translate-y-1 hover:border-[color:var(--color-primary)]"
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
                            <div className="grid h-full place-items-center text-sm text-[color:var(--color-gray)]">No thumbnail</div>
                          )}
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.82)_100%)]" />
                        </div>
                        <div className="space-y-3 p-5">
                          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-primary)]">
                            {work.client || "MO3 Production"}
                          </p>
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
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-primary)]">Clients</p>
          <h2 className="mt-4 text-4xl uppercase text-white sm:text-6xl">Brands that trust MO3</h2>

          <div className="mt-12 space-y-5">
            <div className="marquee">
              <div className="marquee-track gap-5">
                {marqueeClients.map((client, index) => (
                  <div
                    key={`client-a-${client.id}-${index}`}
                    className="group relative flex h-24 w-44 shrink-0 items-center justify-center rounded-[28px] border border-[color:var(--color-border)] bg-black px-5"
                  >
                    {client.logo ? (
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        className="object-contain p-5 grayscale transition duration-300 group-hover:grayscale-0"
                        sizes="176px"
                      />
                    ) : (
                      <span className="text-sm text-[color:var(--color-gray-light)]">{client.name}</span>
                    )}
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
                    {client.logo ? (
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        className="object-contain p-5 grayscale transition duration-300 group-hover:grayscale-0"
                        sizes="176px"
                      />
                    ) : (
                      <span className="text-sm text-[color:var(--color-gray-light)]">{client.name}</span>
                    )}
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
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-primary)]">About MO3</p>
            <h2 className="mt-4 text-4xl uppercase leading-tight text-white sm:text-6xl">
              Premium production with a sharp visual identity.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:var(--color-gray-light)]">
              {siteConfig.aboutText ||
                "MO3 Production develops commercials, reels, branded films, and digital campaigns with a cinematic finish and disciplined execution from concept to delivery."}
            </p>
          </div>

          <div ref={statsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {statsToRender.map((stat) => (
              <div
                key={stat.id}
                className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6"
              >
                <p className="text-4xl font-semibold text-[color:var(--color-primary)] sm:text-5xl">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} start={statsVisible} />
                </p>
                <p className="mt-3 text-sm uppercase tracking-[0.28em] text-[color:var(--color-gray)]">{stat.label}</p>
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
      />

      <section id="testimonials" className="border-t border-[color:var(--color-border)] bg-[color:var(--surface-strong)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-primary)]">Testimonials</p>
          <h2 className="mt-4 text-4xl uppercase text-white sm:text-6xl">What clients say after launch</h2>

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
                    <p className="mt-4 text-base leading-7 text-[color:var(--color-gray-light)]">“{testimonial.quote}”</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-[color:var(--color-border)] pt-4">
                  <p className="text-lg font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-[color:var(--color-gray)]">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="egypt-map" className="border-t border-[color:var(--color-border)] bg-[color:var(--background)] px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-primary)]">Across Egypt</p>
            <h2 className="mt-4 text-4xl uppercase text-white sm:text-6xl">Governorates where MO3 has delivered work</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-gray-light)]">
              Tap a highlighted governorate to see where the team has already worked. The active list is managed from the admin panel.
            </p>

            <div className="mt-8 rounded-[34px] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,#130505_0%,#080808_100%)] p-5 sm:p-8">
              <div className="relative mx-auto aspect-[0.85] max-w-[520px] overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[radial-gradient(circle_at_top,rgba(227,18,18,0.14),transparent_30%),linear-gradient(180deg,#111111_0%,#050505_100%)]">
                <div className="absolute inset-[8%] rounded-[40%_26%_42%_30%/18%_20%_48%_50%] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />

                {EGYPT_GOVERNORATES.map((governorate) => {
                  const active = activeGovernorateSet.has(governorate.slug);

                  return (
                    <button
                      key={governorate.slug}
                      type="button"
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition sm:px-4 ${
                        active
                          ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white shadow-[0_0_24px_rgba(227,18,18,0.38)]"
                          : "border-[color:var(--color-border)] bg-black/80 text-[color:var(--color-gray)]"
                      }`}
                      style={{ top: governorate.top, left: governorate.left }}
                      aria-pressed={active}
                    >
                      {governorate.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--color-primary)]">Active Governorates</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {activeGovernorates.length ? (
                activeGovernorates.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-[color:var(--color-primary)] bg-[rgba(227,18,18,0.12)] px-4 py-2 text-sm text-white"
                  >
                    {item.name}
                  </span>
                ))
              ) : (
                <p className="text-sm leading-7 text-[color:var(--color-gray-light)]">No governorates are active yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-[color:var(--color-border)] bg-[color:var(--surface-strong)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-primary)]">FAQ</p>
          <h2 className="mt-4 text-4xl uppercase text-white sm:text-6xl">Everything clients usually ask</h2>

          <div className="mt-12 space-y-4">
            {faqsToRender.map((faq) => {
              const open = openFaqId === faq.id;

              return (
                <div key={faq.id} className="overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--surface)]">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(open ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
                  >
                    <span className="text-lg font-semibold text-white">{faq.question}</span>
                    <span className="text-2xl text-[color:var(--color-primary)]">{open ? "−" : "+"}</span>
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
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-primary)]">Contact</p>
            <h2 className="mt-4 text-4xl uppercase text-white sm:text-6xl">Let’s build the next campaign</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[color:var(--color-gray-light)]">
              Send the brief through WhatsApp and MO3 will follow up with timing, scope, and production direction.
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
                <span>Name</span>
                <input
                  required
                  value={contactState.name}
                  onChange={(event) => setContactState((current) => ({ ...current, name: event.target.value }))}
                  className="rounded-2xl px-4 py-3"
                  placeholder="Your name"
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)]">
                <span>Company</span>
                <input
                  value={contactState.company}
                  onChange={(event) => setContactState((current) => ({ ...current, company: event.target.value }))}
                  className="rounded-2xl px-4 py-3"
                  placeholder="Brand or company"
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)] sm:col-span-2">
                <span>Service</span>
                <input
                  value={contactState.service}
                  onChange={(event) => setContactState((current) => ({ ...current, service: event.target.value }))}
                  className="rounded-2xl px-4 py-3"
                  placeholder="Commercial, reels, post-production..."
                />
              </label>
              <label className="space-y-2 text-sm text-[color:var(--color-gray-light)] sm:col-span-2">
                <span>Project details</span>
                <textarea
                  required
                  value={contactState.message}
                  onChange={(event) => setContactState((current) => ({ ...current, message: event.target.value }))}
                  className="min-h-[180px] rounded-[24px] px-4 py-3"
                  placeholder="Tell MO3 what you want to produce."
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[color:var(--color-red-dim)]"
            >
              Send on WhatsApp
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-[color:var(--color-border)] bg-black px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[color:var(--color-gray)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MO3 Production. All rights reserved.</p>
          <p>Always dark. Always cinematic.</p>
        </div>
      </footer>

      <VideoLightbox work={selectedWork} onClose={() => setSelectedWork(null)} />
    </main>
  );
}
