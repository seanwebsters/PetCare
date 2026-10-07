import type { Category } from '../types'
import { CategoryAvatar } from './CategoryBadge'
import { CATEGORIES } from '../data/categories'

interface MissionItemProps {
  title: string
  category: Category
  minutes: number
  xp: number
  done: boolean
  onToggle: () => void
}

export function MissionItem({ title, category, minutes, xp, done, onToggle }: MissionItemProps) {
  const meta = CATEGORIES[category]
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`pixel flex w-full items-center gap-3 border-2 p-3.5 text-left transition-all active:scale-[0.98] ${
        done ? 'border-[var(--color-line)] bg-[var(--color-cloud)]' : 'border-[var(--color-ink)] bg-white shadow-[var(--shadow-pop-sm)]'
      }`}
    >
      <CategoryAvatar category={category} size={40} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[18px] font-semibold leading-tight ${done ? 'text-[var(--color-mist)] line-through' : 'text-[var(--color-ink)]'}`}>
          {title}
        </p>
        <p className="mt-0.5 text-sm font-medium" style={{ color: done ? 'var(--color-mist)' : meta.color }}>
          {meta.label} · {minutes} min{!done && <span className="text-[var(--color-mist)]"> · +{xp} XP</span>}
        </p>
      </div>
      <span
        className={`pixel-sm flex h-7 w-7 shrink-0 items-center justify-center border-2 transition-all ${
          done ? 'border-[var(--color-ink)] bg-[var(--color-lime)]' : 'border-[var(--color-ink)] bg-white'
        }`}
      >
        {done && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter">
            <path d="m5 13 4 4L19 7" />
          </svg>
        )}
      </span>
    </button>
  )
}
