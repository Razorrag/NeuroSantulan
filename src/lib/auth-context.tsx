'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { createClient, User } from '@supabase/supabase-js'

// Initialize Supabase client only on client-side
const initSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.warn('Supabase credentials not available')
    return null
  }
  
  return createClient(url, key)
}

let supabase: ReturnType<typeof createClient> | null = null

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (userData: SignUpData) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
}

interface UserProfile {
  id: string
  email: string
  username: string
  phone: string
  country_code: string
  date_of_birth: string | null
  gender: string | null
  role: string
}

interface SignUpData {
  email: string
  password: string
  username: string
  phone: string
  country_code: string
  date_of_birth?: string
  gender?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize Supabase on mount (client-side only)
  useEffect(() => {
    if (!supabase) {
      supabase = initSupabase()
    }
  }, [])

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setUserProfile(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        void fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        void fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchUserProfile])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not initialized') }
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (userData: SignUpData) => {
    if (!supabase) {
      return { error: new Error('Supabase not initialized') }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          phone: userData.phone,
          country_code: userData.country_code,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
        },
      },
    })

    if (error) return { error }

    // Create user profile in database
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: userData.email,
        username: userData.username,
        phone: userData.phone,
        country_code: userData.country_code,
        date_of_birth: userData.date_of_birth || null,
        gender: userData.gender || null,
        role: 'user',
      })

      if (profileError) return { error: profileError }
    }

    return { error: null }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setUserProfile(null)
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not initialized') }
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
