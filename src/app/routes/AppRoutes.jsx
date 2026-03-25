import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { EmptyState } from '../../components/ui/EmptyState'
import { Login } from '../../features/auth/pages/Login'
import { Dashboard } from '../../features/dashboard/pages/Dashboard'
import { NewPrescription } from '../../features/prescriptions/pages/NewPrescription'
import { PrescriptionHistory } from '../../features/prescriptions/pages/PrescriptionHistory'
import { Settings } from '../../features/settings/pages/Settings'
import { ROUTES } from '../../lib/constants'
import { useAuth } from '../../features/auth/useAuth'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { getCurrentRoute, navigate, subscribeToRouteChange } from './router'

export function AppRoutes() {
  const [route, setRoute] = useState(getCurrentRoute)
  const { user } = useAuth()

  useEffect(() => {
    const syncRoute = () => setRoute(getCurrentRoute())
    syncRoute()
    return subscribeToRouteChange(syncRoute)
  }, [])

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate(user ? ROUTES.dashboard : ROUTES.login, { replace: true })
    }
  }, [user])

  const page = useMemo(() => {
    switch (route) {
      case ROUTES.login:
        return (
          <PublicRoute>
            <Login onSuccess={() => navigate(ROUTES.dashboard)} />
          </PublicRoute>
        )
      case ROUTES.dashboard:
        return (
          <ProtectedRoute>
            <Dashboard navigate={navigate} />
          </ProtectedRoute>
        )
      case ROUTES.newPrescription:
        return (
          <ProtectedRoute>
            <NewPrescription navigate={navigate} />
          </ProtectedRoute>
        )
      case ROUTES.history:
        return (
          <ProtectedRoute>
            <PrescriptionHistory navigate={navigate} />
          </ProtectedRoute>
        )
      case ROUTES.settings:
        return (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )
      default:
        return (
          <ProtectedRoute>
            <EmptyState
              title="Page not found"
              description="The route you requested does not exist yet."
              actionLabel="Back to dashboard"
              onAction={() => navigate(ROUTES.dashboard)}
            />
          </ProtectedRoute>
        )
    }
  }, [route])

  if (route === ROUTES.login) {
    return page
  }

  return <DashboardLayout navigate={navigate}>{page}</DashboardLayout>
}
