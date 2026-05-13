import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar.jsx'

export function DashboardLayout() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-zinc-50">
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <DashboardSidebar />
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(99,102,241,0.08),transparent)]"
            aria-hidden
          />
          <div className="relative flex-1">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
