/**
 * API base URL with no trailing slash.
 * Set `VITE_API_BASE_URL` to your backend origin or path prefix when moving off mocks.
 *
 * @example "/api" — default, same-origin
 * @example "https://api.myproduct.com/v1" — production
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL
  const trimmed = raw != null ? String(raw).trim() : ''
  if (trimmed !== '') return trimmed.replace(/\/$/, '')
  return '/api'
}

/** POST target for exchanging a Google credential for session tokens. */
export const GOOGLE_AUTH_PATH = '/auth/google'

/** GET list of workspaces for the authenticated user. */
export const WORKSPACES_PATH = '/workspaces'

/** GET paginated sample users for TanStack table demos (query params). */
export const SAMPLES_USERS_PATH = '/samples/users'

/** Full URL or path used by `fetch` and MSW handlers. */
export function getGoogleAuthUrl() {
  return joinApiUrl(GOOGLE_AUTH_PATH)
}

/** @param {string} path */
function joinApiUrl(path) {
  const base = getApiBaseUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return `${base}${normalized}`
  }
  return `${base}${normalized}`
}

export function getWorkspacesUrl() {
  return joinApiUrl(WORKSPACES_PATH)
}

/** @param {string} workspaceId */
export function getWorkspaceMembersUrl(workspaceId) {
  return joinApiUrl(`/workspaces/${encodeURIComponent(workspaceId)}/members`)
}

/** @param {string} workspaceId */
export function getWorkspaceInvitesUrl(workspaceId) {
  return joinApiUrl(`/workspaces/${encodeURIComponent(workspaceId)}/invites`)
}

export function getSamplesUsersUrl() {
  return joinApiUrl(SAMPLES_USERS_PATH)
}
