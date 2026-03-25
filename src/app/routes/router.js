import { ROUTES } from '../../lib/constants'

const ROUTE_CHANGE_EVENT = 'kenza:navigation'

function normalizePath(path) {
  if (!path || path === '/') {
    return ROUTES.dashboard
  }

  return path.startsWith('/') ? path : `/${path}`
}

export function getCurrentRoute() {
  return normalizePath(window.location.pathname)
}

export function navigate(path, { replace = false } = {}) {
  const nextPath = normalizePath(path)
  const currentPath = getCurrentRoute()

  if (currentPath === nextPath) {
    return
  }

  const method = replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', nextPath)
  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT))
}

export function subscribeToRouteChange(callback) {
  window.addEventListener('popstate', callback)
  window.addEventListener(ROUTE_CHANGE_EVENT, callback)

  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener(ROUTE_CHANGE_EVENT, callback)
  }
}
