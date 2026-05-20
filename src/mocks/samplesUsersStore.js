import { SAMPLES_USERS } from './samplesUsers.fixtures.js'

/** @typedef {import('../lib/samplesUsersParams.js').SamplesUsersQuery} SamplesUsersQuery */

/**
 * @param {SamplesUsersQuery} query
 */
export function querySamplesUsers(query) {
  let list = [...SAMPLES_USERS]

  if (query.q) {
    const lower = query.q.toLowerCase()
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.department.toLowerCase().includes(lower),
    )
  }

  if (query.status) {
    list = list.filter((u) => u.status === query.status)
  }

  if (query.role) {
    list = list.filter((u) => u.role === query.role)
  }

  const dir = query.order === 'desc' ? -1 : 1
  list.sort((a, b) => {
    const av = a[query.sort]
    const bv = b[query.sort]
    if (av === bv) return 0
    if (typeof av === 'string' && typeof bv === 'string') {
      return av.localeCompare(bv) * dir
    }
    return 0
  })

  const total = list.length
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize))
  const page = Math.min(query.page, totalPages)
  const start = (page - 1) * query.pageSize
  const items = list.slice(start, start + query.pageSize)

  return {
    items,
    total,
    page,
    pageSize: query.pageSize,
    totalPages,
    sort: query.sort,
    order: query.order,
  }
}
