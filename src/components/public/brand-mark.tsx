import Image from 'next/image'

/**
 * Lockup del marchio: icona a colori 2026 + la scritta originale del logo.
 * La scritta e' ritagliata dai file storici (noBgWhite / noBgColor), quindi
 * il lettering resta identico a prima: cambia solo l'icona.
 */
export function BrandMark({
  variant = 'dark',
  size = 'md',
  className = '',
}: {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const icon = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-20',
  }[size]

  const word = {
    sm: 'h-[19px] sm:h-[21px]',
    md: 'h-6 sm:h-[26px]',
    lg: 'h-12',
  }[size]

  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <Image
        src="/symbol-2026.svg"
        alt=""
        width={136}
        height={179}
        priority
        className={`${icon} w-auto shrink-0`}
      />
      <Image
        src={variant === 'light' ? '/wordmark-white.png' : '/wordmark-color.png'}
        alt="Bester Urlaub"
        width={2025}
        height={776}
        priority
        unoptimized
        className={`${word} w-auto shrink-0`}
      />
    </span>
  )
}
