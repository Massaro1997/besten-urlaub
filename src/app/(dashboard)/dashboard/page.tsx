export const dynamic = 'force-dynamic'

import Link from 'next/link'
import {
  MapPin,
  Tag,
  Video,
  CheckCircle,
  Plus,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'

export default async function DashboardPage() {
  const [destinazioniCount, offerteCount, videoPianificatiCount, videoPubblicatiCount] =
    await Promise.all([
      prisma.destination.count(),
      prisma.offer.count(),
      prisma.video.count({ where: { status: 'pianificato' } }),
      prisma.video.count({ where: { status: 'pubblicato' } }),
    ])

  const stats = [
    {
      label: 'Destinazioni',
      value: destinazioniCount,
      icon: MapPin,
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
    {
      label: 'Offerte',
      value: offerteCount,
      icon: Tag,
      color: 'text-[#ff9f0a]',
      bg: 'bg-[#ff9f0a]/10',
    },
    {
      label: 'Video pianificati',
      value: videoPianificatiCount,
      icon: Calendar,
      color: 'text-[#af52de]',
      bg: 'bg-[#af52de]/10',
    },
    {
      label: 'Video pubblicati',
      value: videoPubblicatiCount,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-[#34c759]/10',
    },
  ]

  const quickActions = [
    {
      label: 'Aggiungi Offerta',
      description: 'Inserisci una nuova offerta Check24',
      href: '/offerte/nuova',
      icon: Tag,
      color: 'text-[#ff9f0a]',
      bg: 'bg-[#ff9f0a]/10',
    },
    {
      label: 'Pianifica Video',
      description: 'Crea un nuovo contenuto TikTok',
      href: '/contenuti/nuovo',
      icon: Video,
      color: 'text-[#af52de]',
      bg: 'bg-[#af52de]/10',
    },
    {
      label: 'Nuova Destinazione',
      description: 'Aggiungi una destinazione al catalogo',
      href: '/destinazioni/nuova',
      icon: Plus,
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Panoramica</h1>
        <p className="text-secondary text-sm mt-1">
          Riepilogo generale del tuo business affiliato
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex items-start gap-4">
            <div className={`${stat.bg} rounded-xl p-2.5 shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-xs text-secondary mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Azioni rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card hover className="flex items-start gap-4 h-full">
                <div className={`${action.bg} rounded-xl p-2.5 shrink-0`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{action.label}</p>
                    <ArrowRight className="w-4 h-4 text-secondary shrink-0" />
                  </div>
                  <p className="text-xs text-secondary mt-0.5">{action.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
