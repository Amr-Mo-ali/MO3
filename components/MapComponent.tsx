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
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  // Primary color for styling
  const PRIMARY_COLOR = '#C800DF'
  const PRIMARY_RGB = '200, 0, 223'

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!containerRef.current) return
    if (mapRef.current) return

    const initMap = async () => {
      const L = await import('leaflet')

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        center: [26.8206, 30.8025],
        zoom: 6,
        zoomControl: true,
      })

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { attribution: '&copy; OpenStreetMap &copy; CARTO' }
      ).addTo(map)

      markersLayerRef.current = L.layerGroup().addTo(map)
      mapRef.current = map
      setReady(true)
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersLayerRef.current = null
        setReady(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!mapRef.current) return
    if (!markersLayerRef.current) return

    const updateMarkers = async () => {
      const L = await import('leaflet')
      
      markersLayerRef.current.clearLayers()

      locations.forEach((place) => {
        const isSelected = place.id === selectedId

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              position: relative;
              width: ${isSelected ? '22px' : '16px'};
              height: ${isSelected ? '22px' : '16px'};
            ">
              <div style="
                width: 100%;
                height: 100%;
                background: ${PRIMARY_COLOR};
                border-radius: 50%;
                border: 2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.4)'};
                box-shadow: 0 0 ${isSelected ? '16px' : '8px'} rgba(${PRIMARY_RGB},0.9);
              "></div>
              <style>
                @keyframes ripple {
                  0% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
                  100% { transform: translate(-50%,-50%) scale(3); opacity: 0; }
                }
              </style>
              <div style="
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%,-50%);
                width: ${isSelected ? '44px' : '32px'};
                height: ${isSelected ? '44px' : '32px'};
                background: rgba(${PRIMARY_RGB},0.25);
                border-radius: 50%;
                animation: ripple 2s ease-out infinite;
                pointer-events: none;
              "></div>
            </div>
          `,
          iconSize: [isSelected ? 22 : 16, isSelected ? 22 : 16],
          iconAnchor: [isSelected ? 11 : 8, isSelected ? 11 : 8],
          popupAnchor: [0, -20],
        })

        const popup = L.popup({
          className: 'mo3-popup',
          maxWidth: 220,
          closeButton: true,
        }).setContent(`
          <div style="
            background: #111;
            color: #fff;
            padding: 12px;
            border-radius: 10px;
            border: 1px solid #333;
            font-family: var(--font-jost), Jost, sans-serif;
            min-width: 180px;
          ">
            <p style="color:${PRIMARY_COLOR};font-weight:700;
                      font-size:15px;margin:0 0 5px">
              ${place.city}
            </p>
            <p style="font-size:13px;color:#ddd;margin:0 0 4px">
              ${place.project_name}
            </p>
            ${place.client_name 
              ? `<p style="font-size:12px;color:#888;margin:0 0 8px">
                   ${place.client_name}
                 </p>` 
              : ''}
            <span style="
              display:inline-block;
              padding:2px 10px;
              background:${PRIMARY_COLOR};
              border-radius:20px;
              font-size:11px;
              color:#fff;
            ">${place.category}</span>
            ${place.description 
              ? `<p style="font-size:11px;color:#666;margin:8px 0 0">
                   ${place.description}
                 </p>` 
              : ''}
            ${place.project_url 
              ? `<a href="${place.project_url}" 
                    target="_blank"
                    style="display:block;margin-top:8px;
                           font-size:11px;color:${PRIMARY_COLOR}">
                   View Project →
                 </a>` 
              : ''}
          </div>
        `)

        const marker = L.marker(
          [Number(place.lat), Number(place.lng)],
          { icon }
        ).bindPopup(popup)

        marker.on('click', () => {
          onMarkerClick?.(place)
        })

        markersLayerRef.current.addLayer(marker)
      })
    }

    updateMarkers()
  }, [ready, locations, selectedId, onMarkerClick])

  useEffect(() => {
    if (!ready || !mapRef.current || !selectedId) return
    const place = locations.find(p => p.id === selectedId)
    if (place) {
      mapRef.current.flyTo(
        [Number(place.lat), Number(place.lng)],
        10,
        { duration: 1.5, easeLinearity: 0.25 }
      )
    }
  }, [selectedId, ready, locations])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center 
                        justify-center bg-[#111]">
          <div className="text-center">
            <div className="mb-3 h-8 w-8 animate-spin 
                            rounded-full border-2 
                            border-[#C800DF] 
                            border-t-transparent mx-auto" />
            <p className="text-sm text-[#888]">
              Loading map...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
