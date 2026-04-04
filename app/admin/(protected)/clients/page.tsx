"use client";

import { DragEvent, FormEvent, useEffect, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast, { Toaster } from "react-hot-toast";

interface ClientItem {
  id: string;
  name: string;
  logo: string;
  order: number;
  isVisible: boolean;
}

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SortableClientRow({
  client,
  onToggleVisible,
  onEdit,
  onDelete,
}: {
  client: ClientItem;
  onToggleVisible: (id: string, value: boolean) => void;
  onEdit: (client: ClientItem) => void;
  onDelete: (client: ClientItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: client.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-slate-800 hover:bg-slate-950/40">
      <td className="px-3 py-3 text-sm text-slate-300">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-slate-500 hover:text-[#E31212]"
          aria-label="Drag handle"
        >
          ≡
        </button>
      </td>
      <td className="px-3 py-3 text-sm text-slate-200">
        <div className="flex items-center gap-3">
          <img src={client.logo} alt={client.name} className="h-12 w-12 rounded object-cover border border-slate-700" />
          <div>
            <div className="font-medium text-slate-100">{client.name}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-sm text-slate-300">
        <span
          className={classNames(
            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
            client.isVisible ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700 text-slate-400"
          )}
        >
          {client.isVisible ? "Visible" : "Hidden"}
        </span>
      </td>
      <td className="px-3 py-3 text-sm text-slate-300">{client.order}</td>
      <td className="px-3 py-3 text-right text-sm text-slate-300">
        <button
          type="button"
          onClick={() => onToggleVisible(client.id, !client.isVisible)}
          className="mr-3 rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
        >
          {client.isVisible ? "Hide" : "Show"}
        </button>
        <button
          type="button"
          onClick={() => onEdit(client)}
          className="mr-2 rounded-md bg-[#1f1f1f] px-3 py-1 text-xs font-medium text-[#E31212] transition hover:bg-slate-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(client)}
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    logo: "",
    order: "",
    isVisible: true,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const response = await fetch("/api/admin/clients", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load clients");
      const data: ClientItem[] = await response.json();
      setClients(data);
    } catch (error) {
      toast.error("Failed to load clients.");
    }
  }

  function resetForm() {
    setFormState({ name: "", logo: "", order: "", isVisible: true });
    setLogoPreview("");
    setCurrentClientId(null);
    setIsEditing(false);
  }

  function openCreateDrawer() {
    resetForm();
    setDrawerOpen(true);
  }

  function openEditDrawer(client: ClientItem) {
    setFormState({
      name: client.name,
      logo: client.logo,
      order: client.order.toString(),
      isVisible: client.isVisible,
    });
    setLogoPreview(client.logo);
    setCurrentClientId(client.id);
    setIsEditing(true);
    setDrawerOpen(true);
  }

  function updateField(field: keyof typeof formState, value: string | boolean) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  async function uploadLogoFile(file: File) {
    setUploadingLogo(true);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);

    try {
      const signatureResponse = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, folder: "mo3/clients" }),
      });

      if (!signatureResponse.ok) {
        throw new Error("Unable to sign upload request");
      }

      const uploadConfig = await signatureResponse.json();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", uploadConfig.apiKey);
      formData.append("timestamp", String(uploadConfig.timestamp));
      formData.append("signature", uploadConfig.signature);
      if (uploadConfig.folder) formData.append("folder", uploadConfig.folder);
      if (uploadConfig.uploadPreset) formData.append("upload_preset", uploadConfig.uploadPreset);

      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${uploadConfig.cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });

      if (!cloudinaryResponse.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const uploaded = await cloudinaryResponse.json();
      const logoUrl = uploaded.secure_url || uploaded.url;
      if (!logoUrl) throw new Error("Cloudinary returned no image URL");

      setFormState((current) => ({ ...current, logo: logoUrl }));
      setLogoPreview(logoUrl);
      toast.success("Logo uploaded successfully.");
    } catch (error) {
      toast.error("Logo upload failed.");
      setFormState((current) => ({ ...current, logo: "" }));
    } finally {
      setUploadingLogo(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadLogoFile(file);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    if (!formState.name.trim() || !formState.logo.trim()) {
      toast.error("Name and logo are required.");
      setIsSaving(false);
      return;
    }

    const payload = {
      name: formState.name.trim(),
      logo: formState.logo.trim(),
      isVisible: formState.isVisible,
      order: formState.order ? Number(formState.order) : undefined,
    };

    try {
      const url = isEditing && currentClientId ? `/api/admin/clients/${currentClientId}` : "/api/admin/clients";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Unable to save client");
      }

      await loadClients();
      toast.success(isEditing ? "Client updated." : "Client created.");
      setDrawerOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(client: ClientItem) {
    const confirmed = window.confirm(`Delete ${client.name}?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Unable to delete client");
      }
      toast.success("Client deleted.");
      await loadClients();
    } catch (error) {
      toast.error("Delete failed.");
    }
  }

  async function handleToggleVisibility(id: string, value: boolean) {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: value }),
      });
      if (!response.ok) {
        throw new Error("Unable to update visibility");
      }
      setClients((current) => current.map((client: any) => (client.id === id ? { ...client, isVisible: value } : client)));
      toast.success("Visibility updated.");
    } catch (error) {
      toast.error("Unable to update visibility.");
    }
  }

  async function handleDragEnd(event: any) {
    if (!event.over) return;
    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    if (activeId === overId) return;

    const oldIndex = clients.findIndex((item) => item.id === activeId);
    const newIndex = clients.findIndex((item) => item.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(clients, oldIndex, newIndex);
    const items = reordered.map((item: any, index: any) => ({ id: item.id, order: index + 1 }));
    setClients(reordered.map((item: any, index: any) => ({ ...item, order: index + 1 })));

    try {
      const response = await fetch("/api/admin/clients/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) {
        throw new Error("Unable to save order");
      }
      toast.success("Client order saved.");
    } catch (error) {
      toast.error("Unable to save new order.");
      await loadClients();
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Clients Manager</h1>
          <p className="mt-2 text-sm text-slate-400">
            Upload and organize client logos for the MO3 admin dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateDrawer}
          className="inline-flex items-center justify-center rounded-full bg-[#E31212] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b10d0d]"
        >
          Add Client
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={clients.map((client: any) => client.id)} strategy={verticalListSortingStrategy}>
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111111]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[#0e0e0e]">
                  <tr>
                    <th className="px-4 py-3 text-slate-400">Drag</th>
                    <th className="px-4 py-3 text-slate-400">Client</th>
                    <th className="px-4 py-3 text-slate-400">Visible</th>
                    <th className="px-4 py-3 text-slate-400">Order</th>
                    <th className="px-4 py-3 text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client: any) => (
                    <SortableClientRow
                      key={client.id}
                      client={client}
                      onToggleVisible={handleToggleVisibility}
                      onEdit={openEditDrawer}
                      onDelete={handleDelete}
                    />
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                        No clients found. Add a client to start managing logos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SortableContext>
      </DndContext>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[#121212] p-6 shadow-2xl sm:w-[420px]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {isEditing ? "Edit Client" : "Add Client"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Add a new client logo or update an existing partner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Client Name</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-[#E31212]"
                  placeholder="Studio Name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Logo Upload</label>
                <div
                  className="group flex h-48 items-center justify-center rounded-3xl border-2 border-dashed border-slate-700 bg-slate-950 transition hover:border-[#E31212]"
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="h-full w-full rounded-3xl object-contain" />
                  ) : (
                    <div className="text-center text-sm text-slate-500 group-hover:text-slate-300">
                      <p>Drag & drop a logo here</p>
                      <p className="mt-2">or click to browse</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) uploadLogoFile(file);
                    }}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">Upload a white or transparent logo for the client list.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Order</label>
                <input
                  type="number"
                  value={formState.order}
                  onChange={(event) => updateField("order", event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-[#E31212]"
                  placeholder="Leave empty to append"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={formState.isVisible}
                    onChange={(event) => updateField("isVisible", event.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-[#E31212]"
                  />
                  Visible on site
                </label>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-3xl bg-[#E31212] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b10d0d] disabled:opacity-60"
              >
                {isSaving ? "Saving..." : isEditing ? "Update Client" : "Create Client"}
              </button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
