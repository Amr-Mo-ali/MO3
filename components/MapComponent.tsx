'use client'
import { useEffect, useState } from 'react'
import type { LatLngExpression } from 'leaflet'

interface Location {
  id: string
  city: string
  project_name: string
  client_name?: string
  category: string
  description?: string
  lat: number
  lng: number
}

interface MapComponentProps {
  locations: Location[]
  onMarkerClick?: (location: Location) => void
}

export default function MapComponent({ 
  locations, 
  onMarkerClick 
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)

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
      <div className="flex h-full w-full items-center justify-center bg-[#111111] rounded-xl">
        <p className="text-gray-400">Loading map...</p>
      </div>
    )
  }

  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
  } = require('react-leaflet')
  
  require('leaflet/dist/leaflet.css')

  function ClickHandler({ onClick }: { onClick: (e: any) => void }) {
    useMapEvents({ click: onClick })
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
      {locations?.map((location: Location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng] as LatLngExpression}
          eventHandlers={{
            click: () => onMarkerClick?.(location)
          }}
        >
          <Popup>
            <div style={{ 
              background: '#111', 
              color: '#fff', 
              padding: '8px',
              borderRadius: '8px',
              minWidth: '150px'
            }}>
              <p style={{ 
                color: '#E31212', 
                fontWeight: 'bold',
                marginBottom: '4px' 
              }}>
                {location.city}
              </p>
              <p style={{ fontSize: '14px' }}>
                {location.project_name}
              </p>
              {location.client_name && (
                <p style={{ 
                  fontSize: '12px', 
                  color: '#888',
                  marginTop: '4px' 
                }}>
                  {location.client_name}
                </p>
              )}
              <span style={{
                display: 'inline-block',
                marginTop: '6px',
                padding: '2px 8px',
                background: '#E31212',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#fff'
              }}>
                {location.category}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
