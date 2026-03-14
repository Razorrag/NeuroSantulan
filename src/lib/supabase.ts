import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid issues during static generation
let _supabase: SupabaseClient | null = null
let _serverClient: SupabaseClient | null = null

const getCredentials = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // During build/static generation, these might be empty
  if (!url || !key) {
    return null
  }
  
  return { url, key }
}

// Lazy initialization - only create client when actually used
export const supabase = {
  getInstance: (): SupabaseClient | null => {
    if (!_supabase) {
      const creds = getCredentials()
      if (!creds) return null
      _supabase = createClient(creds.url, creds.key)
    }
    return _supabase
  }
}

// For server-side operations
export const createServerClient = (): SupabaseClient | null => {
  if (!_serverClient) {
    const creds = getCredentials()
    if (!creds) return null
    _serverClient = createClient(creds.url, creds.key)
  }
  return _serverClient
}

// Default export for backward compatibility
export default supabase
