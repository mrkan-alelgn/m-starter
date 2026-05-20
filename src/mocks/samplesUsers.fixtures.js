/** @typedef {'active' | 'inactive' | 'pending'} SampleUserStatus */
/** @typedef {'admin' | 'member' | 'viewer'} SampleUserRole */

/**
 * @typedef {Object} SampleUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} department
 * @property {SampleUserStatus} status
 * @property {SampleUserRole} role
 * @property {string} createdAt ISO date
 */

const DEPARTMENTS = ['Engineering', 'Design', 'Sales', 'Support', 'Marketing', 'Finance']
const STATUSES = /** @type {const} */ (['active', 'inactive', 'pending'])
const ROLES = /** @type {const} */ (['admin', 'member', 'viewer'])

const FIRST = [
  'Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Jamie',
]
const LAST = [
  'Chen', 'Patel', 'Nguyen', 'Garcia', 'Kim', 'Brown', 'Lee', 'Martinez', 'Wilson', 'Davis',
]

/** @type {SampleUser[]} */
export const SAMPLES_USERS = Array.from({ length: 48 }, (_, i) => {
  const first = FIRST[i % FIRST.length]
  const last = LAST[(i * 3) % LAST.length]
  const name = `${first} ${last}`
  const slug = name.toLowerCase().replace(/\s+/g, '.')
  const department = DEPARTMENTS[i % DEPARTMENTS.length]
  const status = STATUSES[i % STATUSES.length]
  const role = ROLES[i % ROLES.length]
  const day = String((i % 28) + 1).padStart(2, '0')
  const month = String((i % 12) + 1).padStart(2, '0')
  return {
    id: `sample-user-${i + 1}`,
    name,
    email: `${slug}@example.com`,
    department,
    status,
    role,
    createdAt: `2024-${month}-${day}T12:00:00.000Z`,
  }
})
