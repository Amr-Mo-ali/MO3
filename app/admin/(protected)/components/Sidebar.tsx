"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";
import MO3Logo from "@/components/MO3Logo";

const navItems = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Sections", href: "/admin/sections" },
  { label: "Works", href: "/admin/works" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen flex-col bg-[color:var(--surface-strong)] px-6 py-8 text-[color:var(--foreground)] border-r border-[color:var(--border-color)]">
      <div className="mb-10 flex items-center justify-between gap-4">
        <MO3Logo className="h-[5.25rem] w-auto" />
        <ThemeToggle className="rounded-full px-3 py-2 text-[0.7rem]" />
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl border-l-4 border-transparent px-4 py-3 text-sm transition ${
                isActive
                  ? "border-[#E31212] bg-[color:var(--card-bg)] text-[#E31212]"
                  : "text-[color:var(--foreground)] hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 pt-6 border-t border-[color:var(--border-color)]">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full rounded-2xl bg-[color:var(--surface)] px-4 py-3 text-left text-sm text-[color:var(--foreground)] transition hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
