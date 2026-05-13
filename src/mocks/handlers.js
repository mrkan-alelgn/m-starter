import { http, HttpResponse } from 'msw'
import { getApiBaseUrl, getGoogleAuthUrl, getWorkspacesUrl } from '../api/config.js'
import { MOCK_WORKSPACES } from './workspaces.fixtures.js'
import {
  addInvite,
  getWorkspaceTeam,
  updateInviteRole,
  updateMemberRole,
} from './workspaceTeamStore.js'

function requireBearer(request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return null
  }
  return auth.slice('Bearer '.length)
}

const api = getApiBaseUrl()

/**
 * Mock handlers mirror `src/api` routes. When the backend is live, remove MSW
 * startup in `main.jsx` — the same API calls will hit your server.
 */
export const handlers = [
  http.post(getGoogleAuthUrl(), async ({ request }) => {
    await request.json().catch(() => ({}))

    return HttpResponse.json({
      accessToken: `mock_access_${crypto.randomUUID()}`,
      user: {
        id: 'mock-google-sub-8821',
        email: 'alex.doe@gmail.com',
        name: 'Alex Doe',
      },
      workspaces: MOCK_WORKSPACES,
    })
  }),

  http.get(getWorkspacesUrl(), ({ request }) => {
    if (!requireBearer(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({ workspaces: MOCK_WORKSPACES })
  }),

  http.get(`${api}/workspaces/:workspaceId/members`, ({ request, params }) => {
    if (!requireBearer(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { workspaceId } = params
    const team = getWorkspaceTeam(/** @type {string} */ (workspaceId))
    if (!team) {
      return HttpResponse.json({ message: 'Workspace not found' }, { status: 404 })
    }
    return HttpResponse.json({ members: team.members })
  }),

  http.get(`${api}/workspaces/:workspaceId/invites`, ({ request, params }) => {
    if (!requireBearer(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { workspaceId } = params
    const team = getWorkspaceTeam(/** @type {string} */ (workspaceId))
    if (!team) {
      return HttpResponse.json({ message: 'Workspace not found' }, { status: 404 })
    }
    return HttpResponse.json({ invites: team.invites })
  }),

  http.post(`${api}/workspaces/:workspaceId/invites`, async ({ request, params }) => {
    if (!requireBearer(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { workspaceId } = params
    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email : ''
    const role = body.role
    if (!email.trim() || !['admin', 'member', 'viewer'].includes(role)) {
      return HttpResponse.json({ message: 'Invalid email or role' }, { status: 400 })
    }
    const result = addInvite(/** @type {string} */ (workspaceId), email, role)
    if (!result.ok) {
      return HttpResponse.json({ message: result.message }, { status: result.status })
    }
    return HttpResponse.json({ invite: result.invite })
  }),

  http.patch(`${api}/workspaces/:workspaceId/members/:memberId`, async ({ request, params }) => {
    if (!requireBearer(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { workspaceId, memberId } = params
    const body = await request.json().catch(() => ({}))
    const role = body.role
    if (!['admin', 'member', 'viewer'].includes(role)) {
      return HttpResponse.json({ message: 'Invalid role' }, { status: 400 })
    }
    const result = updateMemberRole(
      /** @type {string} */ (workspaceId),
      /** @type {string} */ (memberId),
      role,
    )
    if (!result.ok) {
      return HttpResponse.json({ message: result.message }, { status: result.status })
    }
    return HttpResponse.json({ member: result.member })
  }),

  http.patch(`${api}/workspaces/:workspaceId/invites/:inviteId`, async ({ request, params }) => {
    if (!requireBearer(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { workspaceId, inviteId } = params
    const body = await request.json().catch(() => ({}))
    const role = body.role
    if (!['admin', 'member', 'viewer'].includes(role)) {
      return HttpResponse.json({ message: 'Invalid role' }, { status: 400 })
    }
    const result = updateInviteRole(
      /** @type {string} */ (workspaceId),
      /** @type {string} */ (inviteId),
      role,
    )
    if (!result.ok) {
      return HttpResponse.json({ message: result.message }, { status: result.status })
    }
    return HttpResponse.json({ invite: result.invite })
  }),
]
