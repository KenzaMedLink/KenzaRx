export const initialPrescription = {
  patient_name: '',
  age: '',
  sex: '',
  phone: '',
  diagnosis: '',
  notes: '',
  medications: [
    {
      drug_name: '',
      strength: '',
      dosage: '',
      frequency: '',
      duration: '',
      route: '',
    },
  ],
}

export function clonePrescription(prescription) {
  return {
    patient_name: prescription.patient_name || '',
    age: prescription.age || '',
    sex: prescription.sex || '',
    phone: prescription.phone || '',
    diagnosis: prescription.diagnosis || '',
    notes: prescription.notes || '',
    medications: prescription.medications?.length
      ? prescription.medications.map((item) => ({ ...item }))
      : initialPrescription.medications.map((item) => ({ ...item })),
  }
}
