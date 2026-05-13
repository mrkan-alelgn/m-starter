import { getGoogleAuthUrl } from './config.js'

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

export class AuthApiError extends Error {
  /** @param {number} status */
  constructor(status, message = 'Request failed') {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

/**
 * Completes Google sign-in on the server. With the real API, pass `idToken` from
 * Google Identity Services / OAuth redirect flow.
 *
 * @param {{ idToken?: string }} [body]
 * @returns {Promise<GoogleSignInResult>}
 */
export async function signInWithGoogle(body = {}) {
  const res = await fetch(getGoogleAuthUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await parseJsonSafe(res)

  if (!res.ok) {
    const message =
      typeof data?.message === 'string' ? data.message : res.statusText || 'Sign-in failed'
    throw new AuthApiError(res.status, message)
  }

  return /** @type {GoogleSignInResult} */ (data)
}

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
