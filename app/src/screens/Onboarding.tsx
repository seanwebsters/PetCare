import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { generateDirection, GOAL_SUGGESTIONS } from '../data/pathTemplates'
import { Mascot } from '../components/Mascot'
import { CategoryPill } from '../components/CategoryBadge'
import type { Direction } from '../types'
import { IconChevronRight, IconSparkle } from '../components/icons'
import { CornerGems } from '../components/CornerGems'

type Stage = 'ask' | 'thinking' | 'preview'

const THINKING_LINES = [
  'READING GOAL...',
  'ROLLING FOR MILESTONES...',
  'PICKING FIRST QUEST...',
  'LOADING...',
]

export function Onboarding({ isFirstRun = false }: { isFirstRun?: boolean }) {
  const { dispatch } = useStore()
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage>('ask')
  const [goal, setGoal] = useState('')
  const [thinkingLine, setThinkingLine] = useState(0)
  const [preview, setPreview] = useState<Direction | null>(null)

  function startGenerating(value: string) {
    if (!value.trim()) return
    setGoal(value)
    setStage('thinking')
    let line = 0
    const interval = setInterval(() => {
      line += 1
      setThinkingLine(Math.min(line, THINKING_LINES.length - 1))
    }, 480)

    setTimeout(() => {
      clearInterval(interval)
      const direction = generateDirection(value)
      setPreview(direction)
      setStage('preview')
    }, 1900)
  }

  function confirmDirection() {
    if (!preview) return
    dispatch({ type: 'ADD_DIRECTION', direction: preview })
    if (isFirstRun) return
    navigate(`/direction/${preview.id}`)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[var(--color-paper)] px-6 pb-10 pt-14">
      {stage === 'ask' && (
        <AskStage isFirstRun={isFirstRun} onSubmit={startGenerating} />
      )}
      {stage === 'thinking' && <ThinkingStage line={THINKING_LINES[thinkingLine]} goal={goal} />}
      {stage === 'preview' && preview && (
        <PreviewStage direction={preview} onConfirm={confirmDirection} onBack={() => setStage('ask')} />
      )}
    </div>
  )
}

function AskStage({ isFirstRun, onSubmit }: { isFirstRun: boolean; onSubmit: (v: string) => void }) {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col animate-[pop_0.5s_steps(3)]">
      {isFirstRun ? (
        <div className="mb-2 flex items-center gap-2 text-[var(--color-brand)]">
          <span className="pixel-sm flex h-7 w-7 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-lime)] text-sm font-black text-[var(--color-ink)]">
            D
          </span>
          <span className="display text-xs">DIRECTION</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => navigate('/')}
          className="pixel-sm mb-2 flex h-9 w-9 items-center justify-center self-end border-2 border-[var(--color-ink)] bg-white shadow-[var(--shadow-pop-sm)]"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}

      <div className="mt-6 flex justify-center">
        <Mascot mood="thinking" size={104} float />
      </div>

      <h1 className="display mt-8 text-center text-[22px] leading-[1.6] text-[var(--color-ink)]">
        Where's life<br />taking you next?
      </h1>
      <p className="mt-3 text-center text-[19px] leading-relaxed text-[var(--color-ink-soft)]">
        Drop a goal, any goal. We'll turn it into a real plan + something to actually do today.
      </p>

      <div className="mt-8">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="I want to become a Creative Director…"
          rows={3}
          className="pixel w-full resize-none border-2 border-[var(--color-ink)] bg-white p-4 text-[19px] text-[var(--color-ink)] shadow-[var(--shadow-pop)] outline-none placeholder:text-[var(--color-mist)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
        />
        <button
          type="button"
          disabled={!value.trim()}
          onClick={() => onSubmit(value)}
          className="pixel mt-4 flex w-full items-center justify-center gap-2 border-2 border-[var(--color-ink)] bg-[var(--color-brand)] py-3.5 text-base font-bold text-white shadow-[var(--shadow-pop)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-40"
        >
          <IconSparkle className="h-4 w-4" />
          LET'S BUILD THIS
        </button>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-mist)]">&gt; or pick your vibe</p>
        <div className="flex flex-wrap gap-2">
          {GOAL_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSubmit(s)}
              className="pixel-sm border-2 border-[var(--color-ink)] bg-white px-3.5 py-2 text-base font-semibold text-[var(--color-ink-soft)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:bg-[var(--color-cloud)]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ThinkingStage({ line, goal }: { line: string; goal: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Mascot mood="thinking" size={112} float />
      <p className="mt-8 text-base font-bold uppercase tracking-wide text-[var(--color-brand)]">"{goal}"</p>
      <p className="display mt-3 text-xs text-[var(--color-ink)] transition-opacity">{line}</p>
      <div className="mt-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 animate-bounce border-2 border-[var(--color-ink)] bg-[var(--color-pink)]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function PreviewStage({ direction, onConfirm, onBack }: { direction: Direction; onConfirm: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col animate-[pop_0.4s_steps(3)]">
      <button type="button" onClick={onBack} className="mb-2 self-start text-base font-semibold text-[var(--color-mist)]">
        ← Try another goal
      </button>

      <div className="flex items-center gap-2">
        <Mascot mood="happy" size={48} />
        <p className="text-base font-bold text-[var(--color-ink)]">Say less. Here's your path.</p>
      </div>

      <div className="pixel relative mt-4 border-2 border-[var(--color-ink)] bg-white p-5 shadow-[var(--shadow-pop)]">
        <CornerGems />
        <CategoryPill category={direction.category} />
        <h2 className="display mt-3 text-base leading-[1.6] text-[var(--color-ink)]">{direction.goal}</h2>
        <p className="mt-1 text-sm font-medium text-[var(--color-ink-soft)]">{direction.milestones.length} milestones · {direction.milestones.reduce((n, m) => n + m.tasks.length, 0)} steps</p>

        <div className="mt-5 space-y-0">
          {direction.milestones.map((m, i) => (
            <div key={m.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="pixel-sm flex h-7 w-7 shrink-0 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-brand-light)] text-sm font-bold text-[var(--color-brand-dark)]">
                  {i + 1}
                </span>
                {i < direction.milestones.length - 1 && <span className="my-0.5 w-px flex-1 bg-[var(--color-line)]" />}
              </div>
              <div className="pb-4">
                <p className="text-[18px] font-bold leading-tight text-[var(--color-ink)]">{m.title}</p>
                <p className="text-base text-[var(--color-mist)]">{m.blurb}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pixel-sm border-2 border-[var(--color-ink)] bg-[var(--color-lime)] p-3.5">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-lime-ink)] opacity-70">First up, today</p>
          <p className="mt-1 text-[18px] font-bold leading-tight text-[var(--color-lime-ink)]">
            {direction.milestones[0]?.tasks[0]?.title}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="pixel mt-6 flex w-full items-center justify-center gap-2 border-2 border-[var(--color-ink)] bg-[var(--color-brand)] py-3.5 text-base font-bold text-white shadow-[var(--shadow-pop)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        LOCK IT IN
        <IconChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
