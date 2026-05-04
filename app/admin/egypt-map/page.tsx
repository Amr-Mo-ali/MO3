"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface GovernorateItem {
  slug: string;
  name: string;
  isActive: boolean;
}

export default function AdminEgyptMapPage() {
  const [governorates, setGovernorates] = useState<GovernorateItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadGovernorates();
  }, []);

  async function loadGovernorates() {
    const response = await fetch("/api/admin/governorates", { cache: "no-store" });
    if (!response.ok) {
      toast.error("Failed to load governorates.");
      return;
    }
    setGovernorates(await response.json());
  }

  function toggleGovernorate(slug: string) {
    setGovernorates((current) =>
      current.map((item) => (item.slug === slug ? { ...item, isActive: !item.isActive } : item))
    );
  }

  async function handleSave() {
    setIsSaving(true);

    const response = await fetch("/api/admin/governorates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs: governorates.filter((item) => item.isActive).map((item) => item.slug) }),
    });

    setIsSaving(false);

    if (!response.ok) {
      toast.error("Failed to save governorates.");
      return;
    }

    toast.success("Governorates updated.");
    await loadGovernorates();
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-semibold text-white">Egypt Map</h1>
        <p className="mt-2 text-sm text-slate-400">Select the governorates MO3 has worked in.</p>
      </div>

      <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6">
        <div className="flex flex-wrap gap-3">
          {governorates.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => toggleGovernorate(item.slug)}
              className={`rounded-full border px-4 py-3 text-sm transition ${
                item.isActive
                  ? "border-[color:var(--color-primary)] bg-[rgba(227,18,18,0.12)] text-white"
                  : "border-[color:var(--color-border)] bg-black text-slate-300"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <button type="button" onClick={handleSave} disabled={isSaving} className="mt-6 rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white">
          {isSaving ? "Saving..." : "Save Governorates"}
        </button>
      </div>
    </div>
  );
}
