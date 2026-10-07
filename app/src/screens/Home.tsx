import { Link } from 'react-router-dom'
import { useStore } from '../state/store'
import { DirectionCard } from '../components/DirectionCard'
import { MissionItem } from '../components/MissionItem'
import { Mascot } from '../components/Mascot'
import { IconFlame, IconPlus } from '../components/icons'
import { findTaskContext } from '../lib/tasks'
import { isDirectionComplete } from '../lib/xp'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function Home() {
  const { state, dispatch } = useStore()
  const activeDirections = state.directions.filter((d) => !isDirectionComplete(d))
  const missions = state.todayMissionIds
    .map((id) => findTaskContext(state.directions, id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
  const doneCount = missions.filter((m) => m.task.done).length

  return (
    <div className="px-5 pt-12">
      <div className="flex items-start justify-between">
        <div>
          <p className="display text-base leading-[1.6] text-[var(--color-ink)]">
            {greeting()}, {state.name}
          </p>
          <p className="mt-2 text-[18px] text-[var(--color-ink-soft)]">Tiny steps today. Big glow-up incoming.</p>
        </div>
        <Mascot mood="happy" size={52} />
      </div>

      <div className="mt-5 flex gap-3">
        <div className="pixel flex flex-1 items-center gap-2.5 border-2 border-[var(--color-ink)] bg-[var(--color-gold-soft)] p-3.5 shadow-[var(--shadow-pop-sm)]">
          <span className="pixel-sm flex h-9 w-9 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-gold)] text-white">
            <IconFlame className="h-5 w-5" />
          </span>
          <div>
            <p className="display text-base leading-none text-[var(--color-ink)]">{state.streak}</p>
            <p className="mt-1.5 text-sm font-bold uppercase text-[var(--color-ink-soft)]">day streak</p>
          </div>
        </div>
        <div className="pixel flex flex-1 items-center gap-2.5 border-2 border-[var(--color-ink)] bg-[var(--color-brand-light)] p-3.5 shadow-[var(--shadow-pop-sm)]">
          <span className="pixel-sm flex h-9 w-9 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-brand)] text-sm font-bold text-white">
            {state.level}
          </span>
          <div>
            <p className="display text-base leading-none text-[var(--color-ink)]">{state.xp}XP</p>
            <p className="mt-1.5 text-sm font-bold uppercase text-[var(--color-ink-soft)]">level {state.level}</p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <h2 className="display text-xs text-[var(--color-ink)]">Your Directions</h2>
        <Link to="/new" className="pixel-sm flex items-center gap-1 border-2 border-[var(--color-ink)] bg-[var(--color-lime)] px-2.5 py-1 text-sm font-bold text-[var(--color-ink)] shadow-[var(--shadow-pop-sm)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
          <IconPlus className="h-3.5 w-3.5" /> ADD
        </Link>
      </div>

      <div className="mt-3 space-y-2.5">
        {activeDirections.length === 0 && (
          <Link
            to="/new"
            className="pixel flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--color-ink)] bg-white py-8 text-center"
          >
            <Mascot mood="calm" size={56} />
            <p className="text-[18px] font-bold text-[var(--color-ink)]">Choose your first Direction</p>
            <p className="px-6 text-base text-[var(--color-mist)]">Drop a goal and we'll build your path. No cap.</p>
          </Link>
        )}
        {activeDirections.map((d) => (
          <DirectionCard key={d.id} direction={d} />
        ))}
      </div>

      {missions.length > 0 && (
        <>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="display text-xs text-[var(--color-ink)]">Today's Missions</h2>
            <Link to="/today" className="text-base font-bold text-[var(--color-brand-dark)]">
              {doneCount}/{missions.length} done
            </Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {missions.map(({ task, direction }) => (
              <MissionItem
                key={task.id}
                title={task.title}
                category={direction.category}
                minutes={task.minutes}
                xp={task.xp}
                done={task.done}
                onToggle={() => {
                  if (!task.done) dispatch({ type: 'COMPLETE_TASK', directionId: direction.id, taskId: task.id })
                }}
              />
            ))}
          </div>
        </>
      )}

      <p className="mx-auto mt-9 max-w-[240px] text-center text-base italic text-[var(--color-mist)]">
        "Progress looks different for everyone. Keep going."
      </p>
    </div>
  )
}
