import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  session: undefined, // undefined = loading, null = not logged in, object = logged in

  init() {
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session ?? null })
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session: session ?? null })
    })
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    set({ session: data.session })
  },

  async signOut() {
    await supabase.auth.signOut()
    set({ session: null })
  },
}))
