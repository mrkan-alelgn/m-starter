import { useCallback, useEffect, useState } from 'react'
import { AuthApiError } from '../api/client.js'
import { fetchWorkspaceInvites, fetchWorkspaceMembers } from '../api/workspaceTeam.js'

/**
 * @param {string | null | undefined} workspaceId
 * @param {string | null | undefined} accessToken
 */
export function useWorkspaceTeam(workspaceId, accessToken) {
  const [members, setMembers] = useState(/** @type {unknown[] | null} */ (null))
  const [invites, setInvites] = useState(/** @type {unknown[] | null} */ (null))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const load = useCallback(async () => {
    if (!workspaceId || !accessToken) {
      setMembers(null)
      setInvites(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [mRes, iRes] = await Promise.all([
        fetchWorkspaceMembers(workspaceId, accessToken),
        fetchWorkspaceInvites(workspaceId, accessToken),
      ])
      setMembers(mRes.members)
      setInvites(iRes.invites)
    } catch (e) {
      setError(e instanceof AuthApiError ? e.message : e instanceof Error ? e.message : 'Failed to load team')
      setMembers([])
      setInvites([])
    } finally {
      setLoading(false)
    }
  }, [workspaceId, accessToken])

  useEffect(() => {
    const t = window.setTimeout(() => {
      load()
    }, 0)
    return () => window.clearTimeout(t)
  }, [load])

  return { members, invites, loading, error, refresh: load }
}
