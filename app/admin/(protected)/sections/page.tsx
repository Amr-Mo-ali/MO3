"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast, { Toaster } from "react-hot-toast";

interface SectionItem {
  id: number;
  title: string;
  slug: string;
  order: number;
  isVisible: boolean;
  worksCount: number;
}

function slugify(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function SortableRow({
  section,
  onEdit,
  onDelete,
  onToggleVisible,
}: {
  section: SectionItem;
  onEdit: (section: SectionItem) => void;
  onDelete: (section: SectionItem) => void;
  onToggleVisible: (section: SectionItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t border-white/10">
      <td className="px-4 py-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="rounded-2xl bg-white/5 px-3 py-2 text-slate-300 transition hover:bg-white/10"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>
      </td>
      <td className="px-4 py-4">
        <div className="font-medium text-white">{section.title}</div>
      </td>
      <td className="px-4 py-4 text-slate-300">{section.slug}</td>
      <td className="px-4 py-4 text-slate-300">{section.worksCount}</td>
      <td className="px-4 py-4">
        <button
          type="button"
          onClick={() => onToggleVisible(section)}
          className={`inline-flex h-9 items-center rounded-full px-3 text-sm font-medium transition ${
            section.isVisible
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-slate-700 text-slate-400"
          }`}
        >
          {section.isVisible ? "Visible" : "Hidden"}
        </button>
      </td>
      <td className="px-4 py-4 text-slate-300">{section.order}</td>
      <td className="px-4 py-4 space-x-2">
        <button
          type="button"
          onClick={() => onEdit(section)}
          className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(section)}
          className="rounded-2xl bg-[#720000]/10 px-4 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionItem | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    slug: "",
    order: 1,
    isVisible: true,
  });
  const [deleteTarget, setDeleteTarget] = useState<SectionItem | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const loadSections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/sections");
      if (!response.ok) {
        throw new Error("Unable to load sections");
      }
      const data = await response.json();
      setSections(data);
    } catch (error) {
      toast.error("Failed to fetch sections.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const openAddDrawer = () => {
    const nextOrder = sections.length ? Math.max(...sections.map((item: any) => item.order)) + 1 : 1;
    setIsEditing(false);
    setActiveSection(null);
    setFormState({ title: "", slug: "", order: nextOrder, isVisible: true });
    setDrawerOpen(true);
  };

  const openEditDrawer = (section: SectionItem) => {
    setIsEditing(true);
    setActiveSection(section);
    setFormState({
      title: section.title,
      slug: section.slug,
      order: section.order,
      isVisible: section.isVisible,
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveSection(null);
  };

  const handleFormChange = (field: string, value: string | boolean | number) => {
    setFormState((current) => {
      const next = { ...current, [field]: value };
      if (field === "title") {
        return { ...next, slug: slugify(String(value)) };
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!formState.title.trim()) {
      toast.error("Section title is required.");
      return;
    }

    const payload = {
      title: formState.title.trim(),
      slug: formState.slug || slugify(formState.title),
      order: formState.order,
      isVisible: formState.isVisible,
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing && activeSection ? `/api/admin/sections/${activeSection.id}` : "/api/admin/sections";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Unable to save section");
      }

      await loadSections();
      closeDrawer();
      toast.success(isEditing ? "Section updated." : "Section added.");
    } catch (error) {
      toast.error(String(error));
    }
  };

  const handleToggleVisible = async (section: SectionItem) => {
    try {
      const response = await fetch(`/api/admin/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !section.isVisible }),
      });
      if (!response.ok) {
        throw new Error("Unable to update visibility");
      }
      setSections((current) =>
        current.map((item: any) =>
          item.id === section.id ? { ...item, isVisible: !item.isVisible } : item
        )
      );
      toast.success("Visibility updated.");
    } catch (error) {
      toast.error(String(error));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/sections/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to delete section");
      }
      setSections((current) => current.filter((item: any) => item.id !== deleteTarget.id));
      toast.success("Section deleted.");
    } catch (error) {
      toast.error(String(error));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sections.findIndex((item) => item.id.toString() === active.id);
    const newIndex = sections.findIndex((item) => item.id.toString() === over.id);
    const next = arrayMove(sections, oldIndex, newIndex);
    setSections(next);

    try {
      const ids = next.map((item: any) => item.id);
      const response = await fetch("/api/admin/sections/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error("Unable to save order");
      }
      toast.success("Section order updated.");
    } catch (error) {
      toast.error(String(error));
      loadSections();
    }
  };

  const orderedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections]
  );

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Sections</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Manage the portfolio sections used to organize works in the MO3 admin dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddDrawer}
          className="inline-flex items-center justify-center rounded-2xl bg-[#E31212] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#E31212]/20 transition hover:brightness-105"
        >
          Add Section
        </button>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#111111]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[#0f0f0f] text-slate-500">
            <tr>
              <th className="px-4 py-4 w-16">Order</th>
              <th className="px-4 py-4">Title</th>
              <th className="px-4 py-4">Slug</th>
              <th className="px-4 py-4">Works</th>
              <th className="px-4 py-4">Visible</th>
              <th className="px-4 py-4">Sort</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Loading sections...
                </td>
              </tr>
            ) : orderedSections.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No sections yet. Add one to get started.
                </td>
              </tr>
            ) : (
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext items={orderedSections.map((item: any) => item.id.toString())} strategy={verticalListSortingStrategy}>
                  {orderedSections.map((section: any) => (
                    <SortableRow
                      key={section.id}
                      section={section}
                      onEdit={openEditDrawer}
                      onDelete={setDeleteTarget}
                      onToggleVisible={handleToggleVisible}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </tbody>
        </table>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch bg-black/50 p-6">
          <div className="ml-auto h-full w-full max-w-xl rounded-[32px] bg-[#111111] p-8 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#E31212]">Section form</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {isEditing ? "Edit Section" : "Add Section"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Title</label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) => handleFormChange("title", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#E31212]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Slug</label>
                <input
                  type="text"
                  value={formState.slug}
                  onChange={(event) => handleFormChange("slug", slugify(event.target.value))}
                  className="w-full rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#E31212]"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Order</label>
                  <input
                    type="number"
                    value={formState.order}
                    onChange={(event) => handleFormChange("order", Number(event.target.value))}
                    className="w-full rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#E31212]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Visible</label>
                  <div className="flex items-center gap-3 rounded-3xl bg-[#0f0f0f] px-4 py-3">
                    <input
                      id="visible"
                      type="checkbox"
                      checked={formState.isVisible}
                      onChange={(event) => handleFormChange("isVisible", event.target.checked)}
                      className="h-5 w-5 rounded border-white/10 bg-slate-900 text-[#E31212]"
                    />
                    <label htmlFor="visible" className="text-sm text-slate-300">
                      Section is visible
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-2xl bg-[#E31212] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Save Section
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-lg rounded-[32px] bg-[#111111] p-8 text-white shadow-2xl shadow-black/50">
            <h3 className="text-xl font-semibold">Confirm deletion</h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Deleting <span className="font-semibold text-white">{deleteTarget.title}</span> will remove the section.
              If it contains works, deletion is blocked and you must remove the works first.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Delete section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
