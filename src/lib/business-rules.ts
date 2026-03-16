import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ErrorHandler, AppError } from './error-handler';
import { Validators } from './validators';

export interface AppointmentConflict {
  type: 'time_conflict' | 'user_conflict' | 'business_hours';
  message: string;
  conflictingAppointment?: any;
}

export interface BusinessRuleResult {
  isValid: boolean;
  conflicts: AppointmentConflict[];
  warnings: string[];
}

export class BusinessRules {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async validateAppointmentBooking(
    userId: string,
    serviceId: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<BusinessRuleResult> {
    const conflicts: AppointmentConflict[] = [];
    const warnings: string[] = [];

    // 1. Validate basic input rules
    const dateValidation = Validators.validateAppointmentDate(appointmentDate);
    const timeValidation = Validators.validateAppointmentTime(appointmentTime);
    const serviceValidation = Validators.validateServiceId(serviceId);

    if (!dateValidation.isValid) {
      conflicts.push({
        type: 'business_hours',
        message: dateValidation.errors.join(', ')
      });
    }

    if (!timeValidation.isValid) {
      conflicts.push({
        type: 'business_hours',
        message: timeValidation.errors.join(', ')
      });
    }

    if (!serviceValidation.isValid) {
      conflicts.push({
        type: 'business_hours',
        message: serviceValidation.errors.join(', ')
      });
    }

    // 2. Check if service exists and is active
    try {
      const { data: service, error } = await this.supabase
        .from('services')
        .select('id, name, duration_minutes, is_active')
        .eq('id', serviceId)
        .single();

      if (error) {
        conflicts.push({
          type: 'business_hours',
          message: 'Failed to verify service availability'
        });
      } else if (!service) {
        conflicts.push({
          type: 'business_hours',
          message: 'Selected service not found'
        });
      } else if (!service.is_active) {
        conflicts.push({
          type: 'business_hours',
          message: 'Selected service is currently unavailable'
        });
      }
    } catch (error) {
      conflicts.push({
        type: 'business_hours',
        message: 'Service validation failed'
      });
    }

    // 3. Check for appointment conflicts
    if (dateValidation.isValid && timeValidation.isValid) {
      try {
        const timeConflicts = await this.checkTimeConflicts(appointmentDate, appointmentTime);
        conflicts.push(...timeConflicts);

        const userConflicts = await this.checkUserConflicts(userId, appointmentDate, appointmentTime);
        conflicts.push(...userConflicts);
      } catch (error) {
        conflicts.push({
          type: 'business_hours',
          message: 'Failed to check for appointment conflicts'
        });
      }
    }

    // 4. Check for business rule warnings
    try {
      const ruleWarnings = await this.checkBusinessRuleWarnings(userId, appointmentDate);
      warnings.push(...ruleWarnings);
    } catch (error) {
      warnings.push('Unable to check for booking recommendations');
    }

    return {
      isValid: conflicts.length === 0,
      conflicts,
      warnings
    };
  }

  private async checkTimeConflicts(
    appointmentDate: string,
    appointmentTime: string
  ): Promise<AppointmentConflict[]> {
    const conflicts: AppointmentConflict[] = [];

    try {
      // Check for overlapping appointments on the same time slot
      const { data: conflictingAppointments, error } = await this.supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          service:services(name, duration_minutes)
        `)
        .eq('appointment_date', appointmentDate)
        .eq('appointment_time', appointmentTime)
        .in('status', ['pending', 'confirmed', 'completed']);

      if (error) {
        throw error;
      }

      if (conflictingAppointments && conflictingAppointments.length > 0) {
        conflicts.push({
          type: 'time_conflict',
          message: 'This time slot is already booked',
          conflictingAppointment: conflictingAppointments[0]
        });
      }
    } catch (error) {
      console.error('Error checking time conflicts:', error);
      conflicts.push({
        type: 'time_conflict',
        message: 'Unable to verify time slot availability'
      });
    }

    return conflicts;
  }

  private async checkUserConflicts(
    userId: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<AppointmentConflict[]> {
    const conflicts: AppointmentConflict[] = [];

    try {
      // Check if user already has an appointment on the same day
      const { data: userAppointments, error } = await this.supabase
        .from('appointments')
        .select('id, appointment_date, appointment_time, status')
        .eq('user_id', userId)
        .eq('appointment_date', appointmentDate)
        .in('status', ['pending', 'confirmed', 'completed']);

      if (error) {
        throw error;
      }

      if (userAppointments && userAppointments.length > 0) {
        // Check if it's the same time (user editing existing appointment)
        const sameTimeAppointment = userAppointments.find(
          appt => appt.appointment_time === appointmentTime
        );

        if (!sameTimeAppointment) {
          conflicts.push({
            type: 'user_conflict',
            message: 'You already have an appointment scheduled for this day'
          });
        }
      }
    } catch (error) {
      console.error('Error checking user conflicts:', error);
      conflicts.push({
        type: 'user_conflict',
        message: 'Unable to verify your appointment history'
      });
    }

    return conflicts;
  }

  private async checkBusinessRuleWarnings(
    userId: string,
    appointmentDate: string
  ): Promise<string[]> {
    const warnings: string[] = [];

    try {
      // Check if user has had recent appointments
      const { data: recentAppointments, error } = await this.supabase
        .from('appointments')
        .select('id, appointment_date, status')
        .eq('user_id', userId)
        .gte('appointment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // Last 30 days
        .in('status', ['completed']);

      if (error) {
        throw error;
      }

      if (recentAppointments && recentAppointments.length > 0) {
        const daysSinceLastAppointment = Math.floor(
          (new Date(appointmentDate).getTime() - new Date(recentAppointments[recentAppointments.length - 1].appointment_date).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastAppointment < 7) {
          warnings.push('Consider spacing appointments at least 7 days apart for optimal results');
        }
      }
    } catch (error) {
      console.error('Error checking business rule warnings:', error);
    }

    return warnings;
  }

  async validateUserPermissions(userId: string, action: string): Promise<boolean> {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('id, role')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return false;
      }

      // Basic permission checks
      switch (action) {
        case 'book_appointment':
          return user.role === 'user' || user.role === 'admin';
        case 'view_appointments':
          return user.role === 'user' || user.role === 'admin';
        case 'cancel_appointment':
          return user.role === 'user' || user.role === 'admin';
        case 'admin_actions':
          return user.role === 'admin';
        default:
          return false;
      }
    } catch (error) {
      console.error('Error validating user permissions:', error);
      return false;
    }
  }

  async validateServiceAvailability(serviceId: string): Promise<boolean> {
    try {
      const { data: service, error } = await this.supabase
        .from('services')
        .select('id, is_active')
        .eq('id', serviceId)
        .single();

      if (error) {
        throw error;
      }

      return service && service.is_active;
    } catch (error) {
      console.error('Error validating service availability:', error);
      return false;
    }
  }

  static formatBusinessRuleError(conflicts: AppointmentConflict[]): AppError {
    const messages = conflicts.map(conflict => conflict.message);
    return new AppError(
      'BUSINESS_RULE_VIOLATION',
      messages.join('; '),
      messages.join('. ')
    );
  }
}