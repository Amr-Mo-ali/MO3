'use client'
import { useEffect, useState } from 'react'
import type { LatLngExpression } from 'leaflet'

interface MiniMapProps {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLat?: number
  selectedLng?: number
}

export default function MiniMapComponent({ 
  onLocationSelect,
  selectedLat,
  selectedLng
}: MiniMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    selectedLat && selectedLng ? [selectedLat, selectedLng] : null
  )

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    }
  }, [])

  if (!isMounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#111111]">
        <p className="text-gray-400 text-sm">Loading map...</p>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, useMapEvents } = require('react-leaflet')
  require('leaflet/dist/leaflet.css')

  function ClickHandler() {
    useMapEvents({
      click: (e: any) => {
        const { lat, lng } = e.latlng
        setMarkerPos([lat, lng])
        onLocationSelect(lat, lng)
      }
    })
    return null
  }

  return (
    <MapContainer
      center={[26.8206, 30.8025] as LatLngExpression}
      zoom={6}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      <ClickHandler />
      {markerPos && (
        <Marker position={markerPos as LatLngExpression} />
      )}
    </MapContainer>
  )
}
