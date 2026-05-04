"use client";

import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminHeroVideoPage() {
  const [formState, setFormState] = useState({
    title: "",
    subtitle: "",
    ctaLabel: "",
    ctaLink: "",
    videoUrl: "",
    posterUrl: "",
    isVisible: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadHeroConfig();
  }, []);

  async function loadHeroConfig() {
    const response = await fetch("/api/admin/hero-config", { cache: "no-store" });
    if (!response.ok) {
      toast.error("Failed to load hero config.");
      return;
    }

    const data = await response.json();
    if (!data) return;

    setFormState({
      title: data.title ?? "",
      subtitle: data.subtitle ?? "",
      ctaLabel: data.ctaLabel ?? "",
      ctaLink: data.ctaLink ?? "",
      videoUrl: data.videoUrl ?? "",
      posterUrl: data.posterUrl ?? "",
      isVisible: data.isVisible ?? true,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/hero-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Unable to save hero section.");
      }

      toast.success("Hero section saved.");
    } catch (error: any) {
      toast.error(error.message || "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-semibold text-white">Hero Video</h1>
        <p className="mt-2 text-sm text-slate-400">Manage the fullscreen homepage video, title, and CTA.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6">
        <div className="grid gap-4">
          <label className="space-y-2 text-sm text-slate-300">
            <span>Title</span>
            <textarea
              required
              value={formState.title}
              onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
              className="min-h-[120px] rounded-3xl px-4 py-3"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Subtitle</span>
            <textarea
              value={formState.subtitle}
              onChange={(event) => setFormState((current) => ({ ...current, subtitle: event.target.value }))}
              className="min-h-[120px] rounded-3xl px-4 py-3"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            <span>CTA Label</span>
            <input
              required
              value={formState.ctaLabel}
              onChange={(event) => setFormState((current) => ({ ...current, ctaLabel: event.target.value }))}
              className="rounded-3xl px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>CTA Link</span>
            <input
              required
              value={formState.ctaLink}
              onChange={(event) => setFormState((current) => ({ ...current, ctaLink: event.target.value }))}
              className="rounded-3xl px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>Video URL</span>
            <input
              required
              value={formState.videoUrl}
              onChange={(event) => setFormState((current) => ({ ...current, videoUrl: event.target.value }))}
              className="rounded-3xl px-4 py-3"
              placeholder="https://..."
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>Poster URL</span>
            <input
              value={formState.posterUrl}
              onChange={(event) => setFormState((current) => ({ ...current, posterUrl: event.target.value }))}
              className="rounded-3xl px-4 py-3"
              placeholder="https://..."
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={formState.isVisible}
            onChange={(event) => setFormState((current) => ({ ...current, isVisible: event.target.checked }))}
            className="h-4 w-4"
          />
          Hero section visible
        </label>

        <button type="submit" disabled={isSaving} className="rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white">
          {isSaving ? "Saving..." : "Save Hero Video"}
        </button>
      </form>
    </div>
  );
}
