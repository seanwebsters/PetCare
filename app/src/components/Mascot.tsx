interface MascotProps {
  mood?: 'calm' | 'happy' | 'celebrate' | 'thinking'
  size?: number
  className?: string
  float?: boolean
}

export function Mascot({ mood = 'calm', size = 96, className = '', float = false }: MascotProps) {
  const eyeY = mood === 'celebrate' ? 44 : 46
  return (
    <div className={`${className} ${float ? 'animate-[float_6s_ease-in-out_infinite]' : ''}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="mascotGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9E9CFB" />
            <stop offset="100%" stopColor="#6C6BF5" />
          </linearGradient>
        </defs>
        <path
          d="M50 8c22 0 34 16 34 36 0 14-4 24-4 30 0 8-8 12-14 8-4-3-9-3-13 0-4 3-9 3-13 0-6-4-14-0-14-8 0-6-4-16-4-30C36 24 28 8 50 8Z"
          fill="url(#mascotGrad)"
        />
        {mood === 'thinking' ? (
          <>
            <circle cx="40" cy={eyeY} r="3.2" fill="white" />
            <circle cx="60" cy={eyeY} r="3.2" fill="white" />
            <path d="M42 62q8 5 16 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'celebrate' ? (
          <>
            <path d="M36 44q4-5 8 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M56 44q4-5 8 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M40 60q10 8 20 0" stroke="white" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'happy' ? (
          <>
            <circle cx="40" cy={eyeY} r="3.2" fill="white" />
            <circle cx="60" cy={eyeY} r="3.2" fill="white" />
            <path d="M41 60q9 6 18 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="40" cy={eyeY} r="3.2" fill="white" />
            <circle cx="60" cy={eyeY} r="3.2" fill="white" />
            <path d="M43 60q7 4 14 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  )
}
