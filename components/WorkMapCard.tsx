'use client'

import { WorkLocation } from '@/types/place'

interface WorkMapCardProps {
  location: WorkLocation
  onSelect: (lat: number, lng: number) => void
}

export default function WorkMapCard({ location, onSelect }: WorkMapCardProps) {
  return (
    <button
      onClick={() => onSelect(location.lat, location.lng)}
      className="w-full text-left p-4 bg-gray-900 border-l-4 border-red-600 rounded hover:bg-gray-800 transition-colors group"
    >
      <h4 className="font-bebas text-lg text-white group-hover:text-red-500 transition-colors">
        {location.city}
      </h4>
      <p className="text-red-500 text-sm font-medium mt-1">
        {location.project_name}
      </p>
      <span className="inline-block bg-gray-800 text-red-500 text-xs px-2 py-1 rounded mt-2">
        {location.category}
      </span>
    </button>
  )
}
