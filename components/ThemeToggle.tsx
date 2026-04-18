'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

interface Props {
  className?: string
}

export default function ThemeToggle({ className = '' }: Props) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button 
        className={`h-11 w-11 rounded-full 
                   border border-[color:var(--color-border)] ${className}`}
        aria-label="Toggle theme"
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`flex h-11 w-11 items-center justify-center
                 rounded-full border transition-all duration-200
                 ${isDark 
                   ? 'border-[color:var(--color-border)] text-[color:var(--text-secondary)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--text-primary)]'
                   : 'border-[#ccc] text-[#555] hover:border-[color:var(--color-primary)] hover:text-[#111]'
                 } ${className}`}
      aria-label="Toggle between light and dark theme"
      title="Toggle theme"
    >
      {isDark 
        ? <Sun className="h-5 w-5" /> 
        : <Moon className="h-5 w-5" />
      }
    </button>
  )
}
