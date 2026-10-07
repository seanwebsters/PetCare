import type { ReactNode } from 'react'
import { useStore } from '../state/store'
import { ACHIEVEMENTS } from '../data/achievements'
import { CATEGORIES, CATEGORY_ORDER } from '../data/categories'
import { CategoryAvatar } from '../components/CategoryBadge'
import { IconFlame } from '../components/icons'
import { xpIntoLevel } from '../lib/xp'
import { daysBetween, todayISO } from '../lib/id'
import type { Category } from '../types'

function StatTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="pixel border-2 border-[var(--color-ink)] bg-white p-3.5 text-center shadow-[var(--shadow-soft)]">
      <p className="display text-base font-bold text-[var(--color-ink)]">{value}</p>
      <p className="mt-1.5 text-sm font-bold uppercase text-[var(--color-mist)]">{label}</p>
    </div>
  )
}

function categoryTrend(history: { date: string; categories: Partial<Record<Category, number>> }[], category: Category): '↑' | '→' {
  const today = todayISO()
  const recentActivity = history.some((h) => daysBetween(h.date, today) <= 7 && (h.categories[category] ?? 0) > 0)
  return recentActivity ? '↑' : '→'
}

export function Progress() {
  const { state } = useStore()
  const { pct: levelPct, current, needed } = xpIntoLevel(state.xp)

  const monthLog = state.history.filter((h) => h.date.slice(0, 7) === todayISO().slice(0, 7))
  const monthCompleted = monthLog.reduce((n, h) => n + h.completed, 0)
  const monthXp = monthLog.reduce((n, h) => n + h.xp, 0)

  const activeCategories = CATEGORY_ORDER.filter((c) => state.directions.some((d) => d.category === c))

  return (
    <div className="px-5 pt-12 pb-4">
      <h1 className="display text-lg leading-[1.6] text-[var(--color-ink)]">Your Progress</h1>
      <p className="mt-2 text-[18px] text-[var(--color-ink-soft)]">Look how far you've come. Actually look.</p>

      <div className="pixel mt-5 border-2 border-[var(--color-ink)] bg-[var(--color-brand-light)] p-4 shadow-[var(--shadow-pop-sm)]">
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-[var(--color-ink-soft)]">Level {state.level}</p>
          <p className="text-base font-bold text-[var(--color-mist)]">{current}/{needed} XP</p>
        </div>
        <div className="mt-2 h-3 w-full border-2 border-[var(--color-ink)] bg-white p-[1px]">
          <div className="h-full bg-[var(--color-brand)] transition-all duration-500" style={{ width: `${levelPct}%` }} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <StatTile
          label="day streak"
          value={
            <span className="inline-flex items-center gap-1">
              <IconFlame className="h-4 w-4 text-[var(--color-gold)]" /> {state.streak}
            </span>
          }
        />
        <StatTile label="total XP" value={state.xp} />
        <StatTile label="missions" value={state.missionsCompletedTotal} />
        <StatTile label="milestones" value={state.milestonesCompletedTotal} />
        <StatTile label="goals reached" value={state.goalsCompletedTotal} />
        <StatTile label="this month" value={monthCompleted} />
      </div>

      <div className="pixel mt-7 border-2 border-[var(--color-ink)] bg-white p-4 shadow-[var(--shadow-soft)]">
        <p className="text-base font-bold text-[var(--color-ink-soft)]">This month</p>
        <p className="display mt-2 text-xs leading-[1.7] text-[var(--color-ink)]">{monthCompleted} missions · {monthXp} XP earned</p>
      </div>

      {activeCategories.length > 0 && (
        <div className="mt-7">
          <h2 className="display mb-3 text-xs text-[var(--color-ink)]">Your year in motion</h2>
          <div className="pixel border-2 border-[var(--color-ink)] bg-white p-2 shadow-[var(--shadow-soft)]">
            {activeCategories.map((c) => (
              <div key={c} className="flex items-center gap-3 p-2.5">
                <CategoryAvatar category={c} size={34} />
                <span className="flex-1 text-[18px] font-bold text-[var(--color-ink)]">{CATEGORIES[c].label}</span>
                <span className="text-lg font-bold" style={{ color: CATEGORIES[c].color }}>
                  {categoryTrend(state.history, c)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7">
        <h2 className="display mb-3 text-xs text-[var(--color-ink)]">Achievements</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = a.isUnlocked(state)
            return (
              <div
                key={a.id}
                className={`pixel border-2 p-3.5 ${unlocked ? 'border-[var(--color-ink)] bg-[var(--color-lime)] shadow-[var(--shadow-pop-sm)]' : 'border-dashed border-[var(--color-line)] bg-transparent opacity-50'}`}
              >
                <p className="text-2xl">{a.icon}</p>
                <p className="mt-1.5 text-base font-bold text-[var(--color-ink)]">{a.title}</p>
                <p className="mt-0.5 text-sm leading-snug text-[var(--color-ink-soft)] opacity-80">{a.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
