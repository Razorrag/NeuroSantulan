"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { AuthService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { User as DatabaseUser } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: DatabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>
  signUp: (email: string, password: string, fullName: string, role: 'patient' | 'doctor') => Promise<{ success: boolean; error?: Error }>
  signOut: () => Promise<{ success: boolean; error?: Error }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: Error }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<DatabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const result = await AuthService.getCurrentUser()
      if (result.success) {
        setUser(result.user)
        setProfile(result.profile)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const result = await AuthService.getCurrentUser()
          if (result.success) {
            setUser(result.user || null)
            setProfile(result.profile)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn(email, password)
    if (result.success) {
      setUser(result.user || null)
      setProfile(result.profile)
    }
    return result
  }

  const signUp = async (email: string, password: string, fullName: string, role: 'patient' | 'doctor') => {
    return await AuthService.signUp(email, password, fullName, role)
  }

  const signOut = async () => {
    const result = await AuthService.signOut()
    if (result.success) {
      setUser(null)
      setProfile(null)
    }
    return result
  }

  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword(email)
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
