import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useWorkspaceTeam } from '../hooks/useWorkspaceTeam.js'
import {
  WORKSPACE_ROLES,
  createWorkspaceInvite,
  updateWorkspaceInviteRole,
  updateWorkspaceMemberRole,
  AuthApiError,
} from '../api/index.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

function RoleSelect({ value, onChange, disabled }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="h-8 w-[7.5rem]" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {WORKSPACE_ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function WorkspaceTeamPage() {
  const { session, activeWorkspace } = useAuth()
  const workspaceId = activeWorkspace?.id
  const token = session?.accessToken
  const { members, invites, loading, error, refresh } = useWorkspaceTeam(workspaceId, token)

  const [email, setEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [formError, setFormError] = useState(/** @type {string | null} */ (null))
  const [submitting, setSubmitting] = useState(false)
  const [rowBusy, setRowBusy] = useState(/** @type {string | null} */ (null))

  if (session == null) return null

  async function handleInvite(e) {
    e.preventDefault()
    setFormError(null)
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFormError('Enter a valid email address.')
      return
    }
    if (!workspaceId || !token) return
    const role = WORKSPACE_ROLES.includes(inviteRole) ? inviteRole : 'member'
    setSubmitting(true)
    try {
      await createWorkspaceInvite(workspaceId, token, { email: trimmed, role })
      setEmail('')
      await refresh()
    } catch (err) {
      const msg = err instanceof AuthApiError ? err.message : 'Could not send invite.'
      setFormError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  /** @param {string} memberId @param {string} role */
  async function patchMemberRole(memberId, role) {
    if (!WORKSPACE_ROLES.includes(role)) return
    if (!workspaceId || !token) return
    const key = `m:${memberId}`
    setRowBusy(key)
    try {
      await updateWorkspaceMemberRole(workspaceId, memberId, token, { role })
      await refresh()
    } finally {
      setRowBusy(null)
    }
  }

  /** @param {string} inviteId @param {string} role */
  async function patchInviteRole(inviteId, role) {
    if (!WORKSPACE_ROLES.includes(role)) return
    if (!workspaceId || !token) return
    const key = `i:${inviteId}`
    setRowBusy(key)
    try {
      await updateWorkspaceInviteRole(workspaceId, inviteId, token, { role })
      await refresh()
    } finally {
      setRowBusy(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Team & invites
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Invite people by email and control their role for{' '}
          <span className="font-medium text-foreground">{activeWorkspace?.name ?? 'this workspace'}</span>
          . Changes call your API module (mocked in development).
        </p>
      </div>

      {!activeWorkspace ? (
        <Alert>
          <AlertDescription>
            Select a workspace in the sidebar to manage invites and members.
          </AlertDescription>
        </Alert>
      ) : null}

      {activeWorkspace ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Invite by email</CardTitle>
              <CardDescription>
                Pending invites can have their role updated before they accept.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1 space-y-2">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    autoComplete="email"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-44">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(v) => {
                      if (WORKSPACE_ROLES.includes(v)) setInviteRole(v)
                    }}
                  >
                    <SelectTrigger id="invite-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKSPACE_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={submitting} className="sm:shrink-0">
                  {submitting ? 'Sending…' : 'Send invite'}
                </Button>
              </form>
              {formError ? (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              ) : null}
            </CardContent>
          </Card>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {loading && members == null ? (
            <p className="text-sm text-muted-foreground">Loading team…</p>
          ) : null}

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Members</CardTitle>
              <CardDescription>Active people in this workspace.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(members ?? []).map((m) => (
                      <tr key={m.id}>
                        <td className="px-6 py-3 font-medium">{m.name}</td>
                        <td className="px-6 py-3 text-muted-foreground">{m.email}</td>
                        <td className="px-6 py-3">
                          <RoleSelect
                            value={m.role}
                            disabled={rowBusy === `m:${m.id}`}
                            onChange={(role) => patchMemberRole(m.id, role)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {members && members.length === 0 ? (
                  <p className="px-6 py-8 text-center text-sm text-muted-foreground">No members yet.</p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Pending invites</CardTitle>
              <CardDescription>Invited by email; not yet accepted.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Invited</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(invites ?? []).map((inv) => (
                      <tr key={inv.id}>
                        <td className="px-6 py-3 font-medium">{inv.email}</td>
                        <td className="px-6 py-3">
                          <RoleSelect
                            value={inv.role}
                            disabled={rowBusy === `i:${inv.id}`}
                            onChange={(role) => patchInviteRole(inv.id, role)}
                          />
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {new Date(inv.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {invites && invites.length === 0 ? (
                  <p className="px-6 py-8 text-center text-sm text-muted-foreground">No pending invites.</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
