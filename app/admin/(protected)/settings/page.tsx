"use client";

import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface SettingsState {
  aboutText: string;
  whatsapp: string;
  instagram: string;
  behance: string;
  facebook: string;
}

export default function AdminSettingsPage() {
  const [formState, setFormState] = useState<SettingsState>({
    aboutText: "",
    whatsapp: "",
    instagram: "",
    behance: "",
    facebook: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load settings");
      const data: Array<{ key: string; value: string }> = await response.json();
      const values = Object.fromEntries(data.map((item) => [item.key, item.value]));
      setFormState({
        aboutText: (values.aboutText as string) ?? "",
        whatsapp: (values.whatsapp as string) ?? "",
        instagram: (values.instagram as string) ?? "",
        behance: (values.behance as string) ?? "",
        facebook: (values.facebook as string) ?? "",
      });
    } catch (error) {
      toast.error("Failed to load settings.");
    }
  }

  function updateField(field: keyof SettingsState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Unable to save settings");
      }

      toast.success("Settings saved.");
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
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">
          Update the site configuration values stored in the SiteConfig table.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-slate-800 bg-[#111111] p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">About Text</label>
          <textarea
            value={formState.aboutText}
            onChange={(event) => updateField("aboutText", event.target.value)}
            rows={5}
            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-[#E31212]"
            placeholder="Add the company description shown across the site."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">WhatsApp Number</label>
            <input
              type="tel"
              value={formState.whatsapp}
              onChange={(event) => updateField("whatsapp", event.target.value)}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-[#E31212]"
              placeholder="+201234567890"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Instagram URL</label>
            <input
              type="url"
              value={formState.instagram}
              onChange={(event) => updateField("instagram", event.target.value)}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-[#E31212]"
              placeholder="https://instagram.com/mo3production"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Behance URL</label>
            <input
              type="url"
              value={formState.behance}
              onChange={(event) => updateField("behance", event.target.value)}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-[#E31212]"
              placeholder="https://behance.net/mo3production"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Facebook URL</label>
            <input
              type="url"
              value={formState.facebook}
              onChange={(event) => updateField("facebook", event.target.value)}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-[#E31212]"
              placeholder="https://facebook.com/mo3production"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-full bg-[#E31212] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b10d0d] disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save All"}
        </button>
      </form>
    </div>
  );
}
