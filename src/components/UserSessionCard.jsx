export function UserSessionCard({ user, accessToken, workspace }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03]">
      <div className="border-b border-zinc-100 bg-gradient-to-br from-zinc-50 to-white px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Your profile
        </p>
        <div className="mt-4 flex items-center gap-4">
          {user.picture ? (
            <img
              src={user.picture}
              alt=""
              className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
            />
          ) : (
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white bg-zinc-200 text-lg font-semibold text-zinc-600 shadow-sm"
              aria-hidden
            >
              {user.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-zinc-900">
              {user.name}
            </p>
            <p className="truncate text-sm text-zinc-600">{user.email}</p>
          </div>
        </div>
      </div>
      {workspace ? (
        <div className="border-b border-zinc-100 px-6 py-4">
          <p className="text-xs font-medium text-zinc-500">Active workspace</p>
          <p className="mt-1 text-sm font-medium text-zinc-900">{workspace.name}</p>
          {workspace.slug ? (
            <p className="mt-0.5 font-mono text-xs text-zinc-500">/{workspace.slug}</p>
          ) : null}
        </div>
      ) : null}
      <div className="px-6 py-5">
        <p className="text-xs font-medium text-zinc-500">Access token</p>
        <p className="mt-1.5 break-all font-mono text-xs leading-relaxed text-zinc-700">
          {accessToken}
        </p>
      </div>
    </div>
  );
}
