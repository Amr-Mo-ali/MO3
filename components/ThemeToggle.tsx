'use client'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('mo3-theme')
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
      setIsDark(false)
    }
  }, [])

  const toggle = () => {
    const html = document.documentElement
    if (isDark) {
      html.setAttribute('data-theme', 'light')
      localStorage.setItem('mo3-theme', 'light')
      setIsDark(false)
    } else {
      html.removeAttribute('data-theme')
      localStorage.setItem('mo3-theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center 
                 rounded-full border border-[#333] 
                 text-[#888] transition-all duration-200
                 hover:border-[#E31212] hover:text-white"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
