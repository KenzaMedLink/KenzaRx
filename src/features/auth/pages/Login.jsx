import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useAuth } from '../useAuth'

export function Login({ onSuccess }) {
  const { login, loading } = useAuth()
  const [credentials, setCredentials] = useState({
    email: 'doctor@kenzarx.app',
    password: 'password123',
  })
  const [error, setError] = useState('')

  const updateField = (field, value) => {
    setCredentials((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(credentials)
      onSuccess()
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="section-eyebrow">System</p>
        <h1 className="brand-hero-title">Kenza Rx</h1>
        <h2 className="brand-hero-subtitle">Write prescriptions with speed and trust.</h2>
        <p>
          Doctors get a focused workspace for live preview, quick saving, and a
          strong upgrade path for PDF export and patient history.
        </p>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div>
          <p className="section-eyebrow">Doctor login</p>
          <h2>Welcome back</h2>
        </div>
        <Input
          label="Email"
          type="email"
          value={credentials.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(event) => updateField('password', event.target.value)}
        />
        {error ? <p className="error-text">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}
