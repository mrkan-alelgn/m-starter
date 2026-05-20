import { NavLink } from 'react-router-dom'
import { XIcon } from 'lucide-react'
import { WorkspaceSwitcher } from '../WorkspaceSwitcher.jsx'
import { Button, buttonVariants } from '@/components/ui/button'
import { SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

/** @param {{ sheet?: boolean; className?: string }} [props] */
function DashboardSidebarPanel({ sheet = false, className }) {
  function navLinkClass({ isActive }) {
    return cn(
      buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
      'w-full justify-start',
      isActive &&
        'font-semibold text-foreground shadow-sm ring-1 ring-border/70 dark:ring-border',
    )
  }

  const overview = (
    <NavLink to="/dashboard" end className={navLinkClass}>
      Overview
    </NavLink>
  )
  const team = (
    <NavLink to="/dashboard/team" className={navLinkClass}>
      Team & invites
    </NavLink>
  )
  const samplesTable = (
    <NavLink to="/dashboard/samples/table" className={navLinkClass}>
      TanStack table
    </NavLink>
  )

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', className)}>
      <div
        className={cn(
          'border-b border-border',
          sheet ? 'px-4 py-4' : 'px-3 py-3 lg:px-3 lg:pb-3 lg:pt-4',
        )}
      >
        <p
          className={cn(
            'font-semibold uppercase tracking-wide text-muted-foreground',
            sheet ? 'mb-3 text-[0.6875rem] leading-none' : 'mb-2 text-xs',
          )}
        >
          Workspace
        </p>
        <WorkspaceSwitcher className="w-full max-w-none" />
      </div>
      <nav
        className={cn(
          'flex flex-col overflow-y-auto',
          sheet ? 'gap-1.5 px-4 py-4' : 'gap-1 px-3 py-4 pt-2',
        )}
        aria-label="Dashboard"
      >
        {overview}
        {team}
        <div className={cn('pt-3', sheet ? 'mt-1' : 'mt-2')}>
          <p
            className={cn(
              'mb-1.5 font-semibold uppercase tracking-wide text-muted-foreground',
              sheet ? 'px-0 text-[0.6875rem] leading-none' : 'px-0 text-xs',
            )}
          >
            Samples
          </p>
          <div className="flex flex-col gap-1">{samplesTable}</div>
        </div>
      </nav>
    </div>
  )
}

export function DashboardSidebar() {
  return (
    <>
      <SheetContent
        side="left"
        className="flex h-full w-[min(100%,20rem)] max-w-none flex-col sm:max-w-xs"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3.5">
          <SheetTitle className="min-w-0 flex-1 truncate text-left text-base font-semibold leading-none text-foreground">
            Dashboard
          </SheetTitle>
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <XIcon className="size-5" />
            </Button>
          </SheetClose>
        </div>
        <DashboardSidebarPanel sheet className="min-h-0 flex-1 bg-card" />
      </SheetContent>

      <aside className="hidden min-h-0 w-56 shrink-0 flex-col overflow-hidden border-r border-border bg-card lg:flex">
        <DashboardSidebarPanel />
      </aside>
    </>
  )
}
