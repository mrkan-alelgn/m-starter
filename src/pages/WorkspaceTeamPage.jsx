import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useWorkspaceTeam } from "../hooks/useWorkspaceTeam.js";
import {
  WORKSPACE_ROLES,
  createWorkspaceInvite,
  updateWorkspaceInviteRole,
  updateWorkspaceMemberRole,
  AuthApiError,
} from "../api/index.js";

function RoleSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-800 shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
    >
      {WORKSPACE_ROLES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}

export function WorkspaceTeamPage() {
  const { session, activeWorkspace } = useAuth();
  const workspaceId = activeWorkspace?.id;
  const token = session?.accessToken;
  const { members, invites, loading, error, refresh } = useWorkspaceTeam(
    workspaceId,
    token,
  );

  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [formError, setFormError] = useState(
    /** @type {string | null} */ (null),
  );
  const [submitting, setSubmitting] = useState(false);
  const [rowBusy, setRowBusy] = useState(/** @type {string | null} */ (null));

  if (session == null) return null;

  async function handleInvite(e) {
    e.preventDefault();
    setFormError(null);
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (!workspaceId || !token) return;
    const role = WORKSPACE_ROLES.includes(inviteRole) ? inviteRole : "member";
    setSubmitting(true);
    try {
      await createWorkspaceInvite(workspaceId, token, { email: trimmed, role });
      setEmail("");
      await refresh();
    } catch (err) {
      const msg =
        err instanceof AuthApiError ? err.message : "Could not send invite.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  /** @param {string} memberId @param {string} role */
  async function patchMemberRole(memberId, role) {
    if (!WORKSPACE_ROLES.includes(role)) return;
    if (!workspaceId || !token) return;
    const key = `m:${memberId}`;
    setRowBusy(key);
    try {
      await updateWorkspaceMemberRole(workspaceId, memberId, token, { role });
      await refresh();
    } finally {
      setRowBusy(null);
    }
  }

  /** @param {string} inviteId @param {string} role */
  async function patchInviteRole(inviteId, role) {
    if (!WORKSPACE_ROLES.includes(role)) return;
    if (!workspaceId || !token) return;
    const key = `i:${inviteId}`;
    setRowBusy(key);
    try {
      await updateWorkspaceInviteRole(workspaceId, inviteId, token, { role });
      await refresh();
    } finally {
      setRowBusy(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Team & invites
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
          Invite people by email and control their role for{" "}
          <span className="font-medium text-zinc-800">
            {activeWorkspace?.name ?? "this workspace"}
          </span>
          . Changes call your API module (mocked in development).
        </p>
      </div>

      {!activeWorkspace ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Select a workspace in the header to manage invites and members.
        </div>
      ) : null}

      {activeWorkspace ? (
        <div className="space-y-10">
          <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold text-zinc-900">
              Invite by email
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Pending invites can have their role updated before they accept.
            </p>
            <form
              onSubmit={handleInvite}
              className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end"
            >
              <div className="min-w-0 flex-1">
                <label htmlFor="invite-email" className="sr-only">
                  Email
                </label>
                <input
                  id="invite-email"
                  type="email"
                  autoComplete="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-40">
                <label
                  htmlFor="invite-role"
                  className="text-xs font-medium text-zinc-500"
                >
                  Role
                </label>
                <select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {WORKSPACE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send invite"}
              </button>
            </form>
            {formError ? (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {formError}
              </p>
            ) : null}
          </section>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          {loading && members == null ? (
            <p className="text-sm text-zinc-500">Loading team…</p>
          ) : null}

          <section className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-zinc-900">Members</h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Active people in this workspace.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {(members ?? []).map((m) => (
                    <tr key={m.id} className="text-zinc-800">
                      <td className="px-6 py-3 font-medium">{m.name}</td>
                      <td className="px-6 py-3 text-zinc-600">{m.email}</td>
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
                <p className="px-6 py-8 text-center text-sm text-zinc-500">
                  No members yet.
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-zinc-900">
                Pending invites
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Invited by email; not yet accepted.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Invited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {(invites ?? []).map((inv) => (
                    <tr key={inv.id} className="text-zinc-800">
                      <td className="px-6 py-3 font-medium">{inv.email}</td>
                      <td className="px-6 py-3">
                        <RoleSelect
                          value={inv.role}
                          disabled={rowBusy === `i:${inv.id}`}
                          onChange={(role) => patchInviteRole(inv.id, role)}
                        />
                      </td>
                      <td className="px-6 py-3 text-zinc-500">
                        {new Date(inv.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {invites && invites.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-zinc-500">
                  No pending invites.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
