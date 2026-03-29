'use client'

import { Menu, Moon, Sun, Plus } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import Link from 'next/link'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 h-[var(--header-height)] bg-background/80 backdrop-blur-xl border-b border-border-light">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: hamburger (mobile) */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-surface text-secondary lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/offerte/nuova"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuova Offerta</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-surface text-secondary transition-colors"
            title={theme === 'light' ? 'Modalità scura' : 'Modalità chiara'}
          >
            {theme === 'light' ? (
              <Moon className="w-[18px] h-[18px]" />
            ) : (
              <Sun className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
