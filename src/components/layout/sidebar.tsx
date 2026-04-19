'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  MapPin,
  Tag,
  Video,
  Palette,
  Settings,
  TrendingUp,
  Activity,
  Mail,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Panoramica', icon: LayoutDashboard },
  { href: '/tracking', label: 'Tracking', icon: Activity },
  { href: '/leads', label: 'Leads', icon: Mail },
  { href: '/destinazioni', label: 'Destinazioni', icon: MapPin },
  { href: '/offerte', label: 'Offerte', icon: Tag },
  { href: '/offerte/suggerimenti', label: 'AI Suggerimenti', icon: MapPin },
  { href: '/contenuti', label: 'Contenuti TikTok', icon: Video },
  { href: '/tiktok-intel', label: 'TikTok Intel', icon: TrendingUp },
  { href: '/creativi', label: 'Creativi', icon: Palette },
  { href: '/impostazioni', label: 'Impostazioni', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-[var(--sidebar-width)] bg-sidebar-bg border-r border-border-light z-50',
          'flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-[var(--header-height)] border-b border-border-light">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <Image src="/symbol.svg" alt="Bester Urlaub" width={32} height={32} className="w-8 h-8" />
            <div>
              <p className="text-sm font-semibold leading-tight">Bester Urlaub</p>
              <p className="text-[10px] text-secondary leading-tight">Check24 Affiliate</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface text-secondary lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover:text-foreground hover:bg-surface',
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border-light">
          <p className="text-[10px] text-secondary/60">
            Bester Urlaub Dashboard v1.0
          </p>
        </div>
      </aside>
    </>
  )
}
