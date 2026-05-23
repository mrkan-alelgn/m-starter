import { apiUrl } from './config.js'

export class AuthApiError extends Error {
  /**
   * @param {number} status
   * @param {string} [message]
   * @param {unknown} [data]
   */
  constructor(status, message = 'Request failed', data = null) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
    this.data = data
  }
}

/**
 * One tiny wrapper around fetch. Point `VITE_API_BASE_URL` at a real backend and
 * keep endpoint files focused on paths, tokens, and request bodies.
 *
 * @template T
 * @param {string} path
 * @param {{
 *   method?: string
 *   accessToken?: string | null
 *   body?: unknown
 *   searchParams?: URLSearchParams | Record<string, string | number | boolean | null | undefined>
 *   headers?: HeadersInit
 *   signal?: AbortSignal
 * }} [options]
 * @returns {Promise<T>}
 */
export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    accessToken,
    body,
    searchParams,
    headers,
    signal,
  } = options

  const res = await fetch(withSearchParams(apiUrl(path), searchParams), {
    method,
    signal,
    headers: buildHeaders({ accessToken, body, headers }),
    body: body == null ? undefined : JSON.stringify(body),
  })
  const data = await parseJsonSafe(res)

  if (!res.ok) {
    throw new AuthApiError(res.status, getErrorMessage(data, res), data)
  }

  return /** @type {T} */ (data)
}

function buildHeaders({ accessToken, body, headers }) {
  return {
    Accept: 'application/json',
    ...(body == null ? null : { 'Content-Type': 'application/json' }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : null),
    ...headers,
  }
}

/** @param {unknown} data @param {Response} res */
function getErrorMessage(data, res) {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = data.message
    if (typeof message === 'string' && message.trim()) return message
  }
  return res.statusText || 'Request failed'
}

/** @param {Response} res */
async function parseJsonSafe(res) {
  if (res.status === 204) return null
  try {
    return await res.json()
  } catch {
    return null
  }
}

/**
 * @param {string} url
 * @param {URLSearchParams | Record<string, string | number | boolean | null | undefined> | undefined} searchParams
 */
function withSearchParams(url, searchParams) {
  if (searchParams == null) return url
  const params =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(
          Object.entries(searchParams)
            .filter(([, value]) => value != null)
            .map(([key, value]) => [key, String(value)]),
        )
  const query = params.toString()
  return query ? `${url}?${query}` : url
}
