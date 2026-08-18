import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
