import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'

function workspaceStorageKey(userId) {
  return `m-starter:workspace:${userId}`
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(/** @type {import('./authContext.js').Session | null} */ (null))

  const signIn = useCallback((data) => {
    const workspaces = Array.isArray(data.workspaces) ? data.workspaces : []
    let activeWorkspaceId = workspaces[0]?.id ?? null
    try {
      const stored = sessionStorage.getItem(workspaceStorageKey(data.user.id))
      if (stored && workspaces.some((w) => w.id === stored)) {
        activeWorkspaceId = stored
      }
    } catch {
      /* ignore */
    }
    if (
      data.activeWorkspaceId != null &&
      workspaces.some((w) => w.id === data.activeWorkspaceId)
    ) {
      activeWorkspaceId = data.activeWorkspaceId
    }
    setSession({
      user: data.user,
      accessToken: data.accessToken,
      workspaces,
      activeWorkspaceId,
    })
  }, [])

  const signOut = useCallback(() => {
    setSession(null)
  }, [])

  const setActiveWorkspace = useCallback((workspaceId) => {
    setSession((s) => {
      if (!s || !s.workspaces.some((w) => w.id === workspaceId)) return s
      try {
        sessionStorage.setItem(workspaceStorageKey(s.user.id), workspaceId)
      } catch {
        /* ignore */
      }
      return { ...s, activeWorkspaceId: workspaceId }
    })
  }, [])

  const activeWorkspace = useMemo(() => {
    if (session == null || session.activeWorkspaceId == null) return null
    return session.workspaces.find((w) => w.id === session.activeWorkspaceId) ?? null
  }, [session])

  const value = useMemo(
    () => ({ session, activeWorkspace, signIn, signOut, setActiveWorkspace }),
    [session, activeWorkspace, signIn, signOut, setActiveWorkspace],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
