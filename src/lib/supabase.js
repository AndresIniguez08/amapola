import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let instance = null

export function getSupabase() {
  if (!instance) {
    instance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return instance
}

export const supabase = getSupabase()