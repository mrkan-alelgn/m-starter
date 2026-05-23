export const API_ROUTES = {
  googleAuth: '/auth/google',
  workspaces: '/workspaces',
  samplesUsers: '/samples/users',
  workspaceMembers: (workspaceId) =>
    `/workspaces/${encodeURIComponent(workspaceId)}/members`,
  workspaceMember: (workspaceId, memberId) =>
    `/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(memberId)}`,
  workspaceInvites: (workspaceId) =>
    `/workspaces/${encodeURIComponent(workspaceId)}/invites`,
  workspaceInvite: (workspaceId, inviteId) =>
    `/workspaces/${encodeURIComponent(workspaceId)}/invites/${encodeURIComponent(inviteId)}`,
}

/**
 * Set `VITE_API_BASE_URL` to your backend origin or path prefix.
 *
 * Examples:
 * - `/api` for same-origin deployments
 * - `https://api.myproduct.com/v1` for a hosted API
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL
  const trimmed = raw != null ? String(raw).trim() : ''
  return (trimmed || '/api').replace(/\/$/, '')
}

/** @param {string} path */
export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalizedPath}`
}
