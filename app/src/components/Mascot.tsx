interface MascotProps {
  mood?: 'calm' | 'happy' | 'celebrate' | 'thinking'
  size?: number
  className?: string
  float?: boolean
}

const ANTENNA_COLOR: Record<string, string> = {
  calm: 'var(--color-lime)',
  happy: 'var(--color-gold)',
  thinking: 'var(--color-life)',
  celebrate: 'var(--color-pink)',
}

const BODY_D =
  'M50 8c22 0 34 16 34 36 0 14-4 24-4 30 0 8-8 12-14 8-4-3-9-3-13 0-4 3-9 3-13 0-6-4-14-0-14-8 0-6-4-16-4-30C36 24 28 8 50 8Z'

export function Mascot({ mood = 'calm', size = 96, className = '', float = false }: MascotProps) {
  const eyeY = mood === 'celebrate' ? 43 : 46
  const clipId = `mascotClip-${mood}`

  return (
    <div
      className={`${className} ${float ? 'animate-float' : ''}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} shapeRendering="crispEdges">
        <defs>
          <clipPath id={clipId}>
            <path d={BODY_D} />
          </clipPath>
        </defs>

        {mood === 'celebrate' && (
          <>
            <rect x="6" y="12" width="6" height="6" fill="var(--color-lime)" stroke="var(--color-ink)" strokeWidth="1.5" />
            <rect x="88" y="56" width="6" height="6" fill="var(--color-gold)" stroke="var(--color-ink)" strokeWidth="1.5" />
            <rect x="89" y="10" width="5" height="5" fill="var(--color-pink)" stroke="var(--color-ink)" strokeWidth="1.5" />
          </>
        )}

        {/* arm nubs - behind body so only outer edge peeks out */}
        <rect x="8" y="50" width="10" height="11" fill="var(--color-brand)" stroke="var(--color-ink)" strokeWidth="2.5" />
        <rect x="82" y="50" width="10" height="11" fill="var(--color-brand)" stroke="var(--color-ink)" strokeWidth="2.5" />

        {/* body with flat two-tone shading */}
        <path d={BODY_D} fill="var(--color-brand)" />
        <rect x="0" y="58" width="100" height="42" fill="var(--color-brand-dark)" clipPath={`url(#${clipId})`} />
        <rect x="20" y="14" width="28" height="18" fill="var(--color-brand-light)" clipPath={`url(#${clipId})`} opacity="0.9" />
        <path d={BODY_D} fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="miter" />

        {/* antenna - drawn on top so it always reads clearly */}
        <rect x="47" y="6" width="4" height="8" fill="var(--color-ink)" />
        <rect x="43" y="0" width="12" height="10" fill={ANTENNA_COLOR[mood]} stroke="var(--color-ink)" strokeWidth="2.5" />

        {/* blush */}
        <rect x="29" y="52" width="7" height="5" fill="var(--color-pink-soft)" />
        <rect x="64" y="52" width="7" height="5" fill="var(--color-pink-soft)" />

        {mood === 'thinking' ? (
          <>
            <rect x="37" y={eyeY - 3} width="6" height="6" fill="white" stroke="var(--color-ink)" strokeWidth="1.5" />
            <rect x="57" y={eyeY - 3} width="6" height="6" fill="white" stroke="var(--color-ink)" strokeWidth="1.5" />
            <rect x="39" y={eyeY - 1} width="2" height="2" fill="var(--color-ink)" />
            <rect x="59" y={eyeY - 1} width="2" height="2" fill="var(--color-ink)" />
            <rect x="43" y="60" width="14" height="4" fill="var(--color-ink)" />
          </>
        ) : mood === 'celebrate' ? (
          <>
            <rect x="34" y={eyeY - 5} width="6" height="3" fill="var(--color-ink)" />
            <rect x="60" y={eyeY - 5} width="6" height="3" fill="var(--color-ink)" />
            <rect x="37" y="57" width="4" height="4" fill="var(--color-ink)" />
            <rect x="45" y="61" width="10" height="4" fill="var(--color-ink)" />
            <rect x="59" y="57" width="4" height="4" fill="var(--color-ink)" />
          </>
        ) : mood === 'happy' ? (
          <>
            <rect x="37" y={eyeY - 3} width="6" height="6" fill="white" stroke="var(--color-ink)" strokeWidth="1.5" />
            <rect x="57" y={eyeY - 3} width="6" height="6" fill="white" stroke="var(--color-ink)" strokeWidth="1.5" />
            <rect x="39" y={eyeY - 1} width="2" height="2" fill="var(--color-ink)" />
            <rect x="59" y={eyeY - 1} width="2" height="2" fill="var(--color-ink)" />
            <rect x="39" y="59" width="4" height="4" fill="var(--color-ink)" />
            <rect x="43" y="62" width="14" height="4" fill="var(--color-ink)" />
            <rect x="57" y="59" width="4" height="4" fill="var(--color-ink)" />
          </>
        ) : (
          <>
            <rect x="37" y={eyeY - 3} width="6" height="6" fill="white" stroke="var(--color-ink)" strokeWidth="1.5" />
            <rect x="57" y={eyeY - 3} width="6" height="6" fill="white" stroke="var(--color-ink)" strokeWidth="1.5" />
            <rect x="39" y={eyeY - 1} width="2" height="2" fill="var(--color-ink)" />
            <rect x="59" y={eyeY - 1} width="2" height="2" fill="var(--color-ink)" />
            <rect x="42" y="60" width="16" height="4" fill="var(--color-ink)" />
          </>
        )}
      </svg>
    </div>
  )
}
