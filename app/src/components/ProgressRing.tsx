interface ProgressRingProps {
  percent: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: React.ReactNode
}

export function ProgressRing({ percent, size = 64, stroke = 6, color = 'var(--color-brand)', track = 'var(--color-line)', children }: ProgressRingProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          style={{ transition: 'stroke-dashoffset 0.3s steps(8)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
