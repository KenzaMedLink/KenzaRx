import { Input } from '../ui/Input'

export function MedicationRow({ index, medication, onChange, onRemove, canRemove }) {
  return (
    <div className="medication-row">
      <div className="medication-row-header">
        <strong>Medication {index + 1}</strong>
        {canRemove ? (
          <button type="button" className="text-button danger" onClick={() => onRemove(index)}>
            Remove
          </button>
        ) : null}
      </div>

      <div className="form-grid">
        <Input
          label="Drug name"
          value={medication.drug_name}
          onChange={(event) => onChange(index, 'drug_name', event.target.value)}
          placeholder="Amoxicillin"
        />
        <Input
          label="Strength"
          value={medication.strength}
          onChange={(event) => onChange(index, 'strength', event.target.value)}
          placeholder="500mg"
        />
        <Input
          label="Dose instruction"
          value={medication.dosage}
          onChange={(event) => onChange(index, 'dosage', event.target.value)}
          placeholder="1 tablet"
        />
        <Input
          label="Frequency"
          value={medication.frequency}
          onChange={(event) => onChange(index, 'frequency', event.target.value)}
          placeholder="Twice daily"
        />
        <Input
          label="Duration"
          value={medication.duration}
          onChange={(event) => onChange(index, 'duration', event.target.value)}
          placeholder="5 days"
        />
        <Input
          label="Route"
          value={medication.route}
          onChange={(event) => onChange(index, 'route', event.target.value)}
          placeholder="Oral"
        />
      </div>
    </div>
  )
}
