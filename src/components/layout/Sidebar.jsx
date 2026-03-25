import { ROUTES, SIDEBAR_LINKS } from '../../lib/constants'
import { getCurrentRoute } from '../../app/routes/router'

export function Sidebar({ navigate }) {
  const current = getCurrentRoute() || ROUTES.dashboard

  return (
    <aside className="sidebar">
      <div>
        <h1 className="sidebar-title brand-title">Kenza Rx</h1>
        <p className="sidebar-subtitle">Prescription workspace</p>
        <p className="sidebar-copy">
          Write, preview, save, and reuse prescriptions without fighting the UI.
        </p>
      </div>

      <nav className="sidebar-nav">
        {SIDEBAR_LINKS.map((link) => (
          <button
            key={link.path}
            type="button"
            className={`sidebar-link ${current === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            <span>{link.label}</span>
            {link.badge ? <small>{link.badge}</small> : null}
          </button>
        ))}
      </nav>

      <div className="sidebar-card">
        <strong>Fast path</strong>
        <p>Keep the left side for writing and the right side for confidence.</p>
        <button
          type="button"
          className="ghost-button"
          onClick={() => navigate(ROUTES.newPrescription)}
        >
          New prescription
        </button>
      </div>
    </aside>
  )
}
