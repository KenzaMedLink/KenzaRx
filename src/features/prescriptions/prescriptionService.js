import { PLAN_LIMITS } from '../../lib/constants'
import { formatPrescriptionText } from '../../lib/formatters'
import { requireSupabase } from '../../lib/supabase'
import { patientService } from '../patients/patientService'

function parseAge(age) {
  if (age === '' || age === null || age === undefined) {
    return null
  }

  const value = Number.parseInt(age, 10)
  return Number.isNaN(value) ? null : value
}

function monthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

export const prescriptionService = {
  async createPrescription(formData, user, doctorProfile) {
    const client = requireSupabase()
    const { start, end } = monthRange()

    if (doctorProfile.subscription_plan === 'free') {
      const { count, error: countError } = await client
        .from('prescriptions')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', user.id)
        .gte('created_at', start)
        .lt('created_at', end)

      if (countError) {
        throw new Error(countError.message)
      }

      if ((count || 0) >= PLAN_LIMITS.freeMonthlyPrescriptions) {
        throw new Error('Free plan monthly limit reached. Upgrade to Pro for unlimited prescriptions.')
      }
    }

    const patient = await patientService.createOrUpdatePatient(formData, user.id)
    const payload = {
      doctor_id: user.id,
      patient_id: patient?.id || null,
      patient_name: formData.patient_name.trim(),
      age: parseAge(formData.age),
      sex: formData.sex || null,
      diagnosis: formData.diagnosis?.trim() || null,
      notes: formData.notes?.trim() || null,
      medications: formData.medications,
      generated_text: formatPrescriptionText(formData, doctorProfile),
      status: 'active',
    }

    const { data, error } = await client
      .from('prescriptions')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  async getPrescriptions({ doctorId, search = '', date = '', limit }) {
    const client = requireSupabase()
    let request = client
      .from('prescriptions')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false })

    if (search.trim()) {
      request = request.ilike('patient_name', `%${search.trim()}%`)
    }

    if (date) {
      const start = new Date(`${date}T00:00:00`)
      const end = new Date(`${date}T23:59:59.999`)
      request = request.gte('created_at', start.toISOString()).lte('created_at', end.toISOString())
    }

    if (limit) {
      request = request.limit(limit)
    }

    const { data, error } = await request
    if (error) {
      throw new Error(error.message)
    }

    return data || []
  },

  async getPrescriptionById(id, doctorId) {
    const client = requireSupabase()
    const { data, error } = await client
      .from('prescriptions')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  async getRecentPrescriptions(doctorId, limit = 5) {
    return this.getPrescriptions({ doctorId, limit })
  },

  async getDashboardStats(doctorId) {
    const client = requireSupabase()
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()

    const [{ count: totalCount, error: totalError }, { count: todayCount, error: todayError }] =
      await Promise.all([
        client.from('prescriptions').select('id', { count: 'exact', head: true }).eq('doctor_id', doctorId),
        client
          .from('prescriptions')
          .select('id', { count: 'exact', head: true })
          .eq('doctor_id', doctorId)
          .gte('created_at', start)
          .lt('created_at', end),
      ])

    if (totalError) {
      throw new Error(totalError.message)
    }

    if (todayError) {
      throw new Error(todayError.message)
    }

    return {
      todayCount: todayCount || 0,
      totalCount: totalCount || 0,
    }
  },
}
