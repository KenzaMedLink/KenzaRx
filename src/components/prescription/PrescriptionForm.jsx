import { MedicationRow } from './MedicationRow'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

export function PrescriptionForm({ formData, setFormData, doctorProfile, onSave, onGeneratePdf }) {
  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const updateMedication = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      medications: current.medications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addMedication = () => {
    setFormData((current) => ({
      ...current,
      medications: [
        ...current.medications,
        {
          drug_name: '',
          strength: '',
          dosage: '',
          frequency: '',
          duration: '',
          route: '',
        },
      ],
    }))
  }

  const removeMedication = (index) => {
    setFormData((current) => ({
      ...current,
      medications: current.medications.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <p className="section-eyebrow">New prescription</p>
          <h3>Create prescription</h3>
        </div>
        <div className="inline-actions">
          <Button variant="secondary" onClick={onSave}>
            Save draft
          </Button>
          <Button variant="ghost" onClick={onGeneratePdf}>
            PDF
          </Button>
        </div>
      </div>

      <section className="form-section">
        <div className="section-title">
          <h4>Patient</h4>
          <span>Essential patient details only.</span>
        </div>
        <div className="form-grid">
          <Input
            label="Patient name"
            value={formData.patient_name}
            onChange={(event) => updateField('patient_name', event.target.value)}
            placeholder="Jane Doe"
          />
          <Input
            label="Age"
            value={formData.age}
            onChange={(event) => updateField('age', event.target.value)}
            placeholder="36"
          />
          <Select
            label="Sex"
            value={formData.sex}
            onChange={(event) => updateField('sex', event.target.value)}
            options={[
              { label: 'Select sex', value: '' },
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
            ]}
          />
          <Input
            label="Phone number"
            value={formData.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="Optional"
          />
        </div>
      </section>

      <section className="form-section">
        <div className="section-title">
          <h4>Clinical</h4>
          <span>Diagnosis and short notes.</span>
        </div>
        <div className="form-grid single-column">
          <Input
            label="Diagnosis"
            value={formData.diagnosis}
            onChange={(event) => updateField('diagnosis', event.target.value)}
            placeholder="Acute upper respiratory tract infection"
          />
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Hydration, rest, and review in 5 days if symptoms persist."
          />
        </div>
      </section>

      <section className="form-section">
        <div className="section-title">
          <h4>Medication</h4>
          <span>Dynamic rows keep the form lean.</span>
        </div>
        <div className="stack">
          {formData.medications.map((medication, index) => (
            <MedicationRow
              key={`${index}-${medication.drug_name}`}
              index={index}
              medication={medication}
              onChange={updateMedication}
              onRemove={removeMedication}
              canRemove={formData.medications.length > 1}
            />
          ))}
          <Button variant="secondary" onClick={addMedication}>
            Add medication
          </Button>
        </div>
      </section>

      <section className="form-section doctor-summary">
        <div className="section-title">
          <h4>Doctor</h4>
          <span>Auto-filled from settings.</span>
        </div>
        <div className="doctor-meta">
          <span>{doctorProfile.full_name || 'Doctor name'}</span>
          <span>{doctorProfile.qualification || 'Qualification'}</span>
          <span>{doctorProfile.clinic_name || 'Clinic name'}</span>
        </div>
      </section>
    </div>
  )
}
