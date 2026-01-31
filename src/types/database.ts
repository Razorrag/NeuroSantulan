export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'patient' | 'doctor' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface PatientProfile {
  id: string;
  user_id: string;
  date_of_birth?: string;
  phone?: string;
  address?: string;
  medical_history?: string;
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  specialization?: string;
  license_number?: string;
  experience_years?: number;
  phone?: string;
  consultation_fee?: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  patient_id: string;
  doctor_id: string;
  assessment_type: string;
  results: any;
  recommendations?: string;
  created_at: string;
  updated_at: string;
}
