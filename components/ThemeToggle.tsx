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
      <button className={`h-9 w-9 rounded-full 
                         border border-[#333] ${className}`} />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`flex h-9 w-9 items-center justify-center
                 rounded-full border transition-all duration-200
                 ${isDark 
                   ? 'border-[#333] text-[#888] hover:border-[#E31212] hover:text-white'
                   : 'border-[#ccc] text-[#555] hover:border-[#E31212] hover:text-[#111]'
                 } ${className}`}
      aria-label="Toggle theme"
    >
      {isDark 
        ? <Sun className="h-4 w-4" /> 
        : <Moon className="h-4 w-4" />
      }
    </button>
  )
}
