import { getWorkspaceInvitesUrl, getWorkspaceMembersUrl } from './config.js'
import { AuthApiError } from './auth.js'

/** @typedef {'admin' | 'member' | 'viewer'} WorkspaceRole */

export const WORKSPACE_ROLES = /** @type {const} */ (['admin', 'member', 'viewer'])

/**
 * @typedef {Object} WorkspaceMember
 * @property {string} id
 * @property {string} userId
 * @property {string} email
 * @property {string} name
 * @property {WorkspaceRole} role
 */

/**
 * @typedef {Object} WorkspaceInvite
 * @property {string} id
 * @property {string} email
 * @property {WorkspaceRole} role
 * @property {string} createdAt
 */

/** @param {string} accessToken */
function authHeaders(accessToken) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

/** @param {string} accessToken */
function jsonAuthHeaders(accessToken) {
  return { ...authHeaders(accessToken), 'Content-Type': 'application/json' }
}

/**
 * @param {string} workspaceId
 * @param {string} accessToken
 * @returns {Promise<{ members: WorkspaceMember[] }>}
 */
export async function fetchWorkspaceMembers(workspaceId, accessToken) {
  const res = await fetch(getWorkspaceMembersUrl(workspaceId), {
    headers: authHeaders(accessToken),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new AuthApiError(res.status, typeof data?.message === 'string' ? data.message : res.statusText)
  }
  return /** @type {{ members: WorkspaceMember[] }} */ (data)
}

/**
 * @param {string} workspaceId
 * @param {string} accessToken
 * @returns {Promise<{ invites: WorkspaceInvite[] }>}
 */
export async function fetchWorkspaceInvites(workspaceId, accessToken) {
  const res = await fetch(getWorkspaceInvitesUrl(workspaceId), {
    headers: authHeaders(accessToken),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new AuthApiError(res.status, typeof data?.message === 'string' ? data.message : res.statusText)
  }
  return /** @type {{ invites: WorkspaceInvite[] }} */ (data)
}

/**
 * @param {string} workspaceId
 * @param {string} accessToken
 * @param {{ email: string; role: WorkspaceRole }} body
 */
export async function createWorkspaceInvite(workspaceId, accessToken, body) {
  const res = await fetch(getWorkspaceInvitesUrl(workspaceId), {
    method: 'POST',
    headers: jsonAuthHeaders(accessToken),
    body: JSON.stringify(body),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new AuthApiError(res.status, typeof data?.message === 'string' ? data.message : res.statusText)
  }
  return /** @type {{ invite: WorkspaceInvite }} */ (data)
}

/**
 * @param {string} workspaceId
 * @param {string} memberId
 * @param {string} accessToken
 * @param {{ role: WorkspaceRole }} body
 */
export async function updateWorkspaceMemberRole(workspaceId, memberId, accessToken, body) {
  const url = `${getWorkspaceMembersUrl(workspaceId)}/${encodeURIComponent(memberId)}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: jsonAuthHeaders(accessToken),
    body: JSON.stringify(body),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new AuthApiError(res.status, typeof data?.message === 'string' ? data.message : res.statusText)
  }
  return /** @type {{ member: WorkspaceMember }} */ (data)
}

/**
 * @param {string} workspaceId
 * @param {string} inviteId
 * @param {string} accessToken
 * @param {{ role: WorkspaceRole }} body
 */
export async function updateWorkspaceInviteRole(workspaceId, inviteId, accessToken, body) {
  const url = `${getWorkspaceInvitesUrl(workspaceId)}/${encodeURIComponent(inviteId)}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: jsonAuthHeaders(accessToken),
    body: JSON.stringify(body),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new AuthApiError(res.status, typeof data?.message === 'string' ? data.message : res.statusText)
  }
  return /** @type {{ invite: WorkspaceInvite }} */ (data)
}

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
