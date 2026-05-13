import { ChevronDownIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

/** @param {{ className?: string }} [props] */
export function WorkspaceSwitcher({ className = '' }) {
  const { session, activeWorkspace, setActiveWorkspace } = useAuth()

  if (session == null) return null

  const { workspaces } = session
  const label = activeWorkspace?.name ?? 'Workspace'

  if (workspaces.length === 0) {
    return (
      <span
        className={cn(
          'block truncate rounded-lg border border-dashed border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground',
          className,
        )}
      >
        No workspaces
      </span>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-auto min-h-9 w-full max-w-full justify-between gap-2 px-3 py-2 font-medium',
            'min-w-0 max-w-[min(100%,14rem)] sm:max-w-xs',
            className,
          )}
          aria-label="Switch workspace"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold uppercase text-primary">
              {label.slice(0, 2)}
            </span>
            <span className="truncate">{label}</span>
          </span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[16rem]">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={session.activeWorkspaceId ?? ''}
          onValueChange={(id) => setActiveWorkspace(id)}
        >
          {workspaces.map((w) => (
            <DropdownMenuRadioItem key={w.id} value={w.id} className="gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold uppercase text-muted-foreground">
                {w.name.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1 truncate">{w.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
