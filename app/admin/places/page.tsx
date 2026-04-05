'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import type { WorkLocation, WorkLocationForm } from '@/types/place'
import toast from 'react-hot-toast'
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react'

const MiniMapComponent = dynamic(
  () => import('@/components/MiniMapComponent'),
  { ssr: false }
)

const CATEGORIES = [
  'Commercial Ad',
  'Reel', 
  'Podcast',
  'Video Clip',
  'Other'
]

const emptyForm: Omit<WorkLocationForm, 'category'> & { category: string } = {
  project_name: '',
  client_name: '',
  city: '',
  governorate: '',
  lat: 0,
  lng: 0,
  category: 'Commercial Ad',
  description: '',
  project_url: '',
}

export default function PlacesAdminPage() {
  const [places, setPlaces] = useState<WorkLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function fetchPlaces() {
    try {
      const { data, error } = await supabase
        .from('work_locations')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) setPlaces(data)
    } catch (err: any) {
      console.error('Fetch error:', err)
      toast.error('Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlaces() }, [])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setModalOpen(true)
  }

  function openEdit(place: WorkLocation) {
    setForm({
      project_name: place.project_name,
      client_name: place.client_name || '',
      city: place.city,
      governorate: place.governorate || '',
      lat: place.lat,
      lng: place.lng,
      category: place.category,
      description: place.description || '',
      project_url: place.project_url || '',
    })
    setEditingId(place.id)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.project_name || !form.city || form.lat === 0 || form.lng === 0) {
      toast.error('Please fill all required fields and pick a location on the map')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        const { error } = await supabase
          .from('work_locations')
          .update(form)
          .eq('id', editingId)
        if (error) throw error
        toast.success('Location updated!')
      } else {
        const { error } = await supabase
          .from('work_locations')
          .insert([form])
        if (error) throw error
        toast.success('Location added!')
      }
      setModalOpen(false)
      fetchPlaces()
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('work_locations')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast.success('Location deleted!')
      setDeleteId(null)
      fetchPlaces()
    } catch (err: any) {
      toast.error(err.message || 'Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-[#E31212]" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Work Locations
            </h1>
            <p className="text-sm text-[#888]">
              Manage cities and projects on the map
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-[#E31212] px-4 py-2 text-sm font-medium text-white hover:bg-[#c01010] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Location
        </button>
      </div>

      <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E31212] border-t-transparent" />
          </div>
        ) : places.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <MapPin className="h-8 w-8 text-[#444]" />
            <p className="text-[#888]">No locations yet</p>
            <button
              onClick={openAdd}
              className="text-sm text-[#E31212] hover:underline"
            >
              Add your first location
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222] text-left text-xs text-[#888] uppercase tracking-wider">
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Coordinates</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place, i) => (
                <tr
                  key={place.id}
                  className={`border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors ${
                    i % 2 === 0 ? '' : 'bg-[#0d0d0d]'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white text-sm">{place.city}</p>
                      {place.governorate && (
                        <p className="text-xs text-[#555]">{place.governorate}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#aaa]">{place.project_name}</td>
                  <td className="px-4 py-3 text-sm text-[#888]">{place.client_name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#E31212]/20 px-2 py-0.5 text-xs text-[#E31212] font-medium">
                      {place.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#666] font-mono">
                    {Number(place.lat).toFixed(4)}, {Number(place.lng).toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(place)}
                        className="rounded-lg p-1.5 text-[#888] hover:bg-[#222] hover:text-white transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(place.id)}
                        className="rounded-lg p-1.5 text-[#888] hover:bg-red-900/30 hover:text-[#E31212] transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#222] bg-[#111] p-6">
            
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Location' : 'Add New Location'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#888] hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">Project Name *</label>
                  <input
                    value={form.project_name}
                    onChange={e => setForm(p => ({ ...p, project_name: e.target.value }))}
                    placeholder="e.g. Brand Commercial"
                    className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#E31212] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">Client Name</label>
                  <input
                    value={form.client_name}
                    onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))}
                    placeholder="e.g. Rich Key Real Estate"
                    className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#E31212] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">City *</label>
                  <input
                    value={form.city}
                    onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    placeholder="e.g. Cairo"
                    className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#E31212] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">Governorate</label>
                  <input
                    value={form.governorate}
                    onChange={e => setForm(p => ({ ...p, governorate: e.target.value }))}
                    placeholder="e.g. القاهرة"
                    className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#E31212] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-[#E31212] focus:outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of the project..."
                  rows={2}
                  maxLength={200}
                  className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] resize-none focus:border-[#E31212] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">Project URL (optional)</label>
                <input
                  value={form.project_url}
                  onChange={e => setForm(p => ({ ...p, project_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#E31212] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">Latitude *</label>
                  <input
                    type="number"
                    value={form.lat || ''}
                    onChange={e => setForm(p => ({ ...p, lat: parseFloat(e.target.value) || 0 }))}
                    placeholder="e.g. 30.0444"
                    step="0.000001"
                    className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#E31212] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[#888] uppercase tracking-wider">Longitude *</label>
                  <input
                    type="number"
                    value={form.lng || ''}
                    onChange={e => setForm(p => ({ ...p, lng: parseFloat(e.target.value) || 0 }))}
                    placeholder="e.g. 31.2357"
                    step="0.000001"
                    className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#E31212] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-[#888] uppercase tracking-wider">📍 Pick Location on Map</label>
                <div className="h-56 w-full overflow-hidden rounded-lg border border-[#333]">
                  <MiniMapComponent
                    onLocationSelect={(lat, lng) => setForm(p => ({ ...p, lat, lng }))}
                    selectedLat={form.lat}
                    selectedLng={form.lng}
                  />
                </div>
                {form.lat !== 0 && form.lng !== 0 && (
                  <p className="mt-1 text-xs text-[#E31212]">
                    ✓ Location set: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
                  </p>
                )}
              </div>

            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[#333] px-4 py-2 text-sm text-[#888] hover:text-white hover:border-[#555] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#E31212] px-6 py-2 text-sm font-medium text-white hover:bg-[#c01010] disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  editingId ? 'Update Location' : 'Add Location'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#333] bg-[#111] p-6">
            <h3 className="mb-2 text-lg font-bold text-white">Delete Location?</h3>
            <p className="mb-6 text-sm text-[#888]">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-[#333] px-4 py-2 text-sm text-[#888] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="rounded-lg bg-[#E31212] px-4 py-2 text-sm font-medium text-white hover:bg-[#c01010] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
