import { API_ROUTES } from './config.js'
import { apiRequest } from './client.js'

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} [picture]
 */

/**
 * @typedef {{ id: string; name: string; slug?: string }} Workspace
 */

/**
 * @typedef {Object} GoogleSignInResult
 * @property {AuthUser} user
 * @property {string} accessToken
 * @property {Workspace[]} [workspaces]
 */

/**
 * Completes Google sign-in on the server. With the real API, pass `idToken` from
 * Google Identity Services / OAuth redirect flow.
 *
 * @param {{ idToken?: string }} [body]
 * @returns {Promise<GoogleSignInResult>}
 */
export async function signInWithGoogle(body = {}) {
  return apiRequest(API_ROUTES.googleAuth, {
    method: 'POST',
    body,
  })
}
