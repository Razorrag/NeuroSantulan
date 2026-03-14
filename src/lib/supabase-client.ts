'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Client-side Supabase client factory
// This ensures Supabase is only initialized in browser environment
export const createBrowserClient = (): SupabaseClient | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.warn('Supabase credentials not available')
    return null
  }
  
  return createClient(url, key)
}

// Default client instance (lazy initialization)
let _client: SupabaseClient | null = null

export const getSupabase = (): SupabaseClient | null => {
  if (!_client && typeof window !== 'undefined') {
    _client = createBrowserClient()
  }
  return _client
}
