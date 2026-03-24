export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  newPrescription: '/prescriptions/new',
  history: '/prescriptions/history',
  settings: '/settings',
}

export const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: ROUTES.dashboard },
  { label: 'New Prescription', path: ROUTES.newPrescription },
  { label: 'History', path: ROUTES.history, badge: 'Pro reuse' },
  { label: 'Settings', path: ROUTES.settings },
]

export const LOCAL_STORAGE_KEYS = {
  user: 'prescription-pro:user',
  prescriptions: 'prescription-pro:prescriptions',
  patients: 'prescription-pro:patients',
  settings: 'prescription-pro:settings',
}

export const PLAN_LIMITS = {
  freeMonthlyPrescriptions: 20,
  freeHistoryVisible: 5,
}
