import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchSamplesUsersFromSearchParams } from '../api/samplesUsers.js'
import {
  mergeSamplesUsersSearchParams,
  parseSamplesUsersSearchParams,
} from '../lib/samplesUsersParams.js'
import { useAuth } from './useAuth.js'

/**
 * Loads sample users from the mock API using URL search params as the source of truth.
 */
export function useSamplesUsers() {
  const { session } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(
    () => parseSamplesUsersSearchParams(searchParams),
    [searchParams],
  )

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const load = useCallback(async () => {
    if (session == null) {
      setData(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await fetchSamplesUsersFromSearchParams(
        session.accessToken,
        searchParams,
      )
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [session, searchParams])

  useEffect(() => {
    const t = window.setTimeout(() => {
      load()
    }, 0)
    return () => window.clearTimeout(t)
  }, [load])

  const updateParams = useCallback(
    /**
     * @param {Partial<import('../lib/samplesUsersParams.js').SamplesUsersQuery>} patch
     * @param {{ resetPage?: boolean }} [options]
     */
    (patch, options) => {
      setSearchParams(
        (current) => mergeSamplesUsersSearchParams(current, patch, options),
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const apiQueryString = searchParams.toString()

  return {
    params,
    data,
    loading,
    error,
    updateParams,
    apiQueryString,
  }
}
