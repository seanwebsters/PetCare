import { useMemo, useState } from 'react'
import { useStore } from '../state/store'
import { CATEGORIES, CATEGORY_ORDER } from '../data/categories'
import { CategoryAvatar } from '../components/CategoryBadge'
import { Mascot } from '../components/Mascot'
import { IconDoc, IconPlay, IconSparkle } from '../components/icons'
import type { Category, ContentItem, Direction } from '../types'

const CONTENT_ICON: Record<ContentItem['kind'], typeof IconPlay> = {
  video: IconPlay,
  article: IconDoc,
  challenge: IconSparkle,
  people: IconDoc,
  template: IconDoc,
  course: IconPlay,
}

interface FeedItem {
  content: ContentItem
  direction: Direction
}

export function Explore() {
  const { state } = useStore()
  const [filter, setFilter] = useState<Category | 'all'>('all')

  const feed = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = []
    state.directions.forEach((direction) => {
      direction.content.forEach((content) => items.push({ content, direction }))
    })
    return items
  }, [state.directions])

  const filtered = filter === 'all' ? feed : feed.filter((f) => f.direction.category === filter)
  const activeCategories = CATEGORY_ORDER.filter((c) => state.directions.some((d) => d.category === c))

  return (
    <div className="px-5 pt-12">
      <h1 className="display text-lg leading-[1.6] text-[var(--color-ink)]">Explore</h1>
      <p className="mt-2 text-[18px] text-[var(--color-ink-soft)]">Stuff worth your scroll, picked for your goals.</p>

      {feed.length === 0 ? (
        <div className="pixel mt-8 flex flex-col items-center gap-3 border-2 border-dashed border-[var(--color-ink)] bg-white py-10 text-center">
          <Mascot mood="calm" size={56} />
          <p className="text-[18px] font-bold text-[var(--color-ink)]">Nothing to explore yet</p>
          <p className="px-8 text-base text-[var(--color-mist)]">Add a Direction and we'll surface content that matches it.</p>
        </div>
      ) : (
        <>
          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`pixel-sm shrink-0 border-2 border-[var(--color-ink)] px-3.5 py-1.5 text-base font-bold transition-colors ${
                filter === 'all' ? 'bg-[var(--color-brand)] text-white' : 'bg-white text-[var(--color-ink-soft)]'
              }`}
            >
              ALL
            </button>
            {activeCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`pixel-sm shrink-0 border-2 border-[var(--color-ink)] px-3.5 py-1.5 text-base font-bold uppercase transition-colors ${
                  filter === c ? 'text-white' : 'bg-white text-[var(--color-ink-soft)]'
                }`}
                style={filter === c ? { background: CATEGORIES[c].color } : undefined}
              >
                {CATEGORIES[c].label}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-2.5">
            {filtered.map(({ content, direction }, i) => {
              const meta = CATEGORIES[direction.category]
              const Icon = CONTENT_ICON[content.kind]
              return (
                <div key={`${content.id}_${i}`} className="pixel flex items-center gap-3.5 border-2 border-[var(--color-ink)] bg-white p-3.5 shadow-[var(--shadow-soft)]">
                  <span className="pixel-sm flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[var(--color-ink)]" style={{ background: meta.soft, color: meta.color }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[18px] font-bold text-[var(--color-ink)]">{content.title}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[var(--color-mist)]">
                      <CategoryAvatar category={direction.category} size={16} />
                      {direction.goal} · {content.meta}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
