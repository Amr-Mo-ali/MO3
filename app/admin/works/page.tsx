"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast, { Toaster } from "react-hot-toast";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function VideoPreview({ url }: { url: string }) {
  if (!url) return null;

  let embedUrl = "";

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : url.split("v=")[1]?.split("&")[0];
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (url.includes("vimeo.com")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    if (videoId) {
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
  }

  if (!embedUrl) return null;

  return (
    <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg bg-slate-950">
      <iframe
        src={embedUrl}
        title="Video preview"
        className="h-full w-full"
        allowFullScreen
        allow="autoplay"
      />
    </div>
  );
}

interface SectionItem {
  id: string;
  title: string;
  slug: string;
  order: number;
  isVisible: boolean;
  worksCount: number;
}

interface WorkItem {
  id: string;
  title: string;
  client: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  tags: string[];
  isVisible: boolean;
  order: number;
  sectionId: string;
  section: {
    id: string;
    title: string;
  };
}

function SortableWorkRow({
  work,
  selected,
  onToggleSelect,
  onToggleVisible,
  onEdit,
  onDelete,
}: {
  work: WorkItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleVisible: (id: string, value: boolean) => void;
  onEdit: (work: WorkItem) => void;
  onDelete: (work: WorkItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: work.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-slate-800 odd:bg-white/5 hover:bg-[#111111]/70">
      <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-300">
        <div className="flex items-center gap-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-slate-500 hover:text-[#E31212]"
            aria-label="Drag handle"
          >
            ≡
          </button>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(work.id)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-[#E31212]"
          />
        </div>
      </td>
      <td className="px-3 py-3 text-sm text-slate-200">
        <div className="flex items-center gap-3">
          <img
            src={work.thumbnail}
            alt={work.title}
            className="h-12 w-20 rounded object-cover border border-slate-700"
          />
          <div>
            <div className="font-medium text-slate-100">{work.title}</div>
            <div className="text-xs text-slate-400">{work.client}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-sm text-slate-300">{work.section.title}</td>
      <td className="px-3 py-3 text-sm text-slate-300">{work.tags.join(", ") || "—"}</td>
      <td className="px-3 py-3 text-sm text-slate-300">
        <span
          className={classNames(
            "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
            work.isVisible ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700 text-slate-400"
          )}
        >
          {work.isVisible ? "Visible" : "Hidden"}
        </span>
      </td>
      <td className="px-3 py-3 text-sm text-slate-300">{work.order}</td>
      <td className="px-3 py-3 text-right text-sm text-slate-300">
        <button
          type="button"
          onClick={() => onToggleVisible(work.id, !work.isVisible)}
          className="mr-3 rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
        >
          {work.isVisible ? "Hide" : "Show"}
        </button>
        <button
          type="button"
          onClick={() => onEdit(work)}
          className="mr-2 rounded-md bg-[#1f1f1f] px-3 py-1 text-xs font-medium text-[#E31212] transition hover:bg-slate-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(work)}
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWorkId, setCurrentWorkId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    client: "",
    sectionId: "",
    videoUrl: "",
    thumbnail: "",
    description: "",
    tags: "",
    order: "",
    isVisible: true,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filteredWorks = useMemo(() => works, [works]);
  const allSelected = selectedIds.length > 0 && selectedIds.length === works.length;

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    loadWorks();
  }, [selectedSectionId]);

  async function loadSections() {
    try {
      const response = await fetch("/api/admin/sections", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load sections");
      }
      const data: SectionItem[] = await response.json();
      setSections(data);
    } catch (error) {
      toast.error("Failed to load sections.");
    }
  }

  async function loadWorks() {
    try {
      const query = selectedSectionId ? `?sectionId=${selectedSectionId}` : "";
      const response = await fetch(`/api/admin/works${query}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load works");
      }
      const data: WorkItem[] = await response.json();
      setWorks(data);
      setSelectedIds([]);
    } catch (error) {
      toast.error("Failed to load works.");
    }
  }

  function resetForm() {
    setFormState({
      title: "",
      client: "",
      sectionId: sections[0]?.id.toString() ?? "",
      videoUrl: "",
      thumbnail: "",
      description: "",
      tags: "",
      order: "",
      isVisible: true,
    });
    setCurrentWorkId(null);
    setIsEditing(false);
    setThumbnailPreview("");
  }

  function openCreateDrawer() {
    resetForm();
    setDrawerOpen(true);
  }

  function openEditDrawer(work: WorkItem) {
    setFormState({
      title: work.title,
      client: work.client,
      sectionId: work.sectionId,
      videoUrl: work.videoUrl,
      thumbnail: work.thumbnail,
      description: work.description,
      tags: work.tags.join(", "),
      order: work.order.toString(),
      isVisible: work.isVisible,
    });
    setThumbnailPreview(work.thumbnail);
    setCurrentWorkId(work.id);
    setIsEditing(true);
    setDrawerOpen(true);
  }

  function updateField(field: keyof typeof formState, value: string | boolean) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  async function uploadThumbnailFile(file: File) {
    setUploadingThumbnail(true)
    const localUrl = URL.createObjectURL(file)
    setThumbnailPreview(localUrl)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      const imageUrl = data.url

      if (!imageUrl) {
        throw new Error('No URL returned from upload')
      }

      setFormState((current) => ({ ...current, thumbnail: imageUrl }))
      setThumbnailPreview(imageUrl)
      toast.success('Thumbnail uploaded successfully.')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Thumbnail upload failed')
      setFormState((current) => ({ ...current, thumbnail: '' }))
    } finally {
      setUploadingThumbnail(false)
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadThumbnailFile(file);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    if (!formState.title.trim() || !formState.client.trim() || !formState.videoUrl.trim() || !formState.thumbnail.trim() || !formState.sectionId) {
      toast.error("Please fill in all required fields.");
      setIsSaving(false);
      return;
    }

    const payload = {
      title: formState.title.trim(),
      client: formState.client.trim(),
      sectionId: formState.sectionId,
      videoUrl: formState.videoUrl.trim(),
      thumbnail: formState.thumbnail.trim(),
      description: formState.description.trim(),
      tags: formState.tags,
      isVisible: formState.isVisible,
      order: formState.order ? Number(formState.order) : undefined,
    };

    try {
      const url = isEditing && currentWorkId ? `/api/admin/works/${currentWorkId}` : "/api/admin/works";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Unable to save work");
      }

      await loadWorks();
      toast.success(isEditing ? "Work updated." : "Work created.");
      setDrawerOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(work: WorkItem) {
    const confirmed = window.confirm(`Delete ${work.title}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/works/${work.id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Unable to delete work");
      }
      toast.success("Work deleted.");
      await loadWorks();
    } catch (error) {
      toast.error("Delete failed.");
    }
  }

  async function handleToggleVisibility(id: string, value: boolean) {
    try {
      const response = await fetch(`/api/admin/works/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: value }),
      });
      if (!response.ok) {
        throw new Error("Unable to update visibility");
      }
      setWorks((current) =>
        current.map((work: any) => (work.id === id ? { ...work, isVisible: value } : work))
      );
      toast.success("Visibility updated.");
    } catch (error) {
      toast.error("Unable to update visibility.");
    }
  }

  async function handleBulkDelete() {
    if (!selectedIds.length) return;
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected works?`);
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id: string) =>
          fetch(`/api/admin/works/${id}`, {
            method: "DELETE",
          })
        )
      );
      toast.success("Selected works deleted.");
      setSelectedIds([]);
      await loadWorks();
    } catch (error) {
      toast.error("Bulk delete failed.");
    }
  }

  async function handleBulkToggle() {
    if (!selectedIds.length) return;
    const firstSelected = works.find((work) => selectedIds.includes(work.id));
    const newValue = firstSelected ? !firstSelected.isVisible : true;

    try {
      await Promise.all(
        selectedIds.map((id: any) =>
          fetch(`/api/admin/works/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isVisible: newValue }),
          })
        )
      );
      toast.success("Visibility updated for selected works.");
      setWorks((current) =>
        current.map((work: any) =>
          selectedIds.includes(work.id) ? { ...work, isVisible: newValue } : work
        )
      );
    } catch (error) {
      toast.error("Bulk visibility update failed.");
    }
  }

  async function handleDragEnd(event: any) {
    if (!event.over) return;
    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    if (activeId === overId) return;

    const oldIndex = works.findIndex((work) => work.id === activeId);
    const newIndex = works.findIndex((work) => work.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(works, oldIndex, newIndex);
    const items = reordered.map((work: any, index: any) => ({ id: work.id, order: index + 1 }));
    setWorks(reordered.map((work: any, index: any) => ({ ...work, order: index + 1 })));

    try {
      const response = await fetch("/api/admin/works/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) {
        throw new Error("Unable to save order");
      }
      toast.success("Work order saved.");
    } catch (error) {
      toast.error("Unable to save new order.");
      await loadWorks();
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]
    );
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(works.map((work: any) => work.id));
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Works Manager</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage video works, upload thumbnails, and reorder productions across sections.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateDrawer}
          className="inline-flex items-center justify-center rounded-full bg-[#E31212] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b10d0d]"
        >
          Add Work
        </button>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800 bg-[#111111] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Filter by Section</label>
            <select
              value={selectedSectionId}
              onChange={(event) => setSelectedSectionId(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-[#E31212] sm:w-auto"
            >
              <option value="">All Sections</option>
              {sections.map((section: any) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={!selectedIds.length}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete Selected
            </button>
            <button
              type="button"
              onClick={handleBulkToggle}
              disabled={!selectedIds.length}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Toggle Visibility
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-sm uppercase tracking-[0.2em] text-slate-500">
                <th className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-[#E31212]"
                    />
                  </div>
                </th>
                <th className="px-3 py-3">Work</th>
                <th className="px-3 py-3">Section</th>
                <th className="px-3 py-3">Tags</th>
                <th className="px-3 py-3">Visible</th>
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={works.map((work: any) => work.id)} strategy={verticalListSortingStrategy}>
                  {filteredWorks.map((work: any) => (
                    <SortableWorkRow
                      key={work.id}
                      work={work}
                      selected={selectedIds.includes(work.id)}
                      onToggleSelect={toggleSelect}
                      onToggleVisible={handleToggleVisibility}
                      onEdit={openEditDrawer}
                      onDelete={handleDelete}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </tbody>
          </table>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
          <div className="relative h-full w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-800 bg-[#111111] p-8 shadow-2xl sm:p-10">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-6 top-6 text-slate-400 transition hover:text-white"
            >
              Close
            </button>
            <h2 className="text-2xl font-semibold text-white">
              {isEditing ? "Edit Work" : "Add Work"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Create or update a work item and publish it to the MO3 portfolio.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Title</span>
                  <input
                    value={formState.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-[#E31212]"
                    placeholder="Project title"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Client</span>
                  <input
                    value={formState.client}
                    onChange={(event) => updateField("client", event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-[#E31212]"
                    placeholder="Client name"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Section</span>
                  <select
                    value={formState.sectionId}
                    onChange={(event) => updateField("sectionId", event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-[#E31212]"
                  >
                    <option value="">Select a section</option>
                    {sections.map((section: any) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Video URL</span>
                  <input
                    value={formState.videoUrl}
                    onChange={(event) => updateField("videoUrl", event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-[#E31212]"
                    placeholder="YouTube or Vimeo link"
                  />
                  <VideoPreview url={formState.videoUrl} />
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Thumbnail</span>
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  className="group rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 px-4 py-8 text-center transition hover:border-[#E31212]"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        uploadThumbnailFile(file);
                      }
                    }}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-800 text-[#E31212] flex items-center justify-center text-xl">
                      +
                    </div>
                    <div className="text-sm font-medium text-slate-100">Drag & drop or click to upload</div>
                    <div className="mt-1 text-xs text-slate-500">PNG, JPG, GIF up to 10MB</div>
                  </label>
                  {thumbnailPreview && (
                    <div className="mt-4">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="mx-auto h-48 w-full max-w-sm rounded-3xl object-cover border border-slate-700"
                      />
                    </div>
                  )}
                </div>
              </label>

              <div className="space-y-4">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Description</span>
                  <textarea
                    value={formState.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    className="min-h-[120px] w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none focus:border-[#E31212]"
                    placeholder="Project description"
                  />
                </label>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Tags</span>
                    <input
                      value={formState.tags}
                      onChange={(event) => updateField("tags", event.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-[#E31212]"
                      placeholder="Comma-separated tags"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Order</span>
                    <input
                      type="number"
                      value={formState.order}
                      onChange={(event) => updateField("order", event.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-[#E31212]"
                      placeholder="Display order"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={formState.isVisible}
                      onChange={(event) => updateField("isVisible", event.target.checked)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-[#E31212]"
                    />
                    Visible on site
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    resetForm();
                  }}
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploadingThumbnail}
                  className="rounded-2xl bg-[#E31212] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b10d0d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : isEditing ? "Update work" : "Create work"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
