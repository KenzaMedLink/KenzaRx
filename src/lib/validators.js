export function validatePrescription(formData) {
  if (!formData.patient_name.trim()) {
    return 'Patient name is required.'
  }

  if (!formData.diagnosis.trim()) {
    return 'Diagnosis is required.'
  }

  return ''
}
