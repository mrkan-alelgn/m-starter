import { API_ROUTES } from './config.js'
import { apiRequest } from './client.js'

/**
 * @typedef {{ id: string; name: string; slug?: string }} Workspace
 */

/**
 * @param {string} accessToken
 * @returns {Promise<{ workspaces: Workspace[] }>}
 */
export async function fetchWorkspaces(accessToken) {
  return apiRequest(API_ROUTES.workspaces, { accessToken })
}
