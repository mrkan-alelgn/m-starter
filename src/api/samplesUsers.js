import { getSamplesUsersUrl } from './config.js'
import { AuthApiError } from './auth.js'
import {
  parseSamplesUsersSearchParams,
  samplesUsersQueryToSearchParams,
} from '../lib/samplesUsersParams.js'

/** @typedef {import('../lib/samplesUsersParams.js').SamplesUsersQuery} SamplesUsersQuery */

/**
 * @typedef {import('../mocks/samplesUsers.fixtures.js').SampleUser} SampleUser
 */

/**
 * @typedef {Object} SamplesUsersResponse
 * @property {SampleUser[]} items
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 * @property {number} totalPages
 * @property {string} sort
 * @property {'asc' | 'desc'} order
 */

/** @param {string} accessToken */
function authHeaders(accessToken) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

/**
 * @param {string} accessToken
 * @param {SamplesUsersQuery | URLSearchParams} query
 * @returns {Promise<SamplesUsersResponse>}
 */
export async function fetchSamplesUsers(accessToken, query) {
  const params =
    query instanceof URLSearchParams
      ? query
      : samplesUsersQueryToSearchParams(query)
  const url = `${getSamplesUsersUrl()}?${params.toString()}`
  const res = await fetch(url, { headers: authHeaders(accessToken) })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new AuthApiError(
      res.status,
      typeof data?.message === 'string' ? data.message : res.statusText,
    )
  }
  return /** @type {SamplesUsersResponse} */ (data)
}

/**
 * @param {string} accessToken
 * @param {URLSearchParams} searchParams
 */
export function fetchSamplesUsersFromSearchParams(accessToken, searchParams) {
  const query = parseSamplesUsersSearchParams(searchParams)
  return fetchSamplesUsers(accessToken, query)
}

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
