import { useAuth } from '../../features/auth/useAuth'
import { ROUTES } from '../../lib/constants'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    window.location.hash = ROUTES.login
    return null
  }

  return children
}
