export interface User {
  id: string
  email: string
  username: string
  phone: string
  country_code: string
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other' | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  user_id: string
  service_id: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
  // Joined fields
  user?: User
  service?: Service
}

export interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  is_active: boolean
  created_at: string
}

export interface UserProfile extends User {
  appointments?: Appointment[]
}
