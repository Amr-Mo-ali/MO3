'use client'
import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import type { Place, PlaceCategory } from '@/types/place'

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center 
                      justify-center bg-[#111]">
        <div className="h-8 w-8 animate-spin rounded-full 
                        border-2 border-[color:var(--color-primary)] 
                        border-t-transparent" />
      </div>
    )
  }
)

const CATEGORIES: PlaceCategory[] = [
  'All', 'Commercial Ad', 'Reel', 
  'Podcast', 'Video Clip', 'Other'
]

export default function WorkMap() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PlaceCategory>('All')
  const [selectedId, setSelectedId] = useState<string>()
  const [error, setError] = useState<string>()

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true)
      setError(undefined)

      const { data, error: err } = await supabase
        .from('work_locations')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) {
        console.error('Supabase error:', err)
        setError(err.message)
        return
      }

      console.log('Fetched places:', data?.length)
      setPlaces(data || [])
    } catch (e: any) {
      console.error('Fetch failed:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  const filtered = filter === 'All'
    ? places
    : places.filter(p => p.category === filter)

  return (
    <section className="bg-[color:var(--bg-primary)] py-20 px-4">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 text-center">
          <p className="mb-2 text-[11px] uppercase 
                        tracking-[6px] text-[color:var(--color-primary)]">
            OUR REACH
          </p>
          <h2 className="font-display text-5xl 
                         md:text-7xl leading-none
                         text-[color:var(--text-primary)]">
            WHERE WE'VE WORKED
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-16 bg-[color:var(--color-primary)]" />
          <p className="mt-4 text-[color:var(--text-secondary)] text-sm">
            From Cairo to Alexandria — stories told across Egypt
          </p>
          {error && (
            <p className="mt-2 text-xs text-red-400">
              Error loading locations: {error}
            </p>
          )}
        </div>

        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-sm 
                         font-medium transition-all duration-200
                         ${filter === cat
                           ? 'bg-[color:var(--color-primary)] text-white'
                           : 'border border-[color:var(--border-color)] text-[color:var(--text-secondary)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--text-primary)]'
                         }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1 text-xs opacity-60">
                  ({places.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="h-[450px] flex-1 overflow-hidden 
                          rounded-2xl border 
                          border-[color:var(--border-color)]">
            {loading ? (
              <div className="flex h-full items-center 
                              justify-center bg-[#111]">
                <div className="text-center">
                  <div className="mb-3 h-8 w-8 animate-spin 
                                  rounded-full border-2 
                                  border-[color:var(--color-primary)] 
                                  border-t-transparent mx-auto" />
                  <p className="text-sm text-[#888]">
                    Loading locations...
                  </p>
                </div>
              </div>
            ) : (
              <MapComponent
                locations={filtered}
                onMarkerClick={(p) => setSelectedId(p.id)}
                selectedId={selectedId}
              />
            )}
          </div>

          <div className="w-full lg:w-72 flex flex-col gap-2 
                          max-h-[450px] overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i}
                     className="h-20 animate-pulse rounded-xl
                                bg-[color:var(--bg-surface)]
                                border border-[color:var(--border-color)]" />
              ))
            ) : filtered.length === 0 ? (
              <div className="flex h-32 flex-col items-center 
                              justify-center rounded-xl border
                              border-[color:var(--border-color)]
                              bg-[color:var(--bg-surface)]">
                <p className="text-2xl mb-2">📍</p>
                <p className="text-sm text-[color:var(--text-secondary)]">
                  No locations yet
                </p>
              </div>
            ) : (
              filtered.map(place => (
                <div
                  key={place.id}
                  onClick={() => setSelectedId(place.id)}
                  className={`cursor-pointer rounded-xl border p-3
                             transition-all duration-200
                             ${selectedId === place.id
                               ? 'border-[#E31212] bg-[#1a0000]'
                               : 'border-[color:var(--border-color)] bg-[color:var(--bg-surface)] hover:border-[#555]'
                             }`}
                >
                  <div className="flex items-start 
                                  justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 flex-shrink-0 
                                        rounded-full bg-[#E31212]" />
                        <p className="font-semibold text-sm
                                      text-[color:var(--text-primary)] 
                                      truncate">
                          {place.city}
                        </p>
                      </div>
                      <p className="mt-0.5 pl-3.5 text-xs 
                                    text-[color:var(--text-secondary)] 
                                    truncate">
                        {place.project_name}
                      </p>
                      {place.client_name && (
                        <p className="pl-3.5 text-xs 
                                      text-[#E31212] truncate">
                          {place.client_name}
                        </p>
                      )}
                    </div>
                    <span className="flex-shrink-0 rounded-full 
                                     bg-[#E31212]/20 px-2 py-0.5 
                                     text-[10px] text-[#E31212]
                                     font-medium whitespace-nowrap">
                      {place.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
