'use client'
import { useEffect, useState } from 'react'

interface Props {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLat?: number
  selectedLng?: number
}

export default function MiniMapComponent({ 
  onLocationSelect,
  selectedLat,
  selectedLng
}: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [marker, setMarker] = useState<[number,number] | null>(
    selectedLat && selectedLng 
      ? [selectedLat, selectedLng] 
      : null
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
      <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-[#C800DF] border-t-transparent mx-auto" />
          <p className="text-xs text-[#888]">Loading map...</p>
        </div>
      </div>
    )
  }

  const { 
    MapContainer, 
    TileLayer, 
    Marker, 
    useMapEvents 
  } = require('react-leaflet')
  
  require('leaflet/dist/leaflet.css')

  function ClickHandler() {
    useMapEvents({
      click: (e: any) => {
        const { lat, lng } = e.latlng
        setMarker([lat, lng])
        onLocationSelect(
          parseFloat(lat.toFixed(6)), 
          parseFloat(lng.toFixed(6))
        )
      }
    })
    return null
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[26.8206, 30.8025]}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <ClickHandler />
        {marker && <Marker position={marker} />}
      </MapContainer>
      <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white bg-black/50 py-1 z-[1000]">
        Click anywhere on the map to set location
      </p>
    </div>
  )
}
