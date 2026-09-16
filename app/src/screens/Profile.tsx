import { useState } from 'react'
import { useStore } from '../state/store'
import { Mascot } from '../components/Mascot'
import { IconFlame } from '../components/icons'

export function Profile() {
  const { state, dispatch } = useStore()
  const [name, setName] = useState(state.name)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="px-5 pt-12">
      <div className="flex flex-col items-center text-center">
        <Mascot mood="happy" size={72} />
        <h1 className="mt-3 text-xl font-bold text-[var(--color-ink)]">{state.name}</h1>
        <p className="mt-1 text-[13px] text-[var(--color-mist)]">Level {state.level} · {state.xp} XP</p>
      </div>

      <div className="mt-6 flex gap-2.5">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--color-line)] bg-white p-3.5 shadow-[var(--shadow-soft)]">
          <IconFlame className="h-4 w-4 text-[var(--color-gold)]" />
          <span className="text-[14px] font-bold text-[var(--color-ink)]">{state.streak} day streak</span>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-[var(--color-line)] bg-white p-3.5 shadow-[var(--shadow-soft)]">
          <span className="text-[14px] font-bold text-[var(--color-ink)]">{state.directions.length} Directions</span>
        </div>
      </div>

      <div className="mt-7">
        <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-mist)]">Your name</label>
        <div className="mt-2 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-brand)]"
          />
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_NAME', name })}
            className="rounded-xl bg-[var(--color-brand)] px-4 text-[13px] font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-[var(--color-line)] pt-5">
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="text-[13px] font-semibold text-[var(--color-health)]"
          >
            Reset all progress
          </button>
        ) : (
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-4">
            <p className="text-[13px] font-medium text-[var(--color-ink-soft)]">This clears every Direction and all progress. This can't be undone.</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESET' })}
                className="flex-1 rounded-xl bg-[var(--color-health)] py-2 text-[13px] font-semibold text-white"
              >
                Yes, reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded-xl border border-[var(--color-line)] py-2 text-[13px] font-semibold text-[var(--color-ink-soft)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
