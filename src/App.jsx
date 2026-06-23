import { useState } from 'react'
import { SensorProvider } from './context/SensorContext'
import BottomNav from './components/layout/BottomNav'
import Home from './pages/Home'
import Stats from './pages/Stats'
import Dusty from './pages/Dusty'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'

const PAGES = { home: Home, stats: Stats, dusty: Dusty, alerts: Alerts, settings: Settings }

export default function App() {
  const [page, setPage] = useState('dusty')
  const Page = PAGES[page]

  return (
    <SensorProvider>
      <div className="max-w-sm mx-auto min-h-screen bg-gray-50 relative">
        <div className="pb-20 min-h-screen">
          <Page />
        </div>
        <BottomNav active={page} onChange={setPage} />
      </div>
    </SensorProvider>
  )
}
