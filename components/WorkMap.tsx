'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useRef, useEffect } from 'react'
import { WorkLocation, CategoryType } from '@/types/place'

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
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
const useMap = dynamic(
  () => import('react-leaflet').then(mod => mod.useMap),
  { ssr: false, loading: () => null }
)

const CATEGORIES: CategoryType[] = ['Commercial Ad', 'Reel', 'Podcast', 'Video Clip', 'Other']

interface WorkMapProps {
  locations: WorkLocation[]
}

export default function WorkMap({ locations }: WorkMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All')
  const mapRef = useRef<any>(null)

  const filteredLocations = useMemo(() => {
    if (selectedCategory === 'All') return locations
    return locations.filter(loc => loc.category === selectedCategory)
  }, [locations, selectedCategory])

  const handleFlyToMarker = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 8, { duration: 1.5 })
    }
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="font-bebas text-6xl md:text-7xl font-bold text-white mb-2 tracking-wide">
          WHERE WE'VE WORKED
        </h2>
        <p className="text-gray-400 text-lg md:text-xl">
          From Cairo to Alexandria — stories told across Egypt
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded transition-all font-medium ${
            selectedCategory === 'All'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded transition-all font-medium ${
              selectedCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map and Sidebar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-2xl h-96 lg:h-[600px]">
          <div className="relative w-full h-full bg-gray-900">
            <style>{`
              .leaflet-marker-custom {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #E31212;
                box-shadow: 0 0 0 0 rgba(227, 18, 18, 0.7);
                animation: pulse 2s infinite;
              }
              @keyframes pulse {
                0% {
                  box-shadow: 0 0 0 0 rgba(227, 18, 18, 0.7);
                }
                50% {
                  box-shadow: 0 0 0 10px rgba(227, 18, 18, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(227, 18, 18, 0);
                }
              }
            `}</style>
            <MapContainer
              center={[26.8206, 30.8025]}
              zoom={6}
              style={{ width: '100%', height: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                maxZoom={19}
              />
              {filteredLocations.map(location => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={
                    L.divIcon({
                      className: 'leaflet-marker-custom',
                      iconSize: [12, 12],
                      popupAnchor: [0, -15],
                    }) as any
                  }
                >
                  <Popup className="dark-popup">
                    <div className="bg-gray-900 border border-red-600 rounded p-4 min-w-64">
                      <h3 className="font-bebas text-xl text-white mb-1">
                        {location.city}
                      </h3>
                      <p className="text-red-500 font-semibold mb-2">
                        {location.project_name}
                      </p>
                      <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded mb-3">
                        {location.category}
                      </span>
                      {location.client_name && (
                        <p className="text-gray-300 text-sm mb-2">
                          <span className="text-gray-500">Client:</span> {location.client_name}
                        </p>
                      )}
                      {location.description && (
                        <p className="text-gray-400 text-sm">{location.description}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="lg:col-span-1">
          <div className="space-y-3 max-h-96 lg:max-h-[600px] overflow-y-auto pr-2">
            {filteredLocations.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No projects found in this category
              </div>
            ) : (
              filteredLocations.map(location => (
                <button
                  key={location.id}
                  onClick={() => handleFlyToMarker(location.lat, location.lng)}
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
              ))
            )}
          </div>
        </div>
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
