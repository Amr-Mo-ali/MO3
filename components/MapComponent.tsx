'use client'
import { useEffect, useRef, useState } from 'react'
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
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    const L = require('leaflet')
    require('leaflet/dist/leaflet.css')

    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })

    const map = L.map(mapContainerRef.current, {
      center: [26.8206, 30.8025],
      zoom: 6,
      zoomControl: true,
    })

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { attribution: '&copy; OpenStreetMap &copy; CARTO' }
    ).addTo(map)

    mapInstanceRef.current = map
    setIsReady(true)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isReady) return
    if (!mapInstanceRef.current) return
    if (typeof window === 'undefined') return

    const L = require('leaflet')
    const map = mapInstanceRef.current

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    console.log('Adding markers for:', locations.length, 'locations')

    locations.forEach((place: Place) => {
      const isSelected = place.id === selectedId

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            position:relative;
            width:${isSelected ? '20px' : '14px'};
            height:${isSelected ? '20px' : '14px'};
          ">
            <div style="
              width:100%;
              height:100%;
              background:#E31212;
              border-radius:50%;
              border:2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.4)'};
              box-shadow:0 0 ${isSelected ? '14px' : '6px'} rgba(227,18,18,0.9);
            "></div>
            <div style="
              position:absolute;
              top:50%;left:50%;
              transform:translate(-50%,-50%);
              width:${isSelected ? '40px' : '28px'};
              height:${isSelected ? '40px' : '28px'};
              background:rgba(227,18,18,0.2);
              border-radius:50%;
              animation:pulse 2s infinite;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0%{transform:translate(-50%,-50%) scale(1);opacity:0.8}
              100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}
            }
          </style>
        `,
        iconSize: [isSelected ? 20 : 14, isSelected ? 20 : 14],
        iconAnchor: [isSelected ? 10 : 7, isSelected ? 10 : 7],
        popupAnchor: [0, -15],
      })

      const popupContent = `
        <div style="
          background:#111;
          color:#fff;
          padding:12px;
          border-radius:8px;
          min-width:180px;
          font-family:DM Sans,sans-serif;
          border:1px solid #333;
        ">
          <p style="color:#E31212;font-weight:700;font-size:15px;margin:0 0 4px">${place.city}</p>
          <p style="font-size:13px;color:#ccc;margin:0 0 4px">${place.project_name}</p>
          ${place.client_name ? `<p style="font-size:12px;color:#888;margin:0 0 8px">${place.client_name}</p>` : ''}
          <span style="
            display:inline-block;padding:2px 10px;
            background:#E31212;border-radius:20px;
            font-size:11px;color:#fff;
          ">${place.category}</span>
          ${place.description ? `<p style="font-size:11px;color:#666;margin:8px 0 0">${place.description}</p>` : ''}
          ${place.project_url ? `<a href="${place.project_url}" target="_blank" style="display:block;margin-top:8px;font-size:11px;color:#E31212">View Project →</a>` : ''}
        </div>
      `

      const marker = L.marker(
        [Number(place.lat), Number(place.lng)],
        { icon }
      )
        .addTo(map)
        .bindPopup(popupContent, {
          className: 'dark-popup',
          maxWidth: 250,
        })

      marker.on('click', () => {
        onMarkerClick?.(place)
      })

      markersRef.current.push(marker)
    })

  }, [isReady, locations, selectedId, onMarkerClick])

  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return
    if (!selectedId) return
    const place = locations.find(p => p.id === selectedId)
    if (place) {
      mapInstanceRef.current.flyTo(
        [Number(place.lat), Number(place.lng)], 
        10, 
        { duration: 1.5 }
      )
    }
  }, [selectedId, isReady, locations])

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center 
                        justify-center bg-[#111111]">
          <div className="text-center">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full 
                            border-2 border-[#E31212] 
                            border-t-transparent mx-auto" />
            <p className="text-sm text-[#888]">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
