import { useAuth } from '../../features/auth/useAuth'
import { ROUTES } from '../../lib/constants'
import { navigate } from './router'

export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    navigate(ROUTES.dashboard, { replace: true })
    return null
  }

  return children
}
