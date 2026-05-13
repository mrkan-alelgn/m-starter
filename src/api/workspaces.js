import { getWorkspacesUrl } from './config.js'
import { AuthApiError } from './auth.js'

/**
 * @typedef {{ id: string; name: string; slug?: string }} Workspace
 */

/**
 * @param {string} accessToken
 * @returns {Promise<{ workspaces: Workspace[] }>}
 */
export async function fetchWorkspaces(accessToken) {
  const res = await fetch(getWorkspacesUrl(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await parseJsonSafe(res)

  if (!res.ok) {
    const message =
      typeof data?.message === 'string' ? data.message : res.statusText || 'Failed to load workspaces'
    throw new AuthApiError(res.status, message)
  }

  return /** @type {{ workspaces: Workspace[] }} */ (data)
}

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
