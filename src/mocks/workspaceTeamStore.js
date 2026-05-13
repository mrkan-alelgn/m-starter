import { MOCK_WORKSPACES } from './workspaces.fixtures.js'

const OWNER = {
  userId: 'mock-google-sub-8821',
  email: 'alex.doe@gmail.com',
  name: 'Alex Doe',
}

function seed() {
  /** @type {Record<string, { members: MockMember[]; invites: MockInvite[] }>} */
  const next = {}
  for (const ws of MOCK_WORKSPACES) {
    next[ws.id] = { members: [], invites: [] }
  }

  next.ws_acme.members = [
    { id: 'mem_acme_1', ...OWNER, role: 'admin' },
    {
      id: 'mem_acme_2',
      userId: 'u_blake',
      email: 'blake@example.com',
      name: 'Blake Chen',
      role: 'member',
    },
  ]
  next.ws_acme.invites = [
    {
      id: 'inv_acme_1',
      email: 'new-hire@example.com',
      role: 'viewer',
      createdAt: new Date().toISOString(),
    },
  ]

  next.ws_personal.members = [{ id: 'mem_per_1', ...OWNER, role: 'admin' }]

  next.ws_side.members = [
    { id: 'mem_side_1', ...OWNER, role: 'admin' },
    {
      id: 'mem_side_2',
      userId: 'u_jules',
      email: 'jules@example.com',
      name: 'Jules Park',
      role: 'viewer',
    },
  ]
  next.ws_side.invites = []

  return next
}

/** @typedef {'admin' | 'member' | 'viewer'} WorkspaceRole */

/**
 * @typedef {Object} MockMember
 * @property {string} id
 * @property {string} userId
 * @property {string} email
 * @property {string} name
 * @property {WorkspaceRole} role
 */

/**
 * @typedef {Object} MockInvite
 * @property {string} id
 * @property {string} email
 * @property {WorkspaceRole} role
 * @property {string} createdAt
 */

let store = seed()

export function resetWorkspaceTeamStoreForTests() {
  store = seed()
}

/** @param {string} workspaceId */
export function getWorkspaceTeam(workspaceId) {
  const team = store[workspaceId]
  if (!team) return null
  return {
    members: team.members.map((m) => ({ ...m })),
    invites: team.invites.map((i) => ({ ...i })),
  }
}

/** @param {string} workspaceId */
export function addInvite(workspaceId, email, role) {
  const team = store[workspaceId]
  if (!team) return { ok: false, status: 404, message: 'Workspace not found' }
  const normalized = email.trim().toLowerCase()
  if (
    team.members.some((m) => m.email.toLowerCase() === normalized) ||
    team.invites.some((i) => i.email.toLowerCase() === normalized)
  ) {
    return { ok: false, status: 409, message: 'User already a member or invited' }
  }
  const invite = {
    id: `inv_${crypto.randomUUID()}`,
    email: normalized,
    role,
    createdAt: new Date().toISOString(),
  }
  team.invites.push(invite)
  return { ok: true, invite }
}

/** @param {string} workspaceId @param {string} memberId @param {WorkspaceRole} role */
export function updateMemberRole(workspaceId, memberId, role) {
  const team = store[workspaceId]
  if (!team) return { ok: false, status: 404, message: 'Workspace not found' }
  const m = team.members.find((x) => x.id === memberId)
  if (!m) return { ok: false, status: 404, message: 'Member not found' }
  m.role = role
  return { ok: true, member: { ...m } }
}

/** @param {string} workspaceId @param {string} inviteId @param {WorkspaceRole} role */
export function updateInviteRole(workspaceId, inviteId, role) {
  const team = store[workspaceId]
  if (!team) return { ok: false, status: 404, message: 'Workspace not found' }
  const inv = team.invites.find((x) => x.id === inviteId)
  if (!inv) return { ok: false, status: 404, message: 'Invite not found' }
  inv.role = role
  return { ok: true, invite: { ...inv } }
}
