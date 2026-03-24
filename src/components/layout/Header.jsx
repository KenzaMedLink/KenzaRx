import { useEffect, useState } from 'react'
import { useAuth } from '../../features/auth/useAuth'
import { ROUTES } from '../../lib/constants'
import { settingsService } from '../../features/settings/settingsService'

export function Header({ navigate }) {
  const { logout, user } = useAuth()
  const [doctorProfile, setDoctorProfile] = useState(settingsService.getDoctorProfile())

  useEffect(() => {
    let mounted = true

    if (user) {
      settingsService
        .fetchDoctorProfile(user)
        .then((profile) => {
          if (mounted) {
            setDoctorProfile(profile)
          }
        })
        .catch(() => {})
    }

    const handleProfileUpdated = (event) => {
      setDoctorProfile(event.detail)
    }

    window.addEventListener('doctor-profile-updated', handleProfileUpdated)

    return () => {
      mounted = false
      window.removeEventListener('doctor-profile-updated', handleProfileUpdated)
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.login)
  }

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <h2 className="topbar-title">Kenza Rx</h2>
      </div>

      <div className="topbar-actions">
        <div className="user-chip">
          <strong>{doctorProfile.full_name || user?.email || 'Doctor'}</strong>
          <span>{doctorProfile.subscription_plan === 'pro' ? 'Pro plan' : 'Free plan'}</span>
        </div>
        <button type="button" className="ghost-button" onClick={() => navigate(ROUTES.settings)}>
          Settings
        </button>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
