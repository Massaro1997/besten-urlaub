'use client'

import { useEffect, useState } from 'react'

/**
 * Theme hook. Initial state is read once on mount from localStorage and
 * dispatched synchronously inside an effect (allowed pattern: subscribing to
 * an external system). The class on <html> is also kept in sync there to
 * avoid a flash; the inline script in app/layout.tsx already sets the class
 * before React hydrates so this effect is just a no-op in the common case.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = (typeof window !== 'undefined'
      ? (localStorage.getItem('theme') as 'light' | 'dark' | null)
      : null) || 'light'
    // localStorage is a client-only external system, so this setState IS the
    // legitimate "subscribe + dispatch" pattern — we just can't express it in
    // a way the React 19 rule recognises without a useSyncExternalStore.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== 'light') setThemeState(stored)
    document.documentElement.classList.toggle('dark', stored === 'dark')
  }, [])

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme }
}
