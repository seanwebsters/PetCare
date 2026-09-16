import { useStore } from '../state/store'
import { MissionItem } from '../components/MissionItem'
import { Mascot } from '../components/Mascot'
import { IconFlame } from '../components/icons'
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
      <p className="text-[13px] font-medium text-[var(--color-mist)]">{WEEKDAY.format(new Date())}</p>
      <h1 className="mt-1 text-2xl font-bold text-[var(--color-ink)]">Today's Missions</h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
        Small steps across every area of your life create a brighter tomorrow.
      </p>

      {missions.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--color-line)] bg-white py-10 text-center">
          <Mascot mood="calm" size={56} />
          <p className="text-[14px] font-semibold text-[var(--color-ink)]">No missions yet</p>
          <p className="px-8 text-[13px] text-[var(--color-mist)]">Add a Direction from Home and we'll pick your first steps.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-white p-4">
            <p className="text-[13px] font-semibold text-[var(--color-ink-soft)]">{doneCount}/{missions.length} missions for today</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-cloud)]">
              <div
                className="h-full rounded-full bg-[var(--color-brand)] transition-all duration-500"
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
              className="mt-6 w-full rounded-2xl bg-[var(--color-brand)] py-3.5 text-[15px] font-semibold text-white shadow-[var(--shadow-lift)] transition-transform active:scale-[0.98]"
            >
              Mark all complete
            </button>
          )}

          {allDone && (
            <div className="mt-7 animate-[pop_0.5s_ease] rounded-3xl border border-[var(--color-line)] bg-white p-6 text-center shadow-[var(--shadow-lift)]">
              <Mascot mood="celebrate" size={72} className="mx-auto" />
              <p className="mt-3 text-lg font-bold text-[var(--color-ink)]">
                {doneCount}/{missions.length} complete
              </p>
              <p className="mt-1 text-[14px] text-[var(--color-ink-soft)]">You moved your life forward today.</p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <span className="rounded-full bg-[var(--color-brand-light)] px-3.5 py-1.5 text-[13px] font-bold text-[var(--color-brand)]">
                  +{todayLog?.xp ?? 0} XP
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-gold-soft)] px-3.5 py-1.5 text-[13px] font-bold text-[var(--color-gold)]">
                  <IconFlame className="h-4 w-4" /> {state.streak} day streak
                </span>
              </div>
            </div>
          )}

          <p className="mx-auto mt-8 max-w-[220px] text-center text-[13px] italic text-[var(--color-mist)]">
            Done today is a brighter tomorrow.
          </p>
        </>
      )}
    </div>
  )
}
