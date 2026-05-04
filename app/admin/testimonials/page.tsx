"use client";

import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  photo: string | null;
  order: number;
  isVisible: boolean;
}

const emptyForm = {
  name: "",
  role: "",
  company: "",
  quote: "",
  rating: "5",
  photo: "",
  order: "",
  isVisible: true,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyForm);

  useEffect(() => {
    void loadTestimonials();
  }, []);

  async function loadTestimonials() {
    const response = await fetch("/api/admin/testimonials", { cache: "no-store" });
    if (!response.ok) {
      toast.error("Failed to load testimonials.");
      return;
    }
    setTestimonials(await response.json());
  }

  function resetForm() {
    setEditingId(null);
    setFormState(emptyForm);
  }

  function startEdit(item: TestimonialItem) {
    setEditingId(item.id);
    setFormState({
      name: item.name,
      role: item.role,
      company: item.company,
      quote: item.quote,
      rating: String(item.rating),
      photo: item.photo ?? "",
      order: String(item.order),
      isVisible: item.isVisible,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: formState.name,
      role: formState.role,
      company: formState.company,
      quote: formState.quote,
      rating: Number(formState.rating),
      photo: formState.photo,
      order: formState.order ? Number(formState.order) : undefined,
      isVisible: formState.isVisible,
    };

    const response = await fetch(editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.error || "Save failed.");
      return;
    }

    toast.success(editingId ? "Testimonial updated." : "Testimonial created.");
    resetForm();
    await loadTestimonials();
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Delete failed.");
      return;
    }
    toast.success("Testimonial deleted.");
    await loadTestimonials();
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-semibold text-white">Testimonials</h1>
        <p className="mt-2 text-sm text-slate-400">Manage client testimonials for the homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6 md:grid-cols-2">
        <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} placeholder="Name" className="rounded-3xl px-4 py-3" required />
        <input value={formState.role} onChange={(event) => setFormState((current) => ({ ...current, role: event.target.value }))} placeholder="Role" className="rounded-3xl px-4 py-3" required />
        <input value={formState.company} onChange={(event) => setFormState((current) => ({ ...current, company: event.target.value }))} placeholder="Company" className="rounded-3xl px-4 py-3" required />
        <input value={formState.rating} onChange={(event) => setFormState((current) => ({ ...current, rating: event.target.value }))} placeholder="Rating 1-5" className="rounded-3xl px-4 py-3" required />
        <input value={formState.photo} onChange={(event) => setFormState((current) => ({ ...current, photo: event.target.value }))} placeholder="Photo URL (optional)" className="rounded-3xl px-4 py-3 md:col-span-2" />
        <textarea value={formState.quote} onChange={(event) => setFormState((current) => ({ ...current, quote: event.target.value }))} placeholder="Quote" className="min-h-[140px] rounded-3xl px-4 py-3 md:col-span-2" required />
        <input value={formState.order} onChange={(event) => setFormState((current) => ({ ...current, order: event.target.value }))} placeholder="Order" className="rounded-3xl px-4 py-3" />
        <label className="inline-flex items-center gap-3 text-sm text-slate-300">
          <input type="checkbox" checked={formState.isVisible} onChange={(event) => setFormState((current) => ({ ...current, isVisible: event.target.checked }))} className="h-4 w-4" />
          Visible on site
        </label>
        <div className="flex gap-3 md:col-span-2">
          <button type="submit" className="rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white">
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-full border border-[color:var(--color-border)] px-6 py-3 text-sm text-white">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4">
        {testimonials.map((item) => (
          <div key={item.id} className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{item.name}</p>
                <p className="text-sm text-slate-400">{item.role} · {item.company}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.quote}</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => startEdit(item)} className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-white">Edit</button>
                <button type="button" onClick={() => handleDelete(item.id)} className="rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
