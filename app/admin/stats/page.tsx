"use client";

import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface StatItem {
  id: string;
  label: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  order: number;
  isVisible: boolean;
}

const emptyForm = {
  label: "",
  value: "",
  prefix: "",
  suffix: "",
  order: "",
  isVisible: true,
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyForm);

  useEffect(() => {
    void loadStats();
  }, []);

  async function loadStats() {
    const response = await fetch("/api/admin/stats", { cache: "no-store" });
    if (!response.ok) {
      toast.error("Failed to load stats.");
      return;
    }
    setStats(await response.json());
  }

  function resetForm() {
    setEditingId(null);
    setFormState(emptyForm);
  }

  function startEdit(stat: StatItem) {
    setEditingId(stat.id);
    setFormState({
      label: stat.label,
      value: String(stat.value),
      prefix: stat.prefix ?? "",
      suffix: stat.suffix ?? "",
      order: String(stat.order),
      isVisible: stat.isVisible,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      label: formState.label,
      value: Number(formState.value),
      prefix: formState.prefix,
      suffix: formState.suffix,
      order: formState.order ? Number(formState.order) : undefined,
      isVisible: formState.isVisible,
    };

    const url = editingId ? `/api/admin/stats/${editingId}` : "/api/admin/stats";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.error || "Save failed.");
      return;
    }

    toast.success(editingId ? "Stat updated." : "Stat created.");
    resetForm();
    await loadStats();
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/admin/stats/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Delete failed.");
      return;
    }
    toast.success("Stat deleted.");
    await loadStats();
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-semibold text-white">Statistics</h1>
        <p className="mt-2 text-sm text-slate-400">Manage the animated counters shown on the homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6 md:grid-cols-2 xl:grid-cols-3">
        <input value={formState.label} onChange={(event) => setFormState((current) => ({ ...current, label: event.target.value }))} placeholder="Label" className="rounded-3xl px-4 py-3" required />
        <input value={formState.value} onChange={(event) => setFormState((current) => ({ ...current, value: event.target.value }))} placeholder="Value" className="rounded-3xl px-4 py-3" required />
        <input value={formState.prefix} onChange={(event) => setFormState((current) => ({ ...current, prefix: event.target.value }))} placeholder="Prefix (optional)" className="rounded-3xl px-4 py-3" />
        <input value={formState.suffix} onChange={(event) => setFormState((current) => ({ ...current, suffix: event.target.value }))} placeholder="Suffix (optional)" className="rounded-3xl px-4 py-3" />
        <input value={formState.order} onChange={(event) => setFormState((current) => ({ ...current, order: event.target.value }))} placeholder="Order" className="rounded-3xl px-4 py-3" />
        <label className="inline-flex items-center gap-3 text-sm text-slate-300">
          <input type="checkbox" checked={formState.isVisible} onChange={(event) => setFormState((current) => ({ ...current, isVisible: event.target.checked }))} className="h-4 w-4" />
          Visible on site
        </label>
        <div className="flex gap-3 md:col-span-2 xl:col-span-3">
          <button type="submit" className="rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white">
            {editingId ? "Update Stat" : "Add Stat"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-full border border-[color:var(--color-border)] px-6 py-3 text-sm text-white">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold text-white">
                {stat.prefix ?? ""}
                {stat.value}
                {stat.suffix ?? ""}
              </p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => startEdit(stat)} className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-white">Edit</button>
              <button type="button" onClick={() => handleDelete(stat.id)} className="rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
