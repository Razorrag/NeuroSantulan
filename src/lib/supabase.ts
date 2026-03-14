import { createClient } from '@supabase/supabase-js'

// Use environment variables with fallback for build time
const getSupabaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: always available
    return process.env.NEXT_PUBLIC_SUPABASE_URL!
  }
  // Server-side/build: may not be available during static generation
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

const getSupabaseKey = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  }
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = getSupabaseKey()

// Create client - will work in browser, may be empty during build
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}
