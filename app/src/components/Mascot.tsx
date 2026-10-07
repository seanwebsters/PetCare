interface MascotProps {
  mood?: 'calm' | 'happy' | 'celebrate' | 'thinking'
  size?: number
  className?: string
  float?: boolean
}

export function Mascot({ mood = 'calm', size = 96, className = '', float = false }: MascotProps) {
  const eyeY = mood === 'celebrate' ? 43 : 46
  return (
    <div
      className={`${className} ${float ? 'animate-float' : ''}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} shapeRendering="crispEdges">
        {mood === 'celebrate' && (
          <>
            <rect x="10" y="16" width="6" height="6" fill="var(--color-lime)" />
            <rect x="84" y="54" width="6" height="6" fill="var(--color-gold)" />
            <rect x="86" y="14" width="5" height="5" fill="var(--color-pink)" />
          </>
        )}

        <path
          d="M50 8c22 0 34 16 34 36 0 14-4 24-4 30 0 8-8 12-14 8-4-3-9-3-13 0-4 3-9 3-13 0-6-4-14-0-14-8 0-6-4-16-4-30C36 24 28 8 50 8Z"
          fill="var(--color-brand)"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinejoin="miter"
        />

        {mood === 'thinking' ? (
          <>
            <rect x="37" y={eyeY - 3} width="6" height="6" fill="white" />
            <rect x="57" y={eyeY - 3} width="6" height="6" fill="white" />
            <rect x="43" y="60" width="14" height="4" fill="white" />
          </>
        ) : mood === 'celebrate' ? (
          <>
            <rect x="34" y={eyeY - 5} width="6" height="3" fill="white" />
            <rect x="60" y={eyeY - 5} width="6" height="3" fill="white" />
            <rect x="37" y="57" width="4" height="4" fill="white" />
            <rect x="45" y="61" width="10" height="4" fill="white" />
            <rect x="59" y="57" width="4" height="4" fill="white" />
          </>
        ) : mood === 'happy' ? (
          <>
            <rect x="37" y={eyeY - 3} width="6" height="6" fill="white" />
            <rect x="57" y={eyeY - 3} width="6" height="6" fill="white" />
            <rect x="39" y="59" width="4" height="4" fill="white" />
            <rect x="43" y="62" width="14" height="4" fill="white" />
            <rect x="57" y="59" width="4" height="4" fill="white" />
          </>
        ) : (
          <>
            <rect x="37" y={eyeY - 3} width="6" height="6" fill="white" />
            <rect x="57" y={eyeY - 3} width="6" height="6" fill="white" />
            <rect x="42" y="60" width="16" height="4" fill="white" />
          </>
        )}
      </svg>
    </div>
  )
}
