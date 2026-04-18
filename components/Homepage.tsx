"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import ThemeToggle from "@/components/ThemeToggle";
import MO3Logo from "@/components/MO3Logo";
import VideoLightbox from "@/components/VideoLightbox";
import CustomCursor from "@/components/CustomCursor";
import TiltCard from "@/components/TiltCard";
import ScrollReveal from "@/components/ScrollReveal";
import WorkShowcase3D from "@/components/WorkShowcase3D";
import { PlaceholderWorkCard } from "@/components/Placeholders";
import type { Client, SectionWithWorks, Work } from "@/types";

const WorkMap = dynamic(
  () => import('@/components/WorkMap'),
  { ssr: false }
)

const HeroCanvas = dynamic(
  () => import('@/components/HeroCanvas'),
  { ssr: false }
)

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [menuOpen]);

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
          <a href="#home" className="flex items-center gap-3 float-animation">
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
        <HeroCanvas />
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
          <ScrollReveal direction="up" delay={100}>
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
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
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
          </ScrollReveal>
        </div>
      </section>

      <section id="clients" className="border-t border-[color:var(--color-border)] bg-[color:var(--color-black)] px-6 py-24">
        <ScrollReveal direction="scale" delay={100}>
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-[11px] uppercase tracking-[0.45em] text-[color:var(--color-red)]">TRUSTED BY</p>
            <h2 className="mt-4 text-[48px] leading-[0.95] tracking-[-1px] text-white sm:text-[64px]">OUR CLIENTS</h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 space-y-8 overflow-hidden">
          <div className="marquee overflow-hidden">
            <div className="marquee-track flex items-center gap-6">
              {marqueeClients.map((client, index) => (
                <TiltCard
                  key={`track-a-${client.id}-${index}`}
                  intensity={8}
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
                </TiltCard>
              ))}
            </div>
          </div>

          <div className="marquee overflow-hidden">
            <div className="marquee-track marquee-reverse flex items-center gap-6">
              {marqueeClients.map((client, index) => (
                <TiltCard
                  key={`track-b-${client.id}-${index}`}
                  intensity={8}
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
                </TiltCard>
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
                <WorkShowcase3D 
                  works={section.works}
                  onSelect={(work) => setSelectedWork(work)}
                />
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {section.works.length > 0 ? (
                    section.works.map((work) => (
                      <TiltCard
                        key={work.id}
                        intensity={12}
                        className="rounded-[2rem]"
                      >
                        <button
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
                      </TiltCard>
                    ))
                  ) : (
                    [0, 1, 2].map((i) => <PlaceholderWorkCard key={i} />)
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="space-y-24">
              {[
                { title: "Commercial Ads", number: "01" },
                { title: "Reels", number: "02" },
                { title: "Podcast", number: "03" },
              ].map((section) => (
                <motion.div
                  key={section.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="relative overflow-visible">
                      <span className="pointer-events-none absolute left-0 top-0 z-0 text-[120px] font-[400] leading-[0.9] text-[color:var(--color-border)] opacity-40">
                        {section.number}
                      </span>
                      <h3 className="relative text-[40px] leading-[0.95] tracking-[-1px] text-white sm:text-[56px] md:text-[64px]">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                      <PlaceholderWorkCard key={i} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <WorkMap />

      <section className="bg-[color:var(--bg-primary)] 
                    py-20 px-4 text-center" id="contact">
        <div className="mx-auto max-w-4xl">
          
          <p className="mb-3 text-[11px] uppercase 
                        tracking-[6px] text-[color:var(--color-primary)]">
            GET IN TOUCH
          </p>
          <h2 className="font-display text-5xl md:text-7xl 
                         text-[color:var(--text-primary)] 
                         leading-none mb-4">
            LET'S CREATE SOMETHING TOGETHER
          </h2>
          <div className="mx-auto mb-8 h-[2px] w-16 bg-[color:var(--color-primary)]" />

          <a
            href="https://wa.me/201066298201"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full
                       bg-[color:var(--color-primary)] px-8 py-4 text-white font-medium
                       text-lg hover:bg-[#c01010] transition-colors
                       mb-12 shadow-lg shadow-red-900/30"
          >
            <svg className="h-5 w-5" fill="currentColor" 
                 viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Start Your Project
          </a>

          <div className="flex items-center justify-center 
                          gap-6 flex-wrap">
            
            <a href="https://www.instagram.com/mo3_production?igsh=eWxyMTZkaXRxa3Nq"
               target="_blank"
               rel="noopener noreferrer"
               className="flex flex-col items-center gap-2 
                          text-[color:var(--text-secondary)]
                          hover:text-[color:var(--color-primary)] transition-colors group">
              <div className="flex h-12 w-12 items-center justify-center
                              rounded-full border 
                              border-[color:var(--border-color)]
                              group-hover:border-[color:var(--color-primary)] 
                              transition-colors">
                <svg className="h-5 w-5" fill="currentColor" 
                     viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <span className="text-xs">Instagram</span>
            </a>

            <a href="https://www.facebook.com/MO3Production"
               target="_blank"
               rel="noopener noreferrer"
               className="flex flex-col items-center gap-2
                          text-[color:var(--text-secondary)]
                          hover:text-[color:var(--color-primary)] transition-colors group">
              <div className="flex h-12 w-12 items-center justify-center
                              rounded-full border
                              border-[color:var(--border-color)]
                              group-hover:border-[color:var(--color-primary)]
                              transition-colors">
                <svg className="h-5 w-5" fill="currentColor"
                     viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-xs">Facebook</span>
            </a>

            <a href="https://www.behance.net/mo3team"
               target="_blank"
               rel="noopener noreferrer"
               className="flex flex-col items-center gap-2
                          text-[color:var(--text-secondary)]
                          hover:text-[color:var(--color-primary)] transition-colors group">
              <div className="flex h-12 w-12 items-center justify-center
                              rounded-full border
                              border-[color:var(--border-color)]
                              group-hover:border-[color:var(--color-primary)]
                              transition-colors">
                <svg className="h-5 w-5" fill="currentColor"
                     viewBox="0 0 24 24">
                  <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.69.755-.64.16-1.31.24-2.01.24H0V4.51h6.938v-.007zM16.94 6.422v1.73h-5.137V6.422h5.137zM6.588 9.52H3.434v3.145h3.154c.78 0 1.38-.17 1.8-.5.42-.34.63-.85.63-1.56 0-.37-.06-.68-.19-.94-.13-.27-.31-.49-.54-.66-.23-.17-.51-.3-.82-.38-.32-.08-.67-.11-1.05-.11h.17v.005zm-.143 5.287H3.434v3.573h3.03c.37 0 .72-.04 1.06-.11.34-.07.64-.19.9-.37.26-.17.47-.4.63-.7.16-.3.24-.67.24-1.11 0-.87-.26-1.48-.77-1.84-.52-.36-1.2-.54-2.07-.54l-.01.1zm13.613-4.42c-.37-.4-.9-.6-1.62-.6-.46 0-.85.08-1.16.25-.31.17-.57.38-.77.63-.2.26-.34.54-.43.84-.09.3-.14.59-.16.87h4.77c-.07-.74-.26-1.39-.63-1.99zm.007 5.48c-.35.34-.87.51-1.56.51-.46 0-.85-.08-1.18-.23-.32-.16-.59-.36-.8-.6-.21-.25-.36-.52-.46-.81-.1-.3-.16-.58-.18-.86H24c.04-1.88-.4-3.35-1.32-4.41-.92-1.05-2.27-1.58-4.06-1.58-.77 0-1.48.14-2.13.42-.65.28-1.2.66-1.66 1.15-.46.49-.82 1.07-1.08 1.74-.26.67-.39 1.4-.39 2.18 0 .8.12 1.54.37 2.21.25.67.61 1.25 1.07 1.73.46.48 1.02.85 1.68 1.12.66.27 1.4.4 2.23.4 1.12 0 2.07-.25 2.83-.76.77-.5 1.32-1.33 1.65-2.48h-2.39c-.1.36-.32.65-.65.98l-.01.02z"/>
                </svg>
              </div>
              <span className="text-xs">Behance</span>
            </a>

            <a href="tel:+201066298201"
               className="flex flex-col items-center gap-2
                          text-[color:var(--text-secondary)]
                          hover:text-[color:var(--color-primary)] transition-colors group">
              <div className="flex h-12 w-12 items-center justify-center
                              rounded-full border
                              border-[color:var(--border-color)]
                              group-hover:border-[color:var(--color-primary)]
                              transition-colors">
                <svg className="h-5 w-5" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"/>
                </svg>
              </div>
              <span className="text-xs">01066298201</span>
            </a>

          </div>

          <div className="mt-16 border-t 
                          border-[color:var(--border-color)] pt-8">
            <p className="text-xs text-[color:var(--text-muted)]">
              © 2025 MO3 Production. All rights reserved.
            </p>
          </div>
        </div>
      </section>

      <VideoLightbox work={selectedWork} onClose={() => setSelectedWork(null)} />
      <Toaster position="top-right" />
    </main>
  );
}
