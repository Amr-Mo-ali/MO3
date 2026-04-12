'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function AdminDarkMode() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  return null
}
