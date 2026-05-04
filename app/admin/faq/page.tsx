"use client";

import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
}

const emptyForm = {
  question: "",
  answer: "",
  order: "",
  isVisible: true,
};

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyForm);

  useEffect(() => {
    void loadFaqs();
  }, []);

  async function loadFaqs() {
    const response = await fetch("/api/admin/faq", { cache: "no-store" });
    if (!response.ok) {
      toast.error("Failed to load FAQs.");
      return;
    }
    setFaqs(await response.json());
  }

  function resetForm() {
    setEditingId(null);
    setFormState(emptyForm);
  }

  function startEdit(item: FAQItem) {
    setEditingId(item.id);
    setFormState({
      question: item.question,
      answer: item.answer,
      order: String(item.order),
      isVisible: item.isVisible,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch(editingId ? `/api/admin/faq/${editingId}` : "/api/admin/faq", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: formState.question,
        answer: formState.answer,
        order: formState.order ? Number(formState.order) : undefined,
        isVisible: formState.isVisible,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.error || "Save failed.");
      return;
    }

    toast.success(editingId ? "FAQ updated." : "FAQ created.");
    resetForm();
    await loadFaqs();
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Delete failed.");
      return;
    }
    toast.success("FAQ deleted.");
    await loadFaqs();
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-semibold text-white">FAQ</h1>
        <p className="mt-2 text-sm text-slate-400">Manage frequently asked questions shown on the homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] p-6">
        <input value={formState.question} onChange={(event) => setFormState((current) => ({ ...current, question: event.target.value }))} placeholder="Question" className="rounded-3xl px-4 py-3" required />
        <textarea value={formState.answer} onChange={(event) => setFormState((current) => ({ ...current, answer: event.target.value }))} placeholder="Answer" className="min-h-[140px] rounded-3xl px-4 py-3" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={formState.order} onChange={(event) => setFormState((current) => ({ ...current, order: event.target.value }))} placeholder="Order" className="rounded-3xl px-4 py-3" />
          <label className="inline-flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={formState.isVisible} onChange={(event) => setFormState((current) => ({ ...current, isVisible: event.target.checked }))} className="h-4 w-4" />
            Visible on site
          </label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white">
            {editingId ? "Update FAQ" : "Add FAQ"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-full border border-[color:var(--color-border)] px-6 py-3 text-sm text-white">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4">
        {faqs.map((item) => (
          <div key={item.id} className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--surface)] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{item.question}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
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
