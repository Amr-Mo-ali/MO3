'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Work } from '@/types'

interface Props {
  works: Work[]
  onSelect: (work: Work) => void
}

export default function WorkShowcase3D({ 
  works, 
  onSelect 
}: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = Math.min(works.length, 7)

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (paused || total === 0) return
    const t = setInterval(next, 3500)
    return () => clearInterval(t)
  }, [paused, next, total])

  if (total === 0) return null

  return (
    <div
      className="relative mx-auto mb-12"
      style={{ 
        height: '280px', 
        perspective: '1200px',
        maxWidth: '600px'
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {works.slice(0, total).map((work, i) => {
        const offset = ((i - current + total) % total)
        const pos = offset > total / 2 
          ? offset - total 
          : offset
        
        const angle = pos * (360 / total)
        const isActive = pos === 0
        const absPos = Math.abs(pos)
        const opacity = absPos > 2 ? 0 : 1 - absPos * 0.25
        const scale = isActive ? 1 : 1 - absPos * 0.12
        const zIndex = total - absPos

        return (
          <div
            key={work.id}
            onClick={() => {
              if (isActive) onSelect(work)
              else setCurrent(i)
            }}
            className="absolute left-1/2 top-1/2 
                       overflow-hidden rounded-xl
                       border cursor-pointer"
            style={{
              width: '240px',
              height: '150px',
              marginLeft: '-120px',
              marginTop: '-75px',
              transform: `
                rotateY(${angle}deg) 
                translateZ(${isActive ? 220 : 180}px)
                scale(${scale})
              `,
              opacity,
              transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1)',
              zIndex,
              borderColor: isActive ? '#E31212' : '#333',
              backgroundColor: '#111',
              boxShadow: isActive 
                ? '0 0 30px rgba(227,18,18,0.3)' 
                : 'none',
            }}
          >
            {work.thumbnail ? (
              <div className="relative h-full w-full">
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  fill
                  className="object-cover"
                  priority={isActive}
                />
                <div className="absolute inset-0 
                                bg-gradient-to-t 
                                from-black/70 to-transparent" />
              </div>
            ) : (
              <div className="flex h-full items-center 
                              justify-center bg-[#0a0a0a]">
                <div className="text-center px-3">
                  <div className="mb-2 text-[#E31212] text-2xl">
                    ▶
                  </div>
                  <p className="text-xs text-[#888] truncate">
                    {work.title}
                  </p>
                </div>
              </div>
            )}
            
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 
                              p-2 bg-gradient-to-t 
                              from-black to-transparent">
                <p className="text-white text-xs font-medium 
                              truncate">
                  {work.title}
                </p>
                {work.client && (
                  <p className="text-[#E31212] text-[10px] 
                                truncate">
                    {work.client}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 z-50 
                   -translate-y-1/2 rounded-full 
                   border border-[#333] bg-black/80 
                   p-2 text-white hover:border-[#E31212]
                   transition-colors"
        aria-label="Previous work"
      >
        ←
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 z-50 
                   -translate-y-1/2 rounded-full 
                   border border-[#333] bg-black/80 
                   p-2 text-white hover:border-[#E31212]
                   transition-colors"
        aria-label="Next work"
      >
        →
      </button>

      <div className="absolute -bottom-6 left-0 right-0 
                      flex justify-center gap-1.5">
        {works.slice(0, total).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300
              ${i === current 
                ? 'w-5 h-1.5 bg-[#E31212]' 
                : 'w-1.5 h-1.5 bg-[#333]'
              }`}
            aria-label={`Go to work ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
