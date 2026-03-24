export function formatDateTime(value) {
  if (!value) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatPrescriptionText(formData, doctorProfile) {
  const medicationLines = formData.medications
    .map((item, index) => {
      const details = [item.strength, item.dosage, item.frequency, item.duration, item.route]
        .filter(Boolean)
        .join(', ')
      return `${index + 1}. ${item.drug_name || 'Medication'}${details ? ` - ${details}` : ''}`
    })
    .join('\n')

  return [
    doctorProfile.clinic_name || 'Clinic Name',
    doctorProfile.clinic_address || '',
    doctorProfile.phone || '',
    '',
    `Patient: ${formData.patient_name || '-'}`,
    `Age: ${formData.age || '-'}    Sex: ${formData.sex || '-'}`,
    formData.phone ? `Phone: ${formData.phone}` : '',
    '',
    `Diagnosis: ${formData.diagnosis || '-'}`,
    `Notes: ${formData.notes || '-'}`,
    '',
    'Medications:',
    medicationLines || '1. Medication details pending',
    '',
    `Doctor: ${doctorProfile.full_name || '-'}`,
    doctorProfile.qualification || '',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function copyTextToClipboard(formData, doctorProfile) {
  const text = formatPrescriptionText(formData, doctorProfile)
  if (!navigator.clipboard) {
    throw new Error('Clipboard is not available in this browser.')
  }
  await navigator.clipboard.writeText(text)
}

export function isSameMonth(left, right) {
  const leftDate = new Date(left)
  const rightDate = new Date(right)
  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth()
  )
}
