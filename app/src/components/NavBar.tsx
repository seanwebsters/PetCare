import { NavLink } from 'react-router-dom'
import { IconBars, IconCheckCircle, IconCompass, IconHome, IconUser } from './icons'

const items = [
  { to: '/', label: 'Home', icon: IconHome, end: true, color: 'var(--color-lime)' },
  { to: '/explore', label: 'Explore', icon: IconCompass, end: false, color: 'var(--color-life)' },
  { to: '/today', label: 'Today', icon: IconCheckCircle, end: false, color: 'var(--color-pink)' },
  { to: '/progress', label: 'Progress', icon: IconBars, end: false, color: 'var(--color-gold)' },
  { to: '/profile', label: 'Profile', icon: IconUser, end: false, color: 'var(--color-career)' },
]

export function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[var(--color-ink)] bg-[var(--color-paper)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5">
        {items.map(({ to, label, icon: Icon, end, color }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 px-2 py-1.5 text-sm font-bold uppercase tracking-tight transition-colors ${
                isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-mist)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="flex h-7 w-7 items-center justify-center border-2 transition-colors"
                  style={{ borderColor: isActive ? 'var(--color-ink)' : 'transparent', background: isActive ? color : 'transparent' }}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
