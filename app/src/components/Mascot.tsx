interface MascotProps {
  mood?: 'calm' | 'happy' | 'celebrate' | 'thinking'
  size?: number
  className?: string
  float?: boolean
}

export function Mascot({ mood = 'calm', size = 96, className = '', float = false }: MascotProps) {
  const eyeY = mood === 'celebrate' ? 44 : 46
  return (
    <div className={`${className} ${float ? 'animate-float' : ''}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="mascotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9B7BFF" />
            <stop offset="55%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#FF4F9A" />
          </linearGradient>
        </defs>

        {mood === 'celebrate' && (
          <>
            <path d="M14 20l2.5 6 6 2.5-6 2.5L14 37l-2.5-6.5L5 28l6.5-2z" fill="var(--color-lime)" />
            <path d="M86 58l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="var(--color-gold)" />
            <circle cx="88" cy="18" r="3.5" fill="var(--color-pink)" />
          </>
        )}

        <path
          d="M50 8c22 0 34 16 34 36 0 14-4 24-4 30 0 8-8 12-14 8-4-3-9-3-13 0-4 3-9 3-13 0-6-4-14-0-14-8 0-6-4-16-4-30C36 24 28 8 50 8Z"
          fill="url(#mascotGrad)"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* rosy cheeks */}
        <ellipse cx="33" cy="54" rx="5" ry="3" fill="#FF8FC2" opacity="0.7" />
        <ellipse cx="67" cy="54" rx="5" ry="3" fill="#FF8FC2" opacity="0.7" />

        {mood === 'thinking' ? (
          <>
            <circle cx="40" cy={eyeY} r="3.4" fill="white" />
            <circle cx="60" cy={eyeY} r="3.4" fill="white" />
            <path d="M42 62q8 5 16 0" stroke="white" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'celebrate' ? (
          <>
            <path d="M35 42q5-7 10 0" stroke="white" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            <path d="M55 42q5-7 10 0" stroke="white" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            <path d="M38 59q12 10 24 0" stroke="white" strokeWidth="3.6" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'happy' ? (
          <>
            <circle cx="40" cy={eyeY} r="3.4" fill="white" />
            <circle cx="60" cy={eyeY} r="3.4" fill="white" />
            <path d="M40 60q10 7 20 0" stroke="white" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="40" cy={eyeY} r="3.4" fill="white" />
            <circle cx="60" cy={eyeY} r="3.4" fill="white" />
            <path d="M43 60q7 4 14 0" stroke="white" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  )
}
