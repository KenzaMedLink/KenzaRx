import { useEffect, useState } from 'react'
import { PrescriptionActions } from '../../../components/prescription/PrescriptionActions'
import { PrescriptionForm } from '../../../components/prescription/PrescriptionForm'
import { PrescriptionPreview } from '../../../components/prescription/PrescriptionPreview'
import { ReusePrescriptionModal } from '../../../components/prescription/ReusePrescriptionModal'
import { ROUTES } from '../../../lib/constants'
import { copyTextToClipboard } from '../../../lib/formatters'
import { validatePrescription } from '../../../lib/validators'
import { settingsService } from '../../settings/settingsService'
import { pdfService } from '../pdfService'
import { prescriptionService } from '../prescriptionService'
import { clonePrescription, initialPrescription } from '../prescriptionUtils'
import { useAuth } from '../../auth/useAuth'
import { logPrescriptionAction } from '../logService'

export function NewPrescription({ navigate }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState(initialPrescription)
  const [message, setMessage] = useState('')
  const [showReuse, setShowReuse] = useState(false)
  const [doctorProfile, setDoctorProfile] = useState(settingsService.getDoctorProfile())
  const [recentPrescriptions, setRecentPrescriptions] = useState([])
  const [currentPrescription, setCurrentPrescription] = useState(null)
  const isPdfLocked = doctorProfile.subscription_plan !== 'pro'

  useEffect(() => {
    let mounted = true

    async function loadPageData() {
      try {
        const [profile, recent] = await Promise.all([
          settingsService.fetchDoctorProfile(user),
          prescriptionService.getRecentPrescriptions(user.id, 8),
        ])

        if (mounted) {
          setDoctorProfile(profile)
          setRecentPrescriptions(recent)
        }
      } catch (error) {
        if (mounted) {
          notify(error.message)
        }
      }
    }

    const reused = window.localStorage.getItem('prescription-pro:reuse')
    if (reused) {
      try {
        setFormData(JSON.parse(reused))
      } finally {
        window.localStorage.removeItem('prescription-pro:reuse')
      }
    }

    if (user) {
      loadPageData()
    }

    const handleProfileUpdated = (event) => setDoctorProfile(event.detail)
    window.addEventListener('doctor-profile-updated', handleProfileUpdated)

    return () => {
      mounted = false
      window.removeEventListener('doctor-profile-updated', handleProfileUpdated)
    }
  }, [user])

  const notify = (text) => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2800)
  }

  const refreshRecent = async () => {
    if (!user) {
      return
    }

    try {
      const nextRecent = await prescriptionService.getRecentPrescriptions(user.id, 8)
      setRecentPrescriptions(nextRecent)
    } catch {}
  }

  const handleSave = async () => {
    const validationError = validatePrescription(formData)
    if (validationError) {
      notify(validationError)
      return
    }

    try {
      const saved = await prescriptionService.createPrescription(formData, user, doctorProfile)
      setCurrentPrescription(saved)
      await refreshRecent()
      notify(`Saved prescription for ${saved.patient_name || 'patient'}.`)
    } catch (error) {
      notify(error.message)
    }
  }

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(formData, doctorProfile)
      if (currentPrescription) {
        logPrescriptionAction({
          prescriptionId: currentPrescription.id,
          doctorId: user.id,
          action: 'copied',
          details: {
            length: currentPrescription.generated_text?.length || 0,
          },
        })
      }
      notify('Prescription text copied.')
    } catch (error) {
      notify(error.message)
    }
  }

  const handleExportPdf = () => {
    if (isPdfLocked) {
      notify('PDF export is a Pro feature.')
      return
    }

    try {
      pdfService.exportPrescriptionPdf(formData, doctorProfile)
      if (currentPrescription) {
        logPrescriptionAction({
          prescriptionId: currentPrescription.id,
          doctorId: user.id,
          action: 'exported_pdf',
          details: { format: 'pdf' },
        })
      }
    } catch (error) {
      notify(error.message)
    }
  }

  const handlePrint = () => {
    try {
      pdfService.printPrescription(formData, doctorProfile)
      if (currentPrescription) {
        logPrescriptionAction({
          prescriptionId: currentPrescription.id,
          doctorId: user.id,
          action: 'printed',
          details: { trigger: 'browser_print' },
        })
      }
    } catch (error) {
      notify(error.message)
    }
  }

  const handleClear = () => {
    setFormData(initialPrescription)
    setCurrentPrescription(null)
    notify('Form cleared.')
  }

  const handleReuse = (prescription) => {
    setFormData(clonePrescription(prescription))
    setCurrentPrescription(null)
    setShowReuse(false)
    logPrescriptionAction({
      prescriptionId: prescription.id,
      doctorId: user.id,
      action: 'reused',
      details: {
        source: 'reuse_modal',
      },
    })
    notify(`Loaded previous prescription for ${prescription.patient_name}.`)
  }

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="section-eyebrow">Prescription</p>
          <h2>Write once. Preview instantly.</h2>
          <p>
            Left side stays focused on data entry while the right side behaves like
            the final prescription.
          </p>
        </div>
        <div className="inline-actions">
          <button type="button" className="button button-secondary" onClick={() => setShowReuse(true)}>
            Reuse previous
          </button>
          <button type="button" className="button button-ghost" onClick={() => navigate(ROUTES.history)}>
            Open history
          </button>
        </div>
      </section>

      {message ? <div className="toast-message">{message}</div> : null}

      <section className="prescription-workspace">
        <div className="workspace-column">
          <PrescriptionForm
            formData={formData}
            setFormData={setFormData}
            doctorProfile={doctorProfile}
            onSave={handleSave}
            onGeneratePdf={handleExportPdf}
          />
          <PrescriptionActions
            onSave={handleSave}
            onCopy={handleCopy}
            onExportPdf={handleExportPdf}
            onPrint={handlePrint}
            onClear={handleClear}
            isPdfLocked={isPdfLocked}
          />
        </div>
        <div className="workspace-column sticky-column">
          <PrescriptionPreview formData={formData} doctorProfile={doctorProfile} />
        </div>
      </section>

      <ReusePrescriptionModal
        open={showReuse}
        prescriptions={doctorProfile.subscription_plan === 'pro' ? recentPrescriptions : []}
        onClose={() => setShowReuse(false)}
        onReuse={handleReuse}
      />
    </div>
  )
}
