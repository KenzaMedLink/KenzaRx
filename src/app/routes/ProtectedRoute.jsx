import { useAuth } from '../../features/auth/useAuth'
import { ROUTES } from '../../lib/constants'
import { navigate } from './router'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    navigate(ROUTES.login, { replace: true })
    return null
  }

  return children
}
