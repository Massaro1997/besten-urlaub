import Image from 'next/image'

/**
 * Lockup del marchio: simbolo a colori 2026 + wordmark su due righe.
 * Il file del logo nuovo contiene solo l'isola, la scritta la componiamo
 * in Poppins per avere una versione chiara e una scura senza altri file.
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
  const mark = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-20',
  }[size]

  const type = {
    sm: 'text-[12px] sm:text-[13px]',
    md: 'text-[13px] sm:text-[15px]',
    lg: 'text-[22px]',
  }[size]

  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <Image
        src="/symbol-2026.svg"
        alt=""
        width={80}
        height={80}
        priority
        className={`${mark} w-auto shrink-0`}
      />
      <span
        className={`font-extrabold leading-[0.95] tracking-[0.06em] ${type} ${
          variant === 'light' ? 'text-white drop-shadow-[0_1px_8px_rgba(10,26,58,0.45)]' : 'text-[#0a1a3a]'
        }`}
      >
        <span className="block">BESTER</span>
        <span className="block">URLAUB</span>
      </span>
    </span>
  )
}
