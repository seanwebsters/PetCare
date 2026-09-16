import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './state/store'
import { NavBar } from './components/NavBar'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { DirectionDetail } from './screens/DirectionDetail'
import { Today } from './screens/Today'
import { Progress } from './screens/Progress'
import { Explore } from './screens/Explore'
import { NewDirection } from './screens/NewDirection'
import { Profile } from './screens/Profile'

function AppShell() {
  const location = useLocation()
  const hideNav = location.pathname === '/new'

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[var(--color-paper)]">
      <div className={hideNav ? '' : 'pb-24'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/today" element={<Today />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/direction/:id" element={<DirectionDetail />} />
          <Route path="/new" element={<NewDirection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!hideNav && <NavBar />}
    </div>
  )
}

export default function App() {
  const { state } = useStore()

  if (!state.onboarded) {
    return <Onboarding isFirstRun />
  }

  return <AppShell />
}
