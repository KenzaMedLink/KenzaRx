import { requireSupabase } from '../../lib/supabase'

function parseAge(age) {
  if (age === '' || age === null || age === undefined) {
    return null
  }

  const value = Number.parseInt(age, 10)
  return Number.isNaN(value) ? null : value
}

export const patientService = {
  async createOrUpdatePatient(formData, doctorId) {
    if (!formData.patient_name?.trim()) {
      return null
    }

    const client = requireSupabase()
    const { data: existing, error: fetchError } = await client
      .from('patients')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('full_name', formData.patient_name.trim())
      .maybeSingle()

    if (fetchError) {
      throw new Error(fetchError.message)
    }

    const payload = {
      doctor_id: doctorId,
      full_name: formData.patient_name.trim(),
      age: parseAge(formData.age),
      sex: formData.sex || null,
      phone: formData.phone?.trim() || null,
    }

    if (existing) {
      const { data, error } = await client
        .from('patients')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    }

    const { data, error } = await client
      .from('patients')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  async findPatientsByName(query, doctorId) {
    const client = requireSupabase()
    let request = client
      .from('patients')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('updated_at', { ascending: false })

    if (query?.trim()) {
      request = request.ilike('full_name', `%${query.trim()}%`)
    }

    const { data, error } = await request
    if (error) {
      throw new Error(error.message)
    }

    return data || []
  },

  async getRecentPatients(doctorId, limit = 5) {
    const client = requireSupabase()
    const { data, error } = await client
      .from('patients')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  },
}
