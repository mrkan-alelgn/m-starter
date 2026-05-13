import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar.jsx'
import { Sheet } from '@/components/ui/sheet'

export function DashboardLayout() {
  const location = useLocation()

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-zinc-50">
      <Sheet key={location.pathname}>
        <Navbar showDashboardMobileNav />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <DashboardSidebar />
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(99,102,241,0.08),transparent)]"
              aria-hidden
            />
            <Outlet />
          </div>
        </div>
      </Sheet>
      <Footer />
    </div>
  )
}
