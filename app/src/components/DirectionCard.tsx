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
      className="flex items-center gap-3.5 rounded-2xl border-2 border-[var(--color-ink)] bg-white p-3.5 shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
    >
      <CategoryAvatar category={direction.category} size={44} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold" style={{ color: meta.color }}>
          {meta.label}
        </p>
        <p className="truncate text-[15px] font-bold text-[var(--color-ink)]">{direction.goal}</p>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full border border-[var(--color-ink)]/15 bg-[var(--color-cloud)]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: meta.color }}
          />
        </div>
      </div>
      <span className="display text-base font-bold text-[var(--color-ink)]">{pct}%</span>
    </Link>
  )
}
