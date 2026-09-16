import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9.5a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

export function IconCompass(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" />
    </svg>
  )
}

export function IconCheckCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  )
}

export function IconBars(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 20V11" />
      <path d="M12 20V6" />
      <path d="M18 20v-6" />
    </svg>
  )
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  )
}

export function IconBriefcase(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12.5h17" />
    </svg>
  )
}

export function IconCoin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8" />
      <path d="M14.5 10a2.2 2.2 0 0 0-2.2-1.5H11a2 2 0 0 0 0 4h1.6a2 2 0 0 1 0 4h-1.4A2.2 2.2 0 0 1 9 15" />
    </svg>
  )
}

export function IconHeart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.6-9.5-9.1C1 7.8 2.6 5 5.6 5c1.8 0 3.2 1 4 2.4C10.4 6 11.8 5 13.6 5c3 0 4.6 2.8 3.1 5.9C19.9 15.4 12 20 12 20z" />
    </svg>
  )
}

export function IconPlane(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10.5 3.5 6 8l-4 .8 2.4 2 5-1.3-2.4 4 1.3 1L11 10l3.7 3.7c.6.6 1.6.6 2.1-.1.4-.5.4-1.1 0-1.6L13 8.3l4.4-2.6a1.7 1.7 0 0 0-1.7-2.9L11.2 5.4Z" />
    </svg>
  )
}

export function IconPeople(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M2.8 19c1.1-2.9 3.4-4.4 6.2-4.4s5.1 1.5 6.2 4.4" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.8 14.8c1.8.5 3.1 1.8 3.8 3.8" />
    </svg>
  )
}

export function IconFlame(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3s3 3.2 3 6.5c0 1-.4 1.7-.9 2.4.9-.2 1.9-1 2.4-2.2 1 1.4 1.5 2.9 1.5 4.3 0 3.6-2.7 6-6 6s-6-2.4-6-6c0-2.7 1.4-4.4 2.6-6.1.5-.7.9-1.4 1-2.1.2.6.4 1 .8 1.4.1-1.7-.3-3.1-1.4-5.2C10.6 2.9 12 3 12 3z" />
    </svg>
  )
}

export function IconBolt(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  )
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M12 2c.6 3.4 2 5.9 5 6.5-3 .6-4.4 3.1-5 6.5-.6-3.4-2-5.9-5-6.5 3-.6 4.4-3.1 5-6.5z" />
      <path d="M19 14c.3 1.7 1 2.9 2.5 3.3-1.5.4-2.2 1.6-2.5 3.3-.3-1.7-1-2.9-2.5-3.3 1.5-.4 2.2-1.6 2.5-3.3z" />
    </svg>
  )
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 9v6l5-3-5-3z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconDoc(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12.5h6M9 15.5h6M9 9.5h2" />
    </svg>
  )
}
