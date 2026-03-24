import { Modal } from '../ui/Modal'
import { formatDateTime } from '../../lib/formatters'

export function ReusePrescriptionModal({ open, prescriptions, onClose, onReuse }) {
  return (
    <Modal open={open} onClose={onClose} title="Reuse previous prescription">
      <div className="reuse-list">
        {prescriptions.length ? (
          prescriptions.map((item) => (
            <button
              type="button"
              key={item.id}
              className="reuse-item"
              onClick={() => onReuse(item)}
            >
              <strong>{item.patient_name}</strong>
              <span>{item.diagnosis || 'No diagnosis entered'}</span>
              <small>{formatDateTime(item.created_at)}</small>
            </button>
          ))
        ) : (
          <p className="muted">No reusable prescriptions found yet.</p>
        )}
      </div>
    </Modal>
  )
}
