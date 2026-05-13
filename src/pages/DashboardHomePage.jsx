import { useAuth } from '../hooks/useAuth.js'
import { UserSessionCard } from '../components/UserSessionCard.jsx'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function DashboardHomePage() {
  const { session, activeWorkspace } = useAuth()

  if (session == null) return null

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {activeWorkspace ? (
            <>
              Active workspace:{' '}
              <span className="font-medium text-foreground">{activeWorkspace.name}</span>. Switch
              workspaces from the sidebar. Open{' '}
              <span className="font-medium text-foreground">Team & invites</span> to manage people.
            </>
          ) : (
            <>
              Select a workspace from the sidebar when available. Use the account menu to sign out.
            </>
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <UserSessionCard
            user={session.user}
            accessToken={session.accessToken}
            workspace={activeWorkspace}
          />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick tips
            </CardTitle>
            <CardDescription className="mt-2 text-sm leading-relaxed">
              <ul className="list-none space-y-3 pl-0">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Invite teammates by email and assign a role: admin, member, or viewer.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Workspaces load from sign-in or{' '}
                  <code className="rounded bg-muted px-1 font-mono text-xs">GET /workspaces</code>
                  ; your last choice is remembered per browser.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Session data is kept in memory until you log out or refresh.
                </li>
              </ul>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
