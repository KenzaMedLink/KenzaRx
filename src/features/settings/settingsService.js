import { LOCAL_STORAGE_KEYS } from '../../lib/constants'
import { requireSupabase } from '../../lib/supabase'

function readSettingsCache() {
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.settings) || '{}')
  } catch {
    return {}
  }
}

function cacheSettings(profile) {
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.settings, JSON.stringify(profile))
  window.dispatchEvent(new CustomEvent('doctor-profile-updated', { detail: profile }))
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Unable to read file.'))
    reader.readAsDataURL(file)
  })
}

function normalizeProfile(profile = {}) {
  return {
    full_name: '',
    email: '',
    phone: '',
    qualification: '',
    clinic_name: '',
    clinic_address: '',
    signature_url: '',
    logo_url: '',
    subscription_plan: 'free',
    ...profile,
  }
}

export const settingsService = {
  getDoctorProfile() {
    return normalizeProfile(readSettingsCache())
  },

  async fetchDoctorProfile(user) {
    const client = requireSupabase()
    const { data, error } = await client
      .from('doctor_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    const profile = normalizeProfile({
      ...data,
      email: data?.email || user.email || '',
    })

    cacheSettings(profile)
    return profile
  },

  async saveDoctorProfile(profile, user) {
    const client = requireSupabase()
    const payload = {
      id: user.id,
      full_name: profile.full_name?.trim() || user.email || 'Doctor',
      email: user.email || profile.email || null,
      phone: profile.phone?.trim() || null,
      qualification: profile.qualification?.trim() || null,
      clinic_name: profile.clinic_name?.trim() || null,
      clinic_address: profile.clinic_address?.trim() || null,
      signature_url: profile.signature_url || null,
      logo_url: profile.logo_url || null,
      subscription_plan: profile.subscription_plan || 'free',
    }

    const { data, error } = await client
      .from('doctor_profiles')
      .upsert(payload)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    const nextProfile = normalizeProfile(data)
    cacheSettings(nextProfile)
    return nextProfile
  },

  async convertFileToUrl(file) {
    if (!file) {
      return ''
    }

    return readAsDataUrl(file)
  },
}
