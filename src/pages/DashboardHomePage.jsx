import { useAuth } from "../hooks/useAuth.js";
import { UserSessionCard } from "../components/UserSessionCard.jsx";

export function DashboardHomePage() {
  const { session, activeWorkspace } = useAuth();

  if (session == null) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base">
          {activeWorkspace ? (
            <>
              Active workspace:{" "}
              <span className="font-medium text-zinc-800">
                {activeWorkspace.name}
              </span>
              . Switch workspaces from the bar above. Open{" "}
              <span className="font-medium text-zinc-800">Team & invites</span>{" "}
              in the sidebar to manage people.
            </>
          ) : (
            <>
              Select a workspace from the bar above when available. Use the
              account menu to sign out.
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
      </div>
    </div>
  );
}
