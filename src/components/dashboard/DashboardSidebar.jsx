import { NavLink } from 'react-router-dom'
import { WorkspaceSwitcher } from '../WorkspaceSwitcher.jsx'

const linkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-indigo-50 text-indigo-900'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
  ].join(' ')

export function DashboardSidebar() {
  return (
    <aside className="border-b border-zinc-200 bg-white md:flex md:w-56 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="border-b border-zinc-100 px-3 py-3 md:px-3 md:pb-3 md:pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Workspace
        </p>
        <WorkspaceSwitcher className="w-full max-w-none" />
      </div>
      <nav
        className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:overflow-visible md:px-3 md:py-4 md:pt-2"
        aria-label="Dashboard"
      >
        <NavLink to="/dashboard" end className={linkClass}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/team" className={linkClass}>
          Team & invites
        </NavLink>
      </nav>
    </aside>
  )
}
