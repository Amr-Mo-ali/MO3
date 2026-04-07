'use client'

import { useEffect } from 'react'

export default function AdminDarkMode() {
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('admin-forced-dark', 'true')
  }, [])

  return null
}
