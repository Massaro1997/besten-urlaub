'use client'

import { trackLead } from '@/lib/tiktok-pixel'

interface Props {
  href: string
  source: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function TrackedPhoneLink({ href, source, className, style, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={() => trackLead(source)}
    >
      {children}
    </a>
  )
}
