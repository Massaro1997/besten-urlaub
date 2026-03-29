import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-surface text-secondary': variant === 'default',
          'bg-primary-light text-primary': variant === 'primary',
          'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400': variant === 'success',
          'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400': variant === 'warning',
          'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400': variant === 'danger',
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
