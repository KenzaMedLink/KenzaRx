import { formatDateTime, formatPrescriptionText } from '../../lib/formatters'

export function PrescriptionPreview({ formData, doctorProfile }) {
  return (
    <div className="panel preview-panel">
      <div className="preview-header">
        <div>
          <p className="section-eyebrow">Live preview</p>
          <h3>Prescription preview</h3>
        </div>
        <span>{formatDateTime(new Date().toISOString())}</span>
      </div>

      <article id="prescription-preview" className="preview-sheet">
        <div className="preview-brand">
          <div>
            <h2>{doctorProfile.clinic_name || 'Clinic name'}</h2>
            <p>{doctorProfile.clinic_address || 'Clinic address will appear here.'}</p>
            <p>{doctorProfile.phone || 'Clinic phone number'}</p>
          </div>
          {doctorProfile.logo_url ? (
            <img src={doctorProfile.logo_url} alt="Clinic logo" className="preview-logo" />
          ) : null}
        </div>

        <div className="preview-block">
          <strong>Patient</strong>
          <p>{formData.patient_name || 'Patient name'}</p>
          <p>
            {formData.age || '--'} years | {formData.sex || 'Sex'}
          </p>
          {formData.phone ? <p>{formData.phone}</p> : null}
        </div>

        <div className="preview-block">
          <strong>Diagnosis</strong>
          <p>{formData.diagnosis || 'Diagnosis not added yet.'}</p>
        </div>

        <div className="preview-block">
          <strong>Medication</strong>
          <ol className="preview-medications">
            {formData.medications.map((medication, index) => (
              <li key={`${index}-${medication.drug_name || 'med'}`}>
                <span>
                  {medication.drug_name || 'Drug name'} {medication.strength || ''}
                </span>
                <small>
                  {[medication.dosage, medication.frequency, medication.duration, medication.route]
                    .filter(Boolean)
                    .join(' | ') || 'Dose instructions will appear here.'}
                </small>
              </li>
            ))}
          </ol>
        </div>

        <div className="preview-block">
          <strong>Notes</strong>
          <p>{formData.notes || 'Advice and clinical notes will appear here.'}</p>
        </div>

        <div className="preview-footer">
          <div>
            <strong>{doctorProfile.full_name || 'Doctor name'}</strong>
            <p>{doctorProfile.qualification || 'Qualification'}</p>
          </div>
          {doctorProfile.signature_url ? (
            <img src={doctorProfile.signature_url} alt="Doctor signature" className="preview-signature" />
          ) : null}
        </div>
      </article>

      <div className="preview-plain-text">
        <div className="copy-card-header">
          <div>
            <p className="section-eyebrow">Copy-ready text</p>
            <h4>Polished plain-text output</h4>
          </div>
          <span className="copy-card-badge">Ready to copy</span>
        </div>

        <div className="copy-card-shell">
          <pre>{formatPrescriptionText(formData, doctorProfile)}</pre>
        </div>
      </div>
    </div>
  )
}
