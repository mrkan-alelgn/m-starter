import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function UserSessionCard({ user, accessToken, workspace }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your profile
        </p>
        <div className="mt-4 flex items-center gap-4">
          {user.picture ? (
            <img
              src={user.picture}
              alt=""
              className="h-14 w-14 shrink-0 rounded-full border-2 border-background object-cover shadow-sm"
            />
          ) : (
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-lg font-semibold text-muted-foreground shadow-sm"
              aria-hidden
            >
              {user.name?.charAt(0) ?? '?'}
            </div>
          )}
          <div className="min-w-0">
            <CardTitle className="truncate text-lg leading-snug">{user.name}</CardTitle>
            <CardDescription className="truncate text-sm">{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {workspace ? (
        <>
          <CardContent className="space-y-1 pt-6">
            <p className="text-xs font-medium text-muted-foreground">Active workspace</p>
            <p className="text-sm font-medium text-foreground">{workspace.name}</p>
            {workspace.slug ? (
              <p className="font-mono text-xs text-muted-foreground">/{workspace.slug}</p>
            ) : null}
          </CardContent>
          <Separator />
        </>
      ) : null}
      <CardContent className="pt-6">
        <p className="text-xs font-medium text-muted-foreground">Access token</p>
        <p className="mt-1.5 break-all font-mono text-xs leading-relaxed text-foreground/80">
          {accessToken}
        </p>
      </CardContent>
    </Card>
  )
}
