const COLORS = ['var(--color-lime)', 'var(--color-pink)', 'var(--color-gold)', 'var(--color-life)']

export function CornerGems() {
  return (
    <>
      <span className="absolute left-0.5 top-0.5 h-3 w-3 border-2 border-[var(--color-ink)]" style={{ background: COLORS[0] }} />
      <span className="absolute right-0.5 top-0.5 h-3 w-3 border-2 border-[var(--color-ink)]" style={{ background: COLORS[1] }} />
      <span className="absolute bottom-0.5 left-0.5 h-3 w-3 border-2 border-[var(--color-ink)]" style={{ background: COLORS[2] }} />
      <span className="absolute bottom-0.5 right-0.5 h-3 w-3 border-2 border-[var(--color-ink)]" style={{ background: COLORS[3] }} />
    </>
  )
}
