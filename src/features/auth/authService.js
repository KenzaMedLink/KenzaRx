import { requireSupabase, supabase } from '../../lib/supabase'

export const authService = {
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    const client = requireSupabase()
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data.user
  },

  async logout() {
    const client = requireSupabase()
    const { error } = await client.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  },

  async getCurrentUser() {
    if (!supabase) {
      return null
    }

    const { data, error } = await supabase.auth.getUser()
    if (error) {
      return null
    }

    return data.user
  },

  onAuthStateChange(callback) {
    if (!supabase) {
      return () => {}
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  },
}
