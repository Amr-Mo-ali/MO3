'use client'

import { WorkLocation, CategoryType } from '@/types/place'
import { Edit2, Trash2, Plus } from 'lucide-react'

const CATEGORIES: CategoryType[] = ['Commercial Ad', 'Reel', 'Podcast', 'Video Clip', 'Other']

interface PlaceTableProps {
  locations: WorkLocation[]
  onEdit: (location: WorkLocation) => void
  onDelete: (id: string) => void
  onAddNew: () => void
}

export default function PlaceTable({
  locations,
  onEdit,
  onDelete,
  onAddNew,
}: PlaceTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onAddNew}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
      >
        <Plus size={18} />
        Add New Location
      </button>

      <div className="overflow-x-auto rounded border border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-200">City</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-200">Project</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-200">Client</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-200">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-200">Date Added</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No locations added yet
                </td>
              </tr>
            ) : (
              locations.map(location => (
                <tr key={location.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{location.city}</td>
                  <td className="px-4 py-3 text-gray-300">{location.project_name}</td>
                  <td className="px-4 py-3 text-gray-300">{location.client_name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-800 text-red-500 px-2 py-1 rounded text-xs font-medium">
                      {location.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(location.created_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(location)}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => onDelete(location.id)}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
