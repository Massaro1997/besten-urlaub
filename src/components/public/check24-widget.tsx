'use client'

import { useEffect, useRef } from 'react'

interface Check24WidgetProps {
  offer: 'lastminute' | 'earlybooker' | 'allinclusive' | 'allgemein'
  type?: 'package' | 'rentalcar'
}

export function Check24Widget({ offer, type = 'package' }: Check24WidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !containerRef.current) return
    loaded.current = true

    const container = containerRef.current

    // Create the widget div
    const widgetDiv = document.createElement('div')
    widgetDiv.style.width = '100%'

    if (type === 'package') {
      widgetDiv.id = 'c24pp-package-iframe'
      widgetDiv.setAttribute('data-offer', offer)
      widgetDiv.setAttribute('data-scrollto', 'begin')
      widgetDiv.setAttribute('data-forward-url', 'no')
    } else {
      widgetDiv.id = 'c24pp-rentalcar-iframe'
      widgetDiv.setAttribute('data-scrollto', 'iframe')
    }

    container.appendChild(widgetDiv)

    // Load the script
    const script = document.createElement('script')
    if (type === 'package') {
      script.src = 'https://files.check24.net/widgets/auto/1168044/c24pp-package-iframe/package-iframe.js'
    } else {
      script.src = 'https://files.check24.net/widgets/auto/1168044/c24pp-rentalcar-iframe/rentalcar-iframe.js'
    }
    script.async = true
    container.appendChild(script)

    return () => {
      container.innerHTML = ''
      loaded.current = false
    }
  }, [offer, type])

  return <div ref={containerRef} />
}
