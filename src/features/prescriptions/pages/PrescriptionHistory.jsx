import { useEffect, useMemo, useState } from 'react'
import { PatientHistoryCard } from '../../../components/patient/PatientHistoryCard'
import { PatientSearchBox } from '../../../components/patient/PatientSearchBox'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Modal } from '../../../components/ui/Modal'
import { ROUTES } from '../../../lib/constants'
import { formatPrescriptionText } from '../../../lib/formatters'
import { settingsService } from '../../settings/settingsService'
import { prescriptionService } from '../prescriptionService'
import { clonePrescription } from '../prescriptionUtils'
import { useAuth } from '../../auth/useAuth'
import { logPrescriptionAction } from '../logService'

export function PrescriptionHistory({ navigate }) {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [selected, setSelected] = useState(null)
  const [doctorProfile, setDoctorProfile] = useState(settingsService.getDoctorProfile())
  const [prescriptions, setPrescriptions] = useState([])
  const [message, setMessage] = useState('')

  const modalText = useMemo(
    () => (selected ? formatPrescriptionText(selected, doctorProfile) : ''),
    [doctorProfile, selected],
  )

  useEffect(() => {
    let mounted = true

    async function loadHistory() {
      try {
        const [profile, items] = await Promise.all([
          settingsService.fetchDoctorProfile(user),
          prescriptionService.getPrescriptions({
            doctorId: user.id,
            search,
            date,
          }),
        ])

        if (mounted) {
          setDoctorProfile(profile)
          setPrescriptions(items)
          setMessage('')
        }
      } catch (error) {
        if (mounted) {
          setMessage(error.message)
        }
      }
    }

    if (user) {
      loadHistory()
    }

    return () => {
      mounted = false
    }
  }, [date, search, user])

  useEffect(() => {
    if (!selected || !user) {
      return
    }

    logPrescriptionAction({
      prescriptionId: selected.id,
      doctorId: user.id,
      action: 'viewed',
      details: {
        source: 'history_modal',
      },
    })
  }, [selected, user])

  const handleReuse = (prescription) => {
    window.localStorage.setItem('prescription-pro:reuse', JSON.stringify(clonePrescription(prescription)))
    logPrescriptionAction({
      prescriptionId: prescription.id,
      doctorId: user.id,
      action: 'reused',
      details: {
        source: 'history_page',
      },
    })
    navigate(ROUTES.newPrescription)
  }

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="section-eyebrow">History</p>
          <h2>Find and reuse previous prescriptions.</h2>
          <p>
            Search by patient, narrow by date, and reopen good templates instead of
            typing from zero.
          </p>
        </div>
      </section>

      {message ? <div className="toast-message">{message}</div> : null}

      <section className="filter-bar panel">
        <PatientSearchBox value={search} onChange={setSearch} />
        <label className="field">
          <span>Filter by date</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </section>

      {doctorProfile.subscription_plan !== 'pro' ? (
        <div className="plan-banner">
          Free plan shows only your most recent saved history and keeps reuse locked.
        </div>
      ) : null}

      <section className="history-grid">
        {prescriptions.length ? (
          prescriptions.map((prescription) => (
            <PatientHistoryCard
              key={prescription.id}
              prescription={prescription}
              onView={setSelected}
              onReuse={handleReuse}
              canReuse={doctorProfile.subscription_plan === 'pro'}
            />
          ))
        ) : (
          <EmptyState
            title="No matching prescriptions"
            description="Try a different patient name or date, or create a new prescription first."
            actionLabel="New prescription"
            onAction={() => navigate(ROUTES.newPrescription)}
          />
        )}
      </section>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Prescription details">
        {selected ? <pre className="history-modal-text">{modalText}</pre> : null}
      </Modal>
    </div>
  )
}
