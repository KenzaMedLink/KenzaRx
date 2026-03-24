import { useAuth } from '../../features/auth/useAuth'
import { ROUTES } from '../../lib/constants'

export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    window.location.hash = ROUTES.dashboard
    return null
  }

  return children
}
