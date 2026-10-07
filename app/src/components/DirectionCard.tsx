import { Link } from 'react-router-dom'
import type { Direction } from '../types'
import { CATEGORIES } from '../data/categories'
import { CategoryAvatar } from './CategoryBadge'
import { directionProgress } from '../lib/xp'

export function DirectionCard({ direction }: { direction: Direction }) {
  const meta = CATEGORIES[direction.category]
  const pct = directionProgress(direction)

  return (
    <Link
      to={`/direction/${direction.id}`}
      className="pixel flex items-center gap-3.5 border-2 border-[var(--color-ink)] bg-white p-3.5 shadow-[var(--shadow-pop-sm)] transition-transform active:scale-[0.98]"
    >
      <CategoryAvatar category={direction.category} size={44} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold uppercase tracking-wide" style={{ color: meta.color }}>
          {meta.label}
        </p>
        <p className="truncate text-[18px] font-bold leading-tight text-[var(--color-ink)]">{direction.goal}</p>
        <div className="mt-1.5 h-3 w-full border-2 border-[var(--color-ink)] bg-[var(--color-cloud)] p-[1px]">
          <div className="h-full" style={{ width: `${pct}%`, background: meta.color }} />
        </div>
      </div>
      <span className="display text-base font-bold text-[var(--color-ink)]">{pct}%</span>
    </Link>
  )
}
