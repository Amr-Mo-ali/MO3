'use client'
import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
}

export default function ScrollReveal({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const startStyles: Record<string, string> = {
      up: 'translateY(50px) translateZ(-50px)',
      left: 'translateX(-50px) translateZ(-30px)',
      right: 'translateX(50px) translateZ(-30px)',
      scale: 'scale(0.85) translateZ(-40px)',
    }

    el.style.opacity = '0'
    el.style.transform = startStyles[direction]
    el.style.transition = `
      opacity 0.7s ease ${delay}ms, 
      transform 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}ms
    `
    el.style.willChange = 'transform, opacity'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0) translateZ(0) scale(1)'
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [delay, direction])

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}
