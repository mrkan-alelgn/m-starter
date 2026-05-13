import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export function ProtectedRoute({ children }) {
  const { session } = useAuth()
  const location = useLocation()

  if (session == null) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return children
}
