import { NavLink } from 'react-router-dom'
import { WorkspaceSwitcher } from '../WorkspaceSwitcher.jsx'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DashboardSidebar() {
  return (
    <aside className="border-b border-border bg-card md:flex md:w-56 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="border-b border-border px-3 py-3 md:px-3 md:pb-3 md:pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Workspace
        </p>
        <WorkspaceSwitcher className="w-full max-w-none" />
      </div>
      <nav
        className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:overflow-visible md:px-3 md:py-4 md:pt-2"
        aria-label="Dashboard"
      >
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
              'w-full justify-start',
            )
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/dashboard/team"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
              'w-full justify-start',
            )
          }
        >
          Team & invites
        </NavLink>
      </nav>
    </aside>
  )
}
