'use client'

import { useEffect } from 'react'

export default function AdminDarkMode() {
  useEffect(() => {
    const html = document.documentElement
    html.removeAttribute('data-theme')
    localStorage.setItem('mo3-theme', 'dark')
    return () => {}
  }, [])

  return null
}
