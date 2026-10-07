import { useStore } from '../state/store'
import { MissionItem } from '../components/MissionItem'
import { Mascot } from '../components/Mascot'
import { IconFlame } from '../components/icons'
import { CornerGems } from '../components/CornerGems'
import { findTaskContext } from '../lib/tasks'

const WEEKDAY = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

export function Today() {
  const { state, dispatch } = useStore()

  const missions = state.todayMissionIds
    .map((id) => findTaskContext(state.directions, id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))

  const doneCount = missions.filter((m) => m.task.done).length
  const allDone = missions.length > 0 && doneCount === missions.length
  const todayLog = state.history.find((h) => h.date === state.todayDate)

  function completeAll() {
    missions.forEach(({ task, direction }) => {
      if (!task.done) dispatch({ type: 'COMPLETE_TASK', directionId: direction.id, taskId: task.id })
    })
  }

  return (
    <div className="px-5 pt-12">
      <p className="text-base font-bold uppercase text-[var(--color-mist)]">{WEEKDAY.format(new Date())}</p>
      <h1 className="display mt-2 text-lg leading-[1.6] text-[var(--color-ink)]">Today's Missions</h1>
      <p className="mt-2 text-[18px] leading-relaxed text-[var(--color-ink-soft)]">
        Small moves across your whole life. That's the whole game.
      </p>

      {missions.length === 0 ? (
        <div className="pixel mt-8 flex flex-col items-center gap-3 border-2 border-dashed border-[var(--color-ink)] bg-white py-10 text-center">
          <Mascot mood="calm" size={56} />
          <p className="text-[18px] font-bold text-[var(--color-ink)]">No missions yet</p>
          <p className="px-8 text-base text-[var(--color-mist)]">Add a Direction from Home and we'll pick your first moves.</p>
        </div>
      ) : (
        <>
          <div className="pixel mt-6 border-2 border-[var(--color-ink)] bg-white p-4">
            <p className="text-base font-bold text-[var(--color-ink-soft)]">{doneCount}/{missions.length} missions for today</p>
            <div className="mt-2 h-3 w-full border-2 border-[var(--color-ink)] bg-[var(--color-cloud)] p-[1px]">
              <div
                className="h-full bg-[var(--color-brand)] transition-all duration-500"
                style={{ width: `${(doneCount / missions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
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

          {!allDone && (
            <button
              type="button"
              onClick={completeAll}
              className="pixel mt-6 w-full border-2 border-[var(--color-ink)] bg-[var(--color-brand)] py-3.5 text-base font-bold text-white shadow-[var(--shadow-pop)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              MARK ALL COMPLETE
            </button>
          )}

          {allDone && (
            <div className="pixel relative mt-7 animate-[pop_0.5s_steps(3)] border-2 border-[var(--color-ink)] bg-white p-6 text-center shadow-[var(--shadow-pop)]">
              <CornerGems />
              <Mascot mood="celebrate" size={72} className="mx-auto" />
              <p className="display mt-3 text-sm leading-[1.6] text-[var(--color-ink)]">
                {doneCount}/{missions.length} COMPLETE
              </p>
              <p className="mt-2 text-[18px] text-[var(--color-ink-soft)]">You just leveled up IRL.</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="pixel-sm border-2 border-[var(--color-ink)] bg-[var(--color-lime)] px-3.5 py-1.5 text-base font-bold text-[var(--color-ink)]">
                  +{todayLog?.xp ?? 0} XP
                </span>
                <span className="pixel-sm flex items-center gap-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-gold-soft)] px-3.5 py-1.5 text-base font-bold text-[var(--color-gold)]">
                  <IconFlame className="h-4 w-4" /> {state.streak} day streak
                </span>
              </div>
            </div>
          )}

          <p className="mx-auto mt-8 max-w-[220px] text-center text-base italic text-[var(--color-mist)]">
            Done today beats perfect someday.
          </p>
        </>
      )}
    </div>
  )
}
