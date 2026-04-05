'use client'

import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { WorkLocation, WorkLocationForm, CategoryType } from '@/types/place'
import { X } from 'lucide-react'

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)

const CATEGORIES: CategoryType[] = ['Commercial Ad', 'Reel', 'Podcast', 'Video Clip', 'Other']

interface PlaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: WorkLocationForm) => void
  editingLocation?: WorkLocation | null
  isLoading?: boolean
}

export default function PlaceModal({
  isOpen,
  onClose,
  onSubmit,
  editingLocation,
  isLoading = false,
}: PlaceModalProps) {
  const [formData, setFormData] = useState<WorkLocationForm>(
    editingLocation
      ? {
          project_name: editingLocation.project_name,
          client_name: editingLocation.client_name,
          city: editingLocation.city,
          governorate: editingLocation.governorate || '',
          lat: editingLocation.lat,
          lng: editingLocation.lng,
          category: editingLocation.category,
          description: editingLocation.description || '',
          project_url: editingLocation.project_url || '',
        }
      : {
          project_name: '',
          client_name: '',
          city: '',
          governorate: '',
          lat: 26.8206,
          lng: 30.8025,
          category: 'Commercial Ad',
          description: '',
          project_url: '',
        }
  )

  const mapRef = useRef<any>(null)

  const handleMapClick = (e: any) => {
    setFormData(prev => ({
      ...prev,
      lat: parseFloat(e.latlng.lat.toFixed(4)),
      lng: parseFloat(e.latlng.lng.toFixed(4)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.project_name || !formData.client_name || !formData.city) {
      alert('Project name, client, and city are required')
      return
    }
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lat' || name === 'lng' ? parseFloat(value) : value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
          <h2 className="text-xl font-semibold text-white">
            {editingLocation ? 'Edit Location' : 'Add New Location'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              placeholder="e.g., Brand Identity Film"
              required
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Client Name *
            </label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              placeholder="e.g., Acme Corporation"
              required
            />
          </div>

          {/* City & Governorate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                placeholder="e.g., Cairo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Governorate
              </label>
              <input
                type="text"
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                placeholder="e.g., القاهرة"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-red-600"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (max 200 chars)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 resize-none"
              placeholder="Short description of the project..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length} / 200
            </p>
          </div>

          {/* Project URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project URL
            </label>
            <input
              type="url"
              name="project_url"
              value={formData.project_url}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              placeholder="https://example.com"
            />
          </div>

          {/* Mini Map */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location on Map (click to pin) *
            </label>
            <div className="h-64 rounded border border-gray-700 overflow-hidden">
              <MapContainer
                center={[formData.lat, formData.lng]}
                zoom={6}
                style={{ width: '100%', height: '100%' }}
                onClick={handleMapClick}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  maxZoom={19}
                />
                {formData.lat && formData.lng && (
                  <Marker position={[formData.lat, formData.lng]}>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Latitude *
              </label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                step="0.0001"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Longitude *
              </label>
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                step="0.0001"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Fix Leaflet icon issue
let L: any
if (typeof window !== 'undefined') {
  const leaflet = require('leaflet')
  L = leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}
