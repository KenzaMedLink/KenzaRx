import { createContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../../features/auth/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    authService.getCurrentUser().then((nextUser) => {
      if (mounted) {
        setUser(nextUser)
        setLoading(false)
      }
    })

    const unsubscribe = authService.onAuthStateChange((nextUser) => {
      if (mounted) {
        setUser(nextUser)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: async (credentials) => {
        setLoading(true)
        try {
          const nextUser = await authService.login(credentials)
          setUser(nextUser)
          return nextUser
        } finally {
          setLoading(false)
        }
      },
      logout: async () => {
        await authService.logout()
        setUser(null)
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
