import { supabase } from './supabase'
import { User, PatientProfile, DoctorProfile } from '@/types/database'

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, fullName: string, role: 'patient' | 'doctor') {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      })

      if (authError) throw authError

      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            full_name: fullName,
            role: role
          })

        if (profileError) throw profileError

        // Create role-specific profile
        if (role === 'patient') {
          await supabase
            .from('patient_profiles')
            .insert({
              user_id: authData.user.id
            })
        } else if (role === 'doctor') {
          await supabase
            .from('doctor_profiles')
            .insert({
              user_id: authData.user.id
            })
        }
      }

      return { success: true, user: authData.user }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error as Error }
    }
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      return { 
        success: true, 
        user: data.user,
        profile: profile
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error as Error }
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error as Error }
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      if (!user) return { success: true, user: null, profile: null }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      return { success: true, user, profile }
    } catch (error) {
      console.error('Get current user error:', error)
      return { success: false, error: error as Error, user: null, profile: null }
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, error: error as Error }
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Update password error:', error)
      return { success: false, error: error as Error }
    }
  }
}
