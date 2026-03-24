export function Input({ label, value, onChange, placeholder = '', type = 'text' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  )
}
