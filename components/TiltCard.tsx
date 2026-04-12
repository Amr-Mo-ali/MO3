'use client'
import { useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export default function TiltCard({ 
  children, 
  className = '',
  intensity = 15
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (y - 0.5) * -intensity
    const tiltY = (x - 0.5) * intensity
    el.style.transform = `
      perspective(800px) 
      rotateX(${tiltX}deg) 
      rotateY(${tiltY}deg) 
      scale3d(1.03,1.03,1.03)
    `
    el.style.transition = 'transform 0.15s ease'
    const shine = el.querySelector<HTMLElement>('.tilt-shine')
    if (shine) {
      shine.style.opacity = '1'
      shine.style.background = `
        radial-gradient(
          circle at ${x * 100}% ${y * 100}%,
          rgba(227,18,18,0.12) 0%,
          transparent 65%
        )
      `
    }
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = `
      perspective(800px) 
      rotateX(0deg) 
      rotateY(0deg) 
      scale3d(1,1,1)
    `
    el.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
    const shine = el.querySelector<HTMLElement>('.tilt-shine')
    if (shine) shine.style.opacity = '0'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <div className="tilt-shine absolute inset-0 pointer-events-none z-10 opacity-0 transition-opacity duration-300" />
      {children}
    </div>
  )
}
