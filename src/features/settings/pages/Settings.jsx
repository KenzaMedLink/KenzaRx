import { useEffect, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { settingsService } from '../settingsService'
import { useAuth } from '../../auth/useAuth'

export function Settings() {
  const { user } = useAuth()
  const [form, setForm] = useState(settingsService.getDoctorProfile())
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const profile = await settingsService.fetchDoctorProfile(user)
        if (mounted) {
          setForm(profile)
          setLoading(false)
        }
      } catch {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    if (user) {
      loadProfile()
    }

    return () => {
      mounted = false
    }
  }, [user])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleFile = async (field, file) => {
    const url = await settingsService.convertFileToUrl(file)
    updateField(field, url)
  }

  const handleSave = async () => {
    try {
      await settingsService.saveDoctorProfile(form, user)
      setMessage('Settings saved.')
    } catch (error) {
      setMessage(error.message)
    }

    window.setTimeout(() => setMessage(''), 2500)
  }

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="section-eyebrow">Settings</p>
          <h2>Doctor and clinic details</h2>
          <p>Everything here feeds the prescription header, footer, and premium branding controls.</p>
        </div>
      </section>

      {message ? <div className="toast-message">{message}</div> : null}

      <section className="panel settings-panel">
        {loading ? <p className="muted">Loading profile...</p> : null}

        <div className="form-grid">
          <Input
            label="Doctor full name"
            value={form.full_name}
            onChange={(event) => updateField('full_name', event.target.value)}
          />
          <Input
            label="Qualification"
            value={form.qualification}
            onChange={(event) => updateField('qualification', event.target.value)}
          />
          <Input
            label="Clinic name"
            value={form.clinic_name}
            onChange={(event) => updateField('clinic_name', event.target.value)}
          />
          <Input
            label="Clinic address"
            value={form.clinic_address}
            onChange={(event) => updateField('clinic_address', event.target.value)}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
          <Select
            label="Subscription plan"
            value={form.subscription_plan}
            onChange={(event) => updateField('subscription_plan', event.target.value)}
            options={[
              { label: 'Free', value: 'free' },
              { label: 'Pro', value: 'pro' },
            ]}
          />
          <label className="field">
            <span>Signature upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleFile('signature_url', event.target.files?.[0])}
            />
          </label>
          <label className="field">
            <span>Logo upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleFile('logo_url', event.target.files?.[0])}
            />
          </label>
        </div>

        <Button onClick={handleSave}>Save settings</Button>
      </section>
    </div>
  )
}
