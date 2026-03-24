import { useEffect, useState } from 'react'
import { EmptyState } from '../../../components/ui/EmptyState'
import { prescriptionService } from '../../prescriptions/prescriptionService'
import { patientService } from '../../patients/patientService'
import { ROUTES } from '../../../lib/constants'
import { formatDateTime } from '../../../lib/formatters'
import { useAuth } from '../../auth/useAuth'

export function Dashboard({ navigate }) {
  const { user } = useAuth()
  const [stats, setStats] = useState({ todayCount: 0, totalCount: 0 })
  const [recentPatients, setRecentPatients] = useState([])
  const [recentPrescriptions, setRecentPrescriptions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      try {
        const [nextStats, nextPatients, nextPrescriptions] = await Promise.all([
          prescriptionService.getDashboardStats(user.id),
          patientService.getRecentPatients(user.id),
          prescriptionService.getRecentPrescriptions(user.id, 5),
        ])

        if (mounted) {
          setStats(nextStats)
          setRecentPatients(nextPatients)
          setRecentPrescriptions(nextPrescriptions)
          setError('')
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message)
        }
      }
    }

    if (user) {
      loadDashboard()
    }

    return () => {
      mounted = false
    }
  }, [user])

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="section-eyebrow">Dashboard</p>
          <h2>Useful, not noisy.</h2>
          <p>
            Everything important is visible in one scan, including today, total
            volume, and recent activity.
          </p>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={() => navigate(ROUTES.newPrescription)}
        >
          New prescription
        </button>
      </section>

      {error ? <div className="toast-message">{error}</div> : null}

      <section className="stats-grid">
        <article className="stat-card">
          <span>Prescriptions today</span>
          <strong>{stats.todayCount}</strong>
        </article>
        <article className="stat-card">
          <span>Total prescriptions</span>
          <strong>{stats.totalCount}</strong>
        </article>
        <article className="stat-card">
          <span>Recent patients</span>
          <strong>{recentPatients.length}</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-eyebrow">Last 5 prescriptions</p>
              <h3>Recent work</h3>
            </div>
          </div>
          {recentPrescriptions.length ? (
            <div className="list-stack">
              {recentPrescriptions.map((item) => (
                <div key={item.id} className="list-row">
                  <div>
                    <strong>{item.patient_name}</strong>
                    <p>{item.diagnosis || 'No diagnosis entered'}</p>
                  </div>
                  <span>{formatDateTime(item.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No prescriptions yet"
              description="Create the first prescription to start seeing activity here."
              actionLabel="Create prescription"
              onAction={() => navigate(ROUTES.newPrescription)}
            />
          )}
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-eyebrow">Patients</p>
              <h3>Recent patients</h3>
            </div>
          </div>
          {recentPatients.length ? (
            <div className="list-stack">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="list-row">
                  <div>
                    <strong>{patient.full_name}</strong>
                    <p>{patient.phone || 'No phone number saved'}</p>
                  </div>
                  <span>{patient.sex || 'N/A'}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No patients yet"
              description="Patients will appear here once prescriptions are saved."
            />
          )}
        </div>
      </section>
    </div>
  )
}
