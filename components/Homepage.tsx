"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import ThemeToggle from "@/components/ThemeToggle";
import MO3Logo from "@/components/MO3Logo";
import VideoLightbox from "@/components/VideoLightbox";
import CustomCursor from "@/components/CustomCursor";
import type { Client, SectionWithWorks, Work } from "@/types";

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
}

const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

const socialPlatforms = [
  { label: "WhatsApp", key: "whatsapp", icon: "WA" },
  { label: "Instagram", key: "instagram", icon: "IG" },
  { label: "Behance", key: "behance", icon: "B" },
  { label: "Facebook", key: "facebook", icon: "F" },
] as const;

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

export default function Homepage({ siteConfig, clients, sections }: HomepageProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const [projectsCount, setProjectsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [yearsCount, setYearsCount] = useState(0);

  const statsRef = useRef<HTMLDivElement | null>(null);

  const contactLinks = useMemo(
    () => [
      { label: "WhatsApp", href: getWhatsAppHref(siteConfig.whatsapp), value: siteConfig.whatsapp },
      { label: "Instagram", href: makeExternalUrl(siteConfig.instagram), value: siteConfig.instagram },
      { label: "Behance", href: makeExternalUrl(siteConfig.behance), value: siteConfig.behance },
      { label: "Facebook", href: makeExternalUrl(siteConfig.facebook), value: siteConfig.facebook },
    ].filter((item) => item.value?.trim()),
    [siteConfig]
  );

  const socialLinks = useMemo(
    () =>
      socialPlatforms
        .map((platform) => {
          const value = siteConfig[platform.key as keyof SiteConfigValues];
          const href = platform.key === "whatsapp" ? getWhatsAppHref(value) : makeExternalUrl(value);
          return { ...platform, href, value };
        })
        .filter((item) => item.value?.trim()),
    [siteConfig]
  );

  const visibleSections = sections.filter((section) => section.works.length > 0);
  const marqueeClients = useMemo(() => [...clients, ...clients], [clients]);
  const whatsappHref = getWhatsAppHref(siteConfig.whatsapp);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.25 }
    );
    sectionElements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsStarted) return;
    const duration = 900;
    const start = performance.now();
    let animationFrame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setProjectsCount(Math.round(50 * progress));
      setClientsCount(Math.round(30 * progress));
      setYearsCount(Math.round(3 * progress));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [statsStarted]);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsRef]);

  return (
    <main className="relative overflow-hidden bg-[color:var(--color-black)] text-[color:var(--color-white)]">
      <CustomCursor />
      <div className="film-grain pointer-events-none" />

      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-xl border-[color:var(--color-border)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#home" className="flex items-center gap-3">
            <MO3Logo className="h-12 w-auto" />
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative text-sm uppercase tracking-[0.2em] transition ${
                  activeSection === item.href.slice(1)
                    ? "text-[color:var(--color-white)]"
                    : "text-[color:var(--color-gray)] hover:text-[color:var(--color-white)]"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={`absolute left-1/2 top-full h-[2px] w-8 -translate-x-1/2 bg-[color:var(--color-red)] transition-all duration-300 ${
                    activeSection === item.href.slice(1) ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                />
              </a>
            ))}
            <ThemeToggle />
          </nav>
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-white)] transition hover:border-[color:var(--color-red)]"
              aria-label="Open menu"
            >
              <span className="space-y-1.5">
                <span className="block h-0.5 w-6 bg-white" />
                <span className="block h-0.5 w-6 bg-white" />
                <span className="block h-0.5 w-6 bg-white" />
              </span>
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
            className="fixed inset-0 z-50 bg-black text-white"
          >
            <div className="flex h-full flex-col px-8 py-8">
              <div className="flex items-center justify-between">
                <MO3Logo className="h-10 w-auto" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] text-white"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
              <nav className="mt-16 flex flex-1 flex-col justify-center gap-10 text-center">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-[48px] uppercase tracking-[0.2em] transition hover:text-[color:var(--color-red)]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section id="home" className="relative min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,0,0,0.2),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_25%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-8">
          <div className="flex flex-1 flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.45em] text-[color:var(--color-gray)]"
            >
              WE ARE
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-8 text-[70px] leading-[0.95] tracking-[-2px] text-white sm:text-[96px] md:text-[120px]"
            >
              ARCHITECTS
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-3 text-[70px] leading-[0.95] tracking-[-2px] text-transparent text-stroke-white sm:text-[96px] md:text-[120px]"
            >
              OF EMOTION
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
              className="mx-auto mt-10 h-[2px] w-20 origin-left bg-[color:var(--color-red)]"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 max-w-2xl text-[14px] uppercase tracking-[0.48em] text-[color:var(--color-gray)]"
            >
              Media outlet · Pre · shoot · Post
            </motion.p>
          </div>
        </div>
        <div className="absolute left-6 bottom-10 hidden flex-col items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-[color:var(--color-gray)] md:flex">
          <div className="relative h-24 w-px bg-[color:var(--color-border)]">
            <span className="absolute -top-2 left-1/2 block h-3 w-3 -translate-x-1/2 rounded-full bg-[color:var(--color-red)] animate-pulse" />
          </div>
          <span className="rotate-90">SCROLL</span>
        </div>
        <div className="absolute right-6 bottom-10 hidden flex-col items-end gap-4 text-[11px] uppercase tracking-[0.35em] text-[color:var(--color-gray)] md:flex">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-white)] transition hover:border-[color:var(--color-red)] hover:text-[color:var(--color-red)]"
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <p className="text-[11px] uppercase tracking-[0.45em] text-[color:var(--color-red)]">OUR STORY</p>
            <div className="space-y-3">
              <h2 className="text-[48px] leading-[0.95] tracking-[-1px] text-white sm:text-[64px] md:text-[80px]">
                WHERE IDEAS
                <br />
                BECOME
                <br />
                STORIES
              </h2>
            </div>
            <p className="max-w-2xl text-[16px] leading-[1.7] text-[color:var(--color-gray-light)]">
              {siteConfig.aboutText ||
                "MO3 Production creates cinematic video content with a premium, atmospheric look for clients who want unforgettable visual storytelling."}
            </p>
            <a
              href={whatsappHref || "#contact"}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noreferrer" : undefined}
              className="inline-flex items-center rounded-full bg-[color:var(--color-red)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[color:var(--color-red-dim)]"
            >
              START YOUR PROJECT →
            </a>
          </motion.div>

          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid gap-6"
          >
            <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-8 py-10 text-center">
              <p className="text-[72px] font-[400] leading-none text-[color:var(--color-red)]">{projectsCount}+</p>
              <p className="mt-4 text-[13px] uppercase tracking-[0.45em] text-[color:var(--color-gray)]">Projects Delivered</p>
            </div>
            <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-8 py-10 text-center">
              <p className="text-[72px] font-[400] leading-none text-[color:var(--color-red)]">{clientsCount}+</p>
              <p className="mt-4 text-[13px] uppercase tracking-[0.45em] text-[color:var(--color-gray)]">Happy Clients</p>
            </div>
            <div className="rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-8 py-10 text-center">
              <p className="text-[72px] font-[400] leading-none text-[color:var(--color-red)]">{yearsCount}</p>
              <p className="mt-4 text-[13px] uppercase tracking-[0.45em] text-[color:var(--color-gray)]">Years of Excellence</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="clients" className="border-t border-[color:var(--color-border)] bg-[color:var(--color-black)] px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[color:var(--color-red)]">TRUSTED BY</p>
          <h2 className="mt-4 text-[48px] leading-[0.95] tracking-[-1px] text-white sm:text-[64px]">OUR CLIENTS</h2>
        </div>

        <div className="mt-16 space-y-8 overflow-hidden">
          <div className="marquee overflow-hidden">
            <div className="marquee-track flex items-center gap-6">
              {marqueeClients.map((client, index) => (
                <div
                  key={`track-a-${client.id}-${index}`}
                  className="group inline-flex h-24 w-44 items-center justify-center rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 transition duration-500 hover:scale-105 hover:grayscale-0"
                >
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="176px"
                    />
                  ) : (
                    <span className="text-sm text-[color:var(--color-gray)]">{client.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="marquee overflow-hidden">
            <div className="marquee-track marquee-reverse flex items-center gap-6">
              {marqueeClients.map((client, index) => (
                <div
                  key={`track-b-${client.id}-${index}`}
                  className="group inline-flex h-24 w-44 items-center justify-center rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 transition duration-500 hover:scale-105 hover:grayscale-0"
                >
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="176px"
                    />
                  ) : (
                    <span className="text-sm text-[color:var(--color-gray)]">{client.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          {visibleSections.length ? (
            visibleSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7 }}
                className="mb-24"
              >
                <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="relative overflow-visible">
                    <span className="pointer-events-none absolute left-0 top-0 z-0 text-[120px] font-[400] leading-[0.9] text-[color:var(--color-border)] opacity-40">0{index + 1}</span>
                    <h3 className="relative text-[40px] leading-[0.95] tracking-[-1px] text-white sm:text-[56px] md:text-[64px]">{section.title}</h3>
                  </div>
                  <a
                    href="#work"
                    className="text-sm uppercase tracking-[0.35em] text-[color:var(--color-red)] transition hover:text-[color:var(--color-red-dim)]"
                  >
                    VIEW ALL →
                  </a>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {section.works.map((work) => (
                    <button
                      key={work.id}
                      type="button"
                      onClick={() => setSelectedWork(work)}
                      className="group relative overflow-hidden rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-left transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-red)]/40"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-black">
                        {work.thumbnail ? (
                          <Image
                            src={work.thumbnail}
                            alt={work.title}
                            fill
                            className="object-cover transition duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-sm text-[color:var(--color-gray)]">No thumbnail</div>
                        )}
                        <div className="absolute inset-0 bg-black/25 transition duration-300 group-hover:bg-black/70" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-red)] text-white shadow-[0_0_0_8px_rgba(227,18,18,0.12)] transition duration-300 group-hover:scale-105">
                            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--color-red)]">{work.client}</p>
                        <h4 className="mt-4 text-xl font-semibold text-white">{work.title}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-[color:var(--color-gray)]">No visible work sections are available yet.</p>
          )}
        </div>
      </section>

      <section id="contact" className="border-t border-[color:var(--color-border)] bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <div className="space-y-6">
            <h2 className="text-[55px] leading-[0.95] tracking-[-1px] text-white sm:text-[70px] md:text-[100px]">
              LET&apos;S CREATE
              <br />
              SOMETHING
              <br />
              <span className="text-transparent text-stroke-red">TOGETHER</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-[color:var(--color-gray)]">Ready to tell your story?</p>
          </div>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={whatsappHref || "#contact"}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noreferrer" : undefined}
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-red)] px-10 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[color:var(--color-red-dim)] active:scale-95"
            >
              START A PROJECT
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-10 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-[color:var(--color-red)] hover:text-[color:var(--color-red)]"
            >
              SEE OUR WORK
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-white)] transition hover:-translate-y-1 hover:border-[color:var(--color-red)] hover:text-[color:var(--color-red)]"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="mt-16 text-xs uppercase tracking-[0.4em] text-[color:var(--color-gray)]">© 2025 MO3 Production. All rights reserved.</p>
        </div>
      </section>

      <VideoLightbox work={selectedWork} onClose={() => setSelectedWork(null)} />
      <Toaster position="top-right" />
    </main>
  );
}
