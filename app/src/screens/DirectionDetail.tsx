import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../state/store'
import { CategoryPill } from '../components/CategoryBadge'
import { ProgressRing } from '../components/ProgressRing'
import { Mascot } from '../components/Mascot'
import { CornerGems } from '../components/CornerGems'
import { IconChevronLeft, IconChevronRight, IconPlay, IconDoc, IconSparkle } from '../components/icons'
import { CATEGORIES } from '../data/categories'
import { directionProgress, isDirectionComplete, isMilestoneDone, activeMilestoneIndex } from '../lib/xp'
import { generateDirection } from '../data/pathTemplates'
import type { ContentItem } from '../types'

const CONTENT_ICON: Record<ContentItem['kind'], typeof IconPlay> = {
  video: IconPlay,
  article: IconDoc,
  challenge: IconSparkle,
  people: IconDoc,
  template: IconDoc,
  course: IconPlay,
}

export function DirectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useStore()
  const direction = state.directions.find((d) => d.id === id)
  const [openMilestone, setOpenMilestone] = useState<string | null>(null)

  if (!direction) {
    return (
      <div className="p-6 text-center text-base text-[var(--color-mist)]">
        Direction not found. <Link to="/" className="text-[var(--color-brand)]">Go home</Link>
      </div>
    )
  }

  const meta = CATEGORIES[direction.category]
  const pct = directionProgress(direction)
  const complete = isDirectionComplete(direction)
  const activeIdx = activeMilestoneIndex(direction)
  const effectiveOpen = openMilestone ?? direction.milestones[activeIdx]?.id ?? null

  function addNext(suggestion: string) {
    const next = generateDirection(suggestion)
    dispatch({ type: 'ADD_DIRECTION', direction: next })
    navigate(`/direction/${next.id}`)
  }

  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} className="pixel-sm flex h-9 w-9 items-center justify-center border-2 border-[var(--color-ink)] bg-white shadow-[var(--shadow-pop-sm)]">
          <IconChevronLeft className="h-4 w-4 text-[var(--color-ink)]" />
        </button>
        <CategoryPill category={direction.category} />
      </div>

      <div className="mt-5 flex items-center gap-4">
        <ProgressRing percent={pct} size={72} color={meta.color}>
          <span className="display text-xs text-[var(--color-ink)]">{pct}%</span>
        </ProgressRing>
        <div className="min-w-0">
          <h1 className="display text-sm leading-[1.7] text-[var(--color-ink)]">{direction.goal}</h1>
          {direction.numericTarget && (
            <p className="mt-2 text-base font-medium text-[var(--color-ink-soft)]">
              {direction.numericTarget.unit}
              {Math.round((direction.numericTarget.target * pct) / 100).toLocaleString()} of {direction.numericTarget.unit}
              {direction.numericTarget.target.toLocaleString()}
            </p>
          )}
          {!direction.numericTarget && <p className="mt-2 text-base text-[var(--color-mist)]">Your journey</p>}
        </div>
      </div>

      <div className="mt-7">
        <h2 className="display mb-3 text-xs text-[var(--color-ink)]">Your path</h2>
        <div>
          {direction.milestones.map((m, i) => {
            const done = isMilestoneDone(m)
            const isActive = i === activeIdx
            const isOpen = effectiveOpen === m.id
            return (
              <div key={m.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className="pixel-sm flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[var(--color-ink)] text-sm font-bold"
                    style={{
                      background: done ? meta.color : isActive ? meta.soft : 'var(--color-cloud)',
                      color: done ? 'white' : isActive ? meta.color : 'var(--color-mist)',
                    }}
                  >
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  {i < direction.milestones.length - 1 && (
                    <span className="my-0.5 w-px flex-1" style={{ background: done ? meta.color : 'var(--color-line)' }} />
                  )}
                </div>
                <div
                  className={`pixel mb-4 flex-1 border-2 p-3.5 transition-colors ${
                    isOpen ? 'border-[var(--color-ink)] bg-white shadow-[var(--shadow-soft)]' : 'border-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenMilestone(isOpen ? '' : m.id)}
                    className="w-full text-left"
                  >
                    <p className={`text-[18px] font-bold leading-tight ${done ? 'text-[var(--color-ink-soft)]' : 'text-[var(--color-ink)]'}`}>{m.title}</p>
                    <p className="text-base text-[var(--color-mist)]">{m.blurb}</p>
                  </button>

                  {isOpen && (
                    <div className="mt-3 space-y-2">
                      {m.tasks.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => {
                            if (!task.done) dispatch({ type: 'COMPLETE_TASK', directionId: direction.id, taskId: task.id })
                          }}
                          className="pixel-sm flex w-full items-center gap-2.5 border border-[var(--color-ink)]/10 bg-[var(--color-cloud)] p-2.5 text-left"
                        >
                          <span
                            className={`pixel-sm flex h-5 w-5 shrink-0 items-center justify-center border-2 border-[var(--color-ink)] ${
                              task.done ? 'bg-[var(--color-lime)]' : 'bg-white'
                            }`}
                          >
                            {task.done && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter">
                                <path d="m5 13 4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <span className={`flex-1 text-base ${task.done ? 'text-[var(--color-mist)] line-through' : 'text-[var(--color-ink)]'}`}>
                            {task.title}
                          </span>
                          <span className="text-sm font-bold text-[var(--color-mist)]">{task.minutes}m</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {direction.content.length > 0 && (
        <div className="mt-2">
          <h2 className="display mb-3 text-xs text-[var(--color-ink)]">Relevant content</h2>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {direction.content.map((c) => {
              const Icon = CONTENT_ICON[c.kind]
              return (
                <div key={c.id} className="pixel w-[168px] shrink-0 border-2 border-[var(--color-ink)] bg-white p-3.5 shadow-[var(--shadow-soft)]">
                  <span className="pixel-sm flex h-8 w-8 items-center justify-center border-2 border-[var(--color-ink)]" style={{ background: meta.soft, color: meta.color }}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2.5 text-base font-bold leading-snug text-[var(--color-ink)]">{c.title}</p>
                  <p className="mt-1 text-sm font-medium text-[var(--color-mist)]">{c.meta}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {complete && (
        <div className="pixel relative mt-8 border-2 border-[var(--color-ink)] bg-white p-5 text-center shadow-[var(--shadow-pop)]">
          <CornerGems />
          <Mascot mood="celebrate" size={64} className="mx-auto" />
          <p className="display mt-3 text-sm leading-[1.7] text-[var(--color-ink)]">DIRECTION ACHIEVED!</p>
          <p className="mt-2 text-base font-medium text-[var(--color-mist)]">What's calling you next?</p>
          <div className="mt-4 space-y-2">
            {direction.nextSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addNext(s)}
                className="pixel-sm flex w-full items-center justify-between border-2 border-[var(--color-ink)] bg-[var(--color-lime)] px-4 py-3 text-left text-base font-bold text-[var(--color-ink)] shadow-[var(--shadow-pop-sm)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                {s}
                <IconChevronRight className="h-4 w-4 text-[var(--color-ink)]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
