import { API_ROUTES } from './config.js'
import { apiRequest } from './client.js'
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
  return apiRequest(API_ROUTES.samplesUsers, { accessToken, searchParams: params })
}

/**
 * @param {string} accessToken
 * @param {URLSearchParams} searchParams
 */
export function fetchSamplesUsersFromSearchParams(accessToken, searchParams) {
  const query = parseSamplesUsersSearchParams(searchParams)
  return fetchSamplesUsers(accessToken, query)
}
