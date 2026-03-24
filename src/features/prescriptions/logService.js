import { requireSupabase } from '../../lib/supabase'

export async function logPrescriptionAction({
  prescriptionId,
  doctorId,
  action,
  details = {},
}) {
  try {
    if (!prescriptionId || !doctorId) {
      return
    }

    const client = requireSupabase()
    const payload = {
      prescription_id: prescriptionId,
      doctor_id: doctorId,
      action,
      action_details: details,
      user_agent: navigator.userAgent || null,
    }

    const { error } = await client.from('prescription_logs').insert(payload)
    if (error) {
      console.error('Log insert error:', error.message)
    }
  } catch (error) {
    console.error('Log error:', error.message)
  }
}
