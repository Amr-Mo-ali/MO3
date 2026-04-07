'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import type { Place, PlaceCategory } from '@/types/place'

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#111111]">
        <div className="text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#E31212] border-t-transparent mx-auto" />
          <p className="text-sm text-[#888]">Loading map...</p>
        </div>
      </div>
    )
  }
)

const CATEGORIES: PlaceCategory[] = [
  'All',
  'Commercial Ad', 
  'Reel',
  'Podcast',
  'Video Clip',
  'Other'
]

const CATEGORY_COLORS: Record<string, string> = {
  'Commercial Ad': '#E31212',
  'Reel': '#ff6b35',
  'Podcast': '#8b5cf6',
  'Video Clip': '#06b6d4',
  'Other': '#888888',
}

export default function WorkMap() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PlaceCategory>('All')
  const [selectedId, setSelectedId] = useState<string | undefined>()

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const { data, error } = await supabase
          .from('work_locations')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        console.log('Fetched places:', data)
        if (data) setPlaces(data)
      } catch (err) {
        console.error('Error fetching places:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlaces()
  }, [])

  const filtered = filter === 'All'
    ? places
    : places.filter(p => p.category === filter)

  const handleCardClick = (place: Place) => {
    setSelectedId(place.id)
  }

  return (
    <section className="bg-[color:var(--bg-primary)] py-20 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[6px] text-[#E31212]">
            OUR REACH
          </p>
          <h2 style={{ fontFamily: 'Bebas Neue, cursive' }}
              className="text-5xl md:text-7xl text-white leading-none">
            WHERE WE'VE WORKED
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-16 bg-[#E31212]" />
          <p className="mt-4 text-[#888888] text-sm md:text-base">
            From Cairo to Alexandria — stories told across Egypt
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                filter === cat
                  ? 'bg-[#E31212] text-white shadow-lg shadow-red-900/30'
                  : 'border border-[#333] text-[#888] hover:border-[#E31212] hover:text-white'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-2 text-xs opacity-70">
                  ({places.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="h-[400px] md:h-[550px] flex-1 overflow-hidden rounded-2xl border border-[#222222]">
            {loading ? (
              <div className="flex h-full items-center justify-center bg-[#111111]">
                <div className="text-center">
                  <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#E31212] border-t-transparent mx-auto" />
                  <p className="text-sm text-[#888]">Loading locations...</p>
                </div>
              </div>
            ) : (
              <MapComponent
                key={filtered.length}
                locations={filtered}
                onMarkerClick={(place) => setSelectedId(place.id)}
                selectedId={selectedId}
              />
            )}
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-80 lg:max-h-[550px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-[#111] scrollbar-thumb-[#333]">
            
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-[#111] border border-[#222]" />
              ))
            ) : filtered.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-[#222] bg-[#111] gap-2">
                <p className="text-2xl">📍</p>
                <p className="text-[#888] text-sm text-center px-4">
                  No locations in this category yet
                </p>
              </div>
            ) : (
              filtered.map(place => (
                <div
                  key={place.id}
                  onClick={() => handleCardClick(place)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 group ${
                    selectedId === place.id
                      ? 'border-[#E31212] bg-[#1a0000] shadow-lg shadow-red-900/20'
                      : 'border-[#222] bg-[#111] hover:border-[#444] hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#E31212] flex-shrink-0 group-hover:shadow-sm group-hover:shadow-red-500" />
                        <p className="font-semibold text-white truncate text-sm">
                          {place.city}
                        </p>
                        {place.governorate && (
                          <p className="text-xs text-[#555] flex-shrink-0">
                            {place.governorate}
                          </p>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-[#aaa] truncate pl-4">
                        {place.project_name}
                      </p>
                      {place.client_name && (
                        <p className="mt-0.5 text-xs text-[#E31212] pl-4">
                          {place.client_name}
                        </p>
                      )}
                      {place.description && (
                        <p className="mt-1 text-xs text-[#666] pl-4 line-clamp-2">
                          {place.description}
                        </p>
                      )}
                    </div>
                    <span 
                      className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] text-white font-medium"
                      style={{ 
                        background: CATEGORY_COLORS[place.category] || '#E31212' 
                      }}
                    >
                      {place.category}
                    </span>
                  </div>
                </div>
              ))
            )}

            {!loading && filtered.length > 0 && (
              <div className="mt-2 text-center text-xs text-[#444] pb-2">
                {filtered.length} location{filtered.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4 flex-wrap text-sm text-[#666]">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            places.some(p => p.category === cat) && (
              <div key={cat} className="flex items-center gap-1.5">
                <div 
                  className="h-2 w-2 rounded-full"
                  style={{ background: color }}
                />
                <span>{cat}</span>
              </div>
            )
          ))}
        </div>

      </div>
    </section>
  )
}
