import type { SVGProps } from 'react'
import type { Category } from '../types'
import { CATEGORIES } from '../data/categories'
import { IconBriefcase, IconCoin, IconHeart, IconPeople, IconPlane } from './icons'

const ICONS: Record<Category, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  career: IconBriefcase,
  money: IconCoin,
  health: IconHeart,
  life: IconPlane,
  relationships: IconPeople,
}

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const Icon = ICONS[category]
  return <Icon className={className} />
}

export function CategoryPill({ category }: { category: Category }) {
  const meta = CATEGORIES[category]
  const Icon = ICONS[category]
  return (
    <span
      className="pixel-sm inline-flex items-center gap-1.5 border-2 border-[var(--color-ink)] px-2.5 py-1 text-sm font-bold uppercase tracking-wide"
      style={{ background: meta.soft, color: meta.color }}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  )
}

export function CategoryAvatar({ category, size = 40 }: { category: Category; size?: number }) {
  const meta = CATEGORIES[category]
  const Icon = ICONS[category]
  return (
    <span
      className="pixel-sm inline-flex items-center justify-center border-2 border-[var(--color-ink)] shrink-0"
      style={{ background: meta.soft, color: meta.color, width: size, height: size }}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  )
}
