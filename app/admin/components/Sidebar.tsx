"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import MO3Logo from "@/components/MO3Logo";

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Sections", href: "/admin/sections" },
  { label: "Works", href: "/admin/works" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Hero Video", href: "/admin/hero-video" },
  { label: "Statistics", href: "/admin/stats" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "FAQ", href: "/admin/faq" },
  { label: "Locations", href: "/admin/places" },
  { label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <aside className="sticky top-0 z-[210] border-b border-[color:var(--color-border)] bg-[color:var(--surface-strong)] px-4 py-4 text-[color:var(--foreground)] lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <MO3Logo className="h-10 w-auto" />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="btn-secondary inline-flex h-11 w-11 items-center justify-center px-0 text-white"
            aria-label="Open admin menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] bg-black/95 lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <div className="touch-scroll flex h-full flex-col px-0 py-6" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between px-6">
                <MO3Logo className="h-10 w-auto" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="btn-secondary h-11 w-11 px-0 text-white"
                >
                  X
                </button>
              </div>

              <nav className="mt-8 flex flex-1 flex-col">
                {navItems.map((item: any) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`mobile-menu-link ${isActive ? "text-[#E31212]" : "text-white"}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/admin-login" })}
                  className="btn-primary w-full text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <aside className="hidden border-b border-[color:var(--color-border)] bg-[color:var(--surface-strong)] px-4 py-4 text-[color:var(--foreground)] lg:flex lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <div className="mb-4 flex items-center justify-between gap-4 lg:mb-10">
          <MO3Logo className="h-12 w-auto lg:h-[5.25rem]" />
        </div>

        <nav className="flex flex-1 gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {navItems.map((item: any) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-2xl border border-transparent px-4 py-3 text-sm transition lg:border-l-4 lg:border-t-0 ${
                  isActive
                    ? "border-[color:var(--color-primary)] bg-[color:var(--card-bg)] text-[color:var(--color-primary)]"
                    : "text-[color:var(--foreground)] hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-[color:var(--border-color)] pt-4 lg:mt-10 lg:pt-6">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="w-full rounded-2xl bg-[color:var(--surface)] px-4 py-3 text-left text-sm text-[color:var(--foreground)] transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
