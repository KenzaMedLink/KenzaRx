import { formatDateTime } from '../../lib/formatters'

export function PatientHistoryCard({ prescription, onView, onReuse, canReuse }) {
  return (
    <article className="history-card">
      <div className="history-card-top">
        <div>
          <h4>{prescription.patient_name}</h4>
          <p>{prescription.diagnosis || 'No diagnosis entered'}</p>
        </div>
        <small>{formatDateTime(prescription.created_at)}</small>
      </div>

      <div className="history-meta">
        <span>{prescription.medications.length} medication(s)</span>
        <span>{prescription.sex || 'Sex n/a'}</span>
        <span>{prescription.age || '--'} yrs</span>
      </div>

      <div className="history-actions">
        <button type="button" className="text-button" onClick={() => onView(prescription)}>
          View
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => onReuse(prescription)}
          disabled={!canReuse}
        >
          {canReuse ? 'Reuse' : 'Pro only'}
        </button>
      </div>
    </article>
  )
}
