import { API_ROUTES } from './config.js'
import { apiRequest } from './client.js'

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

/**
 * @param {string} workspaceId
 * @param {string} accessToken
 * @returns {Promise<{ members: WorkspaceMember[] }>}
 */
export async function fetchWorkspaceMembers(workspaceId, accessToken) {
  return apiRequest(API_ROUTES.workspaceMembers(workspaceId), { accessToken })
}

/**
 * @param {string} workspaceId
 * @param {string} accessToken
 * @returns {Promise<{ invites: WorkspaceInvite[] }>}
 */
export async function fetchWorkspaceInvites(workspaceId, accessToken) {
  return apiRequest(API_ROUTES.workspaceInvites(workspaceId), { accessToken })
}

/**
 * @param {string} workspaceId
 * @param {string} accessToken
 * @param {{ email: string; role: WorkspaceRole }} body
 */
export async function createWorkspaceInvite(workspaceId, accessToken, body) {
  return apiRequest(API_ROUTES.workspaceInvites(workspaceId), {
    method: 'POST',
    accessToken,
    body,
  })
}

/**
 * @param {string} workspaceId
 * @param {string} memberId
 * @param {string} accessToken
 * @param {{ role: WorkspaceRole }} body
 */
export async function updateWorkspaceMemberRole(workspaceId, memberId, accessToken, body) {
  return apiRequest(API_ROUTES.workspaceMember(workspaceId, memberId), {
    method: 'PATCH',
    accessToken,
    body,
  })
}

/**
 * @param {string} workspaceId
 * @param {string} inviteId
 * @param {string} accessToken
 * @param {{ role: WorkspaceRole }} body
 */
export async function updateWorkspaceInviteRole(workspaceId, inviteId, accessToken, body) {
  return apiRequest(API_ROUTES.workspaceInvite(workspaceId, inviteId), {
    method: 'PATCH',
    accessToken,
    body,
  })
}
