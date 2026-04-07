'use client'
import { useEffect, useState } from 'react'
import type { Place } from '@/types/place'

interface Props {
  locations: Place[]
  onMarkerClick?: (place: Place) => void
  selectedId?: string
}

export default function MapComponent({ 
  locations, 
  onMarkerClick,
  selectedId
}: Props) {
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
        <div className="text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#E31212] border-t-transparent mx-auto" />
          <p className="text-sm text-[#888]">Loading map...</p>
        </div>
      </div>
    )
  }

  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
  } = require('react-leaflet')

  require('leaflet/dist/leaflet.css')

  function FlyToMarker({ place }: { place: Place | null }) {
    const map = useMap()
    useEffect(() => {
      if (place) {
        map.flyTo([place.lat, place.lng], 10, { 
          duration: 1.5 
        })
      }
    }, [place, map])
    return null
  }

  const selected = locations.find(l => l.id === selectedId) || null

  return (
    <MapContainer
      center={[26.8206, 30.8025]}
      zoom={6}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      
      <FlyToMarker place={selected} />

      {locations.map((place: Place) => {
        const L = require('leaflet')
        const isSelected = place.id === selectedId
        
        const customIcon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: ${isSelected ? '20px' : '14px'};
              height: ${isSelected ? '20px' : '14px'};
              background: #E31212;
              border-radius: 50%;
              border: 2px solid ${isSelected ? '#fff' : '#800000'};
              box-shadow: 0 0 ${isSelected ? '12px' : '6px'} #E31212;
              transition: all 0.3s;
            ">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${isSelected ? '36px' : '28px'};
                height: ${isSelected ? '36px' : '28px'};
                background: rgba(227,18,18,0.2);
                border-radius: 50%;
                animation: pulse 2s infinite;
              "></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(place)
            }}
          >
            <Popup className="dark-popup">
              <div style={{
                background: '#111111',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '12px',
                minWidth: '180px',
                color: '#fff',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                <p style={{ 
                  color: '#E31212', 
                  fontWeight: '700',
                  fontSize: '16px',
                  marginBottom: '4px',
                  margin: '0 0 4px 0'
                }}>
                  {place.city}
                </p>
                <p style={{ 
                  fontSize: '13px',
                  color: '#ccc',
                  margin: '0 0 4px 0'
                }}>
                  {place.project_name}
                </p>
                {place.client_name && (
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#888',
                    margin: '0 0 8px 0'
                  }}>
                    {place.client_name}
                  </p>
                )}
                <span style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  background: '#E31212',
                  borderRadius: '20px',
                  fontSize: '11px',
                  color: '#fff',
                  fontWeight: '600'
                }}>
                  {place.category}
                </span>
                {place.project_url && (
                  <a 
                    href={place.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      marginTop: '8px',
                      fontSize: '11px',
                      color: '#E31212',
                      textDecoration: 'none'
                    }}
                  >
                    View Project →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
