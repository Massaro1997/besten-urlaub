'use client'

import Link from 'next/link'
import { trackClickButton } from '@/lib/tiktok-pixel'

interface Props {
  offerId: string
  offerTitle: string
  priceFrom: number | null
  href: string
  className?: string
  children: React.ReactNode
}

export function TrackedOfferLink({ offerId, offerTitle, priceFrom, href, className, children }: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackClickButton({ id: offerId, title: offerTitle, priceFrom })
      }}
    >
      {children}
    </Link>
  )
}
