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
          <p className="text-2xl font-bold text-[var(--color-ink)]">
            {greeting()}, {state.name}
          </p>
          <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">Small steps today. A brighter tomorrow.</p>
        </div>
        <Mascot mood="happy" size={52} />
      </div>

      <div className="mt-5 flex gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-[var(--color-line)] bg-white p-3.5 shadow-[var(--shadow-soft)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold)]">
            <IconFlame className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold leading-none text-[var(--color-ink)]">{state.streak}</p>
            <p className="text-[11px] font-medium text-[var(--color-mist)]">day streak</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-[var(--color-line)] bg-white p-3.5 shadow-[var(--shadow-soft)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)] text-[15px] font-bold">
            {state.level}
          </span>
          <div>
            <p className="text-lg font-bold leading-none text-[var(--color-ink)]">{state.xp} XP</p>
            <p className="text-[11px] font-medium text-[var(--color-mist)]">level {state.level}</p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[var(--color-ink)]">Your Directions</h2>
        <Link to="/new" className="flex items-center gap-1 text-[13px] font-semibold text-[var(--color-brand)]">
          <IconPlus className="h-3.5 w-3.5" /> Add
        </Link>
      </div>

      <div className="mt-3 space-y-2.5">
        {activeDirections.length === 0 && (
          <Link
            to="/new"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-line)] bg-white py-8 text-center"
          >
            <Mascot mood="calm" size={56} />
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">Choose your first Direction</p>
            <p className="px-6 text-[13px] text-[var(--color-mist)]">Tell us a goal and we'll build your path.</p>
          </Link>
        )}
        {activeDirections.map((d) => (
          <DirectionCard key={d.id} direction={d} />
        ))}
      </div>

      {missions.length > 0 && (
        <>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[var(--color-ink)]">Today's Missions</h2>
            <Link to="/today" className="text-[13px] font-semibold text-[var(--color-brand)]">
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

      <p className="mx-auto mt-9 max-w-[240px] text-center text-[13px] italic text-[var(--color-mist)]">
        "Progress looks different for everyone. Keep going."
      </p>
    </div>
  )
}
