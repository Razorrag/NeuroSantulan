'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase as supabaseLib } from '@/lib/supabase'
import { ErrorHandler, AppError } from './error-handler'

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

  // Get Supabase instance helper with error handling
  const getSupabase = useCallback(() => {
    const supabase = supabaseLib.getInstance()
    if (!supabase) {
      const error = ErrorHandler.handleDatabaseError(new Error('Supabase not initialized'))
      ErrorHandler.showToastError(error)
      return null
    }
    return supabase
  }, [])

  const fetchUserProfile = useCallback(async (userId: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        const appError = ErrorHandler.handleDatabaseError(error)
        ErrorHandler.showToastError(appError)
        return
      }

      if (data) {
        setUserProfile(data)
      }
    } catch (err: any) {
      const appError = ErrorHandler.handleDatabaseError(err)
      ErrorHandler.showToastError(appError)
    } finally {
      setLoading(false)
    }
  }, [getSupabase])

  useEffect(() => {
    const supabase = getSupabase()
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
    }).catch((err) => {
      const appError = ErrorHandler.handleDatabaseError(err)
      ErrorHandler.showToastError(appError)
      setLoading(false)
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
  }, [fetchUserProfile, getSupabase])

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      const error = ErrorHandler.handleDatabaseError(new Error('Supabase not initialized'))
      return { error }
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        const appError = ErrorHandler.handleDatabaseError(error)
        ErrorHandler.showToastError(appError)
        return { error: new AppError(appError.code, appError.message, appError.userMessage) }
      }
      
      return { error: null }
    } catch (err: any) {
      const appError = ErrorHandler.handleDatabaseError(err)
      ErrorHandler.showToastError(appError)
      return { error: new AppError(appError.code, appError.message, appError.userMessage) }
    }
  }

  const signUp = async (userData: SignUpData) => {
    const supabase = getSupabase()
    if (!supabase) {
      const error = ErrorHandler.handleDatabaseError(new Error('Supabase not initialized'))
      return { error }
    }
    
    try {
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

      if (error) {
        const appError = ErrorHandler.handleDatabaseError(error)
        ErrorHandler.showToastError(appError)
        return { error: new AppError(appError.code, appError.message, appError.userMessage) }
      }

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
        } as any)

        if (profileError) {
          const appError = ErrorHandler.handleDatabaseError(profileError)
          ErrorHandler.showToastError(appError)
          return { error: new AppError(appError.code, appError.message, appError.userMessage) }
        }
      }

      return { error: null }
    } catch (err: any) {
      const appError = ErrorHandler.handleDatabaseError(err)
      ErrorHandler.showToastError(appError)
      return { error: new AppError(appError.code, appError.message, appError.userMessage) }
    }
  }

  const signOut = async () => {
    const supabase = getSupabase()
    if (!supabase) return
    
    try {
      await supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
      ErrorHandler.showToastSuccess('Signed out successfully')
    } catch (err: any) {
      const appError = ErrorHandler.handleDatabaseError(err)
      ErrorHandler.showToastError(appError)
    }
  }

  const resetPassword = async (email: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      const error = ErrorHandler.handleDatabaseError(new Error('Supabase not initialized'))
      return { error }
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        const appError = ErrorHandler.handleDatabaseError(error)
        ErrorHandler.showToastError(appError)
        return { error: new AppError(appError.code, appError.message, appError.userMessage) }
      }
      
      ErrorHandler.showToastSuccess('Password reset email sent')
      return { error: null }
    } catch (err: any) {
      const appError = ErrorHandler.handleDatabaseError(err)
      ErrorHandler.showToastError(appError)
      return { error: new AppError(appError.code, appError.message, appError.userMessage) }
    }
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
