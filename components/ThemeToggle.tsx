"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-foreground)] transition duration-300 hover:border-[color:var(--color-red)] hover:text-[color:var(--color-red)] ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[color:var(--color-foreground)]" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[color:var(--color-foreground)]" aria-hidden="true">
          <path d="M12 18.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm0 1.5a7.75 7.75 0 110-15.5 7.75 7.75 0 010 15.5z" />
        </svg>
      )}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
