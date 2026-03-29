'use client'

import { cn } from '@/lib/utils'
import type { PUBLIC_CATEGORIES } from '@/lib/public-constants'

interface CategoryTabsProps {
  categories: typeof PUBLIC_CATEGORIES
  activeCategory: string
  onCategoryChange: (value: string) => void
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value

          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-[#2e75fa] text-white'
                  : 'bg-white text-[#0a1a3a]/70 border border-[#0a1a3a]/10 hover:border-[#2e75fa]/30',
              )}
            >
              {'emoji' in cat && cat.emoji ? `${cat.emoji} ` : ''}
              {cat.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
