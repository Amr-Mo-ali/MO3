"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsLight(saved === 'light' || currentTheme === 'light');
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    if (current === 'light') {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border-color)] bg-[color:var(--bg-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--text-primary)] transition duration-300 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] ${className}`}
      aria-label="Toggle theme"
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[color:var(--text-primary)]" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[color:var(--text-primary)]" aria-hidden="true">
          <path d="M12 18.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm0 1.5a7.75 7.75 0 110-15.5 7.75 7.75 0 010 15.5z" />
        </svg>
      )}
      <span>{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}
