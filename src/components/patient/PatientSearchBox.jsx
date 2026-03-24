import { Input } from '../ui/Input'

export function PatientSearchBox({ value, onChange }) {
  return (
    <div className="search-box">
      <Input
        label="Search by patient name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Start typing a patient name"
      />
    </div>
  )
}
