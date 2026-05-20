/** @typedef {'name' | 'email' | 'department' | 'status' | 'role' | 'createdAt'} SamplesUsersSort */

/**
 * @typedef {Object} SamplesUsersQuery
 * @property {string} q
 * @property {SamplesUsersSort} sort
 * @property {'asc' | 'desc'} order
 * @property {number} page
 * @property {number} pageSize
 * @property {string} status
 * @property {string} role
 */

export const SAMPLES_USERS_SORT_FIELDS = /** @type {const} */ ([
  'name',
  'email',
  'department',
  'status',
  'role',
  'createdAt',
])

export const SAMPLES_USERS_PAGE_SIZES = /** @type {const} */ ([5, 10, 25, 50])

const DEFAULTS = /** @type {SamplesUsersQuery} */ ({
  q: '',
  sort: 'name',
  order: 'asc',
  page: 1,
  pageSize: 10,
  status: '',
  role: '',
})

/**
 * @param {URLSearchParams} searchParams
 * @returns {SamplesUsersQuery}
 */
export function parseSamplesUsersSearchParams(searchParams) {
  const sort = searchParams.get('sort') ?? DEFAULTS.sort
  const order = searchParams.get('order') === 'desc' ? 'desc' : 'asc'
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const rawSize = Number.parseInt(searchParams.get('pageSize') ?? String(DEFAULTS.pageSize), 10)
  const pageSize = SAMPLES_USERS_PAGE_SIZES.includes(/** @type {typeof SAMPLES_USERS_PAGE_SIZES[number]} */ (rawSize))
    ? rawSize
    : DEFAULTS.pageSize
  const q = (searchParams.get('q') ?? '').trim()
  const status = searchParams.get('status') ?? ''
  const role = searchParams.get('role') ?? ''

  return {
    q,
    sort: SAMPLES_USERS_SORT_FIELDS.includes(/** @type {SamplesUsersSort} */ (sort))
      ? /** @type {SamplesUsersSort} */ (sort)
      : DEFAULTS.sort,
    order,
    page,
    pageSize,
    status: ['active', 'inactive', 'pending'].includes(status) ? status : '',
    role: ['admin', 'member', 'viewer'].includes(role) ? role : '',
  }
}

/**
 * @param {SamplesUsersQuery} query
 * @returns {URLSearchParams}
 */
export function samplesUsersQueryToSearchParams(query) {
  const params = new URLSearchParams()
  if (query.q) params.set('q', query.q)
  params.set('sort', query.sort)
  params.set('order', query.order)
  params.set('page', String(query.page))
  params.set('pageSize', String(query.pageSize))
  if (query.status) params.set('status', query.status)
  if (query.role) params.set('role', query.role)
  return params
}

/**
 * @param {URLSearchParams} current
 * @param {Partial<SamplesUsersQuery>} patch
 * @param {{ resetPage?: boolean }} [options]
 */
export function mergeSamplesUsersSearchParams(current, patch, options = {}) {
  const merged = {
    ...parseSamplesUsersSearchParams(current),
    ...patch,
  }
  if (options.resetPage !== false && !('page' in patch)) {
    merged.page = 1
  }
  return samplesUsersQueryToSearchParams(merged)
}
