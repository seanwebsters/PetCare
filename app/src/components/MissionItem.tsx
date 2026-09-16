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
      className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] ${
        done ? 'border-transparent bg-[var(--color-cloud)]' : 'border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)]'
      }`}
    >
      <CategoryAvatar category={category} size={40} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[15px] font-semibold ${done ? 'text-[var(--color-mist)] line-through' : 'text-[var(--color-ink)]'}`}>
          {title}
        </p>
        <p className="mt-0.5 text-xs font-medium" style={{ color: done ? 'var(--color-mist)' : meta.color }}>
          {meta.label} · {minutes} min{!done && <span className="text-[var(--color-mist)]"> · +{xp} XP</span>}
        </p>
      </div>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          done ? 'border-[var(--color-brand)] bg-[var(--color-brand)]' : 'border-[var(--color-line)]'
        }`}
      >
        {done && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4L19 7" />
          </svg>
        )}
      </span>
    </button>
  )
}
