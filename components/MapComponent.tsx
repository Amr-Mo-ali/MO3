'use client'
import { useEffect, useState, useRef } from 'react'
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
  const mapRef = useRef<any>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      if (L.Icon.Default.prototype._getIconUrl) {
        delete L.Icon.Default.prototype._getIconUrl
      }
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
        <div className="text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#E31212] border-t-transparent mx-auto" />
          <p className="text-sm text-[#888]">Loading map...</p>
        </div>
      </div>
    )
  }

  const L = require('leaflet')
  const { 
    MapContainer, 
    TileLayer, 
    Marker, 
    Popup,
    useMap,
    useMapEvents
  } = require('react-leaflet')
  
  require('leaflet/dist/leaflet.css')

  function FlyTo({ id }: { id?: string }) {
    const map = useMap()
    useEffect(() => {
      if (!id) return
      const place = locations.find(l => l.id === id)
      if (place) {
        map.flyTo([place.lat, place.lng], 10, { duration: 1.5 })
      }
    }, [id, map, locations])
    return null
  }

  function createIcon(isSelected: boolean) {
    return L.divIcon({
      className: '',
      html: `
        <div style="position:relative;width:${isSelected?'24px':'16px'};height:${isSelected?'24px':'16px'}">
          <div style="
            width:100%;height:100%;
            background:#E31212;
            border-radius:50%;
            border:2px solid ${isSelected?'#fff':'rgba(255,255,255,0.3)'};
            box-shadow:0 0 ${isSelected?'16px':'8px'} rgba(227,18,18,0.8);
          "></div>
          <div style="
            position:absolute;
            top:50%;left:50%;
            transform:translate(-50%,-50%);
            width:${isSelected?'48px':'32px'};
            height:${isSelected?'48px':'32px'};
            background:rgba(227,18,18,0.15);
            border-radius:50%;
            animation:mapPulse 2s ease-out infinite;
          "></div>
        </div>
        <style>
          @keyframes mapPulse {
            0%{transform:translate(-50%,-50%) scale(1);opacity:1}
            100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}
          }
        </style>
      `,
      iconSize: [isSelected ? 24 : 16, isSelected ? 24 : 16],
      iconAnchor: [isSelected ? 12 : 8, isSelected ? 12 : 8],
      popupAnchor: [0, -20],
    })
  }

  return (
    <MapContainer
      center={[26.8206, 30.8025]}
      zoom={6}
      style={{ width: '100%', height: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      
      <FlyTo id={selectedId} />

      {locations.map((place: Place) => (
        <Marker
          key={place.id}
          position={[Number(place.lat), Number(place.lng)]}
          icon={createIcon(place.id === selectedId)}
          eventHandlers={{
            click: () => onMarkerClick?.(place)
          }}
        >
          <Popup>
            <div style={{
              background:'#111',
              color:'#fff',
              padding:'12px',
              borderRadius:'8px',
              minWidth:'180px',
              fontFamily:'DM Sans, sans-serif',
              border:'1px solid #333'
            }}>
              <p style={{color:'#E31212',fontWeight:'700',
                         fontSize:'16px',margin:'0 0 4px'}}>
                {place.city}
              </p>
              <p style={{fontSize:'13px',color:'#ccc',
                         margin:'0 0 4px'}}>
                {place.project_name}
              </p>
              {place.client_name && (
                <p style={{fontSize:'12px',color:'#888',
                           margin:'0 0 8px'}}>
                  {place.client_name}
                </p>
              )}
              <span style={{
                display:'inline-block',
                padding:'2px 10px',
                background:'#E31212',
                borderRadius:'20px',
                fontSize:'11px',
                color:'#fff'
              }}>
                {place.category}
              </span>
              {place.description && (
                <p style={{fontSize:'11px',color:'#666',
                           margin:'8px 0 0'}}>
                  {place.description}
                </p>
              )}
              {place.project_url && (
                <a href={place.project_url}
                   target="_blank"
                   rel="noopener noreferrer"
                   style={{display:'block',marginTop:'8px',
                           fontSize:'11px',color:'#E31212'}}>
                  View Project →
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
