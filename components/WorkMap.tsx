'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#111111] rounded-xl">
        <p className="text-gray-400">Loading map...</p>
      </div>
    )
  }
)

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

export default function WorkMap() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selected, setSelected] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  const categories = [
    'All', 
    'Commercial Ad', 
    'Reel', 
    'Podcast', 
    'Video Clip', 
    'Other'
  ]

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data, error } = await supabase
          .from('work_locations')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        if (data) setLocations(data)
      } catch (err) {
        console.error('Error fetching locations:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  const filtered = filter === 'All' 
    ? locations 
    : locations.filter(l => l.category === filter)


  return (
    <section className="bg-[#000000] py-20 px-4">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-12 text-center">
          <p className="mb-2 text-[11px] uppercase tracking-[4px] text-[#E31212]">
            OUR REACH
          </p>
          <h2 className="font-bebas text-6xl text-white">
            WHERE WE'VE WORKED
          </h2>
          <p className="mt-3 text-[#888888]">
            From Cairo to Alexandria — stories told across Egypt
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-sm transition-all duration-200 ${
                filter === cat 
                  ? 'bg-[#E31212] text-white' 
                  : 'border border-[#333] text-[#888] hover:border-[#E31212] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          
          <div className="h-[500px] flex-1 overflow-hidden rounded-xl border border-[#222222]">
            {loading ? (
              <div className="flex h-full items-center justify-center bg-[#111111]">
                <p className="text-gray-400">Loading locations...</p>
              </div>
            ) : (
              <MapComponent
                locations={filtered}
                onMarkerClick={setSelected}
              />
            )}
          </div>

          <div className="flex w-full flex-col gap-3 overflow-y-auto lg:w-80">
            {filtered.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-[#222] bg-[#111]">
                <p className="text-[#888] text-sm">
                  No locations yet
                </p>
              </div>
            ) : (
              filtered.map(location => (
                <div
                  key={location.id}
                  onClick={() => setSelected(location)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    selected?.id === location.id
                      ? 'border-[#E31212] bg-[#1a0000]'
                      : 'border-[#222] bg-[#111] hover:border-[#444]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">
                        {location.city}
                      </p>
                      <p className="mt-1 text-sm text-[#888]">
                        {location.project_name}
                      </p>
                      {location.client_name && (
                        <p className="mt-1 text-xs text-[#E31212]">
                          {location.client_name}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-[#E31212] px-2 py-0.5 text-[10px] text-white whitespace-nowrap ml-2">
                      {location.category}
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
