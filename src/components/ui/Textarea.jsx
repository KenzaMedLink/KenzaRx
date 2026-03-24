export function Textarea({ label, value, onChange, placeholder = '' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} />
    </label>
  )
}
