export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validators {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
      return { isValid: false, errors };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (email.length > 255) {
      errors.push('Email address is too long');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password is too long');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    
    if (!username) {
      errors.push('Username is required');
      return { isValid: false, errors };
    }
    
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (username.length > 50) {
      errors.push('Username is too long');
    }
    
    // Allow alphanumeric characters, spaces, hyphens, and underscores
    const usernameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!usernameRegex.test(username)) {
      errors.push('Username can only contain letters, numbers, spaces, hyphens, and underscores');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phone) {
      return { isValid: true, errors }; // Phone is optional
    }
    
    // Remove spaces and common formatting characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (cleanPhone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }
    
    if (cleanPhone.length > 15) {
      errors.push('Phone number is too long');
    }
    
    const phoneRegex = /^\+?[0-9]+$/;
    if (!phoneRegex.test(cleanPhone)) {
      errors.push('Phone number can only contain digits and an optional + prefix');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static validateAppointmentDate(date: string): ValidationResult {
    const errors: string[] = [];
    
    if (!date) {
      errors.push('Appointment date is required');
      return { isValid: false, errors };
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time for comparison
    selectedDate.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (selectedDate < tomorrow) {
      errors.push('Appointment date must be at least tomorrow');
    }
    
    // Check if date is too far in the future (limit to 6 months)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    maxDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > maxDate) {
      errors.push('Appointment date cannot be more than 6 months in the future');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static validateAppointmentTime(time: string): ValidationResult {
    const errors: string[] = [];
    
    if (!time) {
      errors.push('Appointment time is required');
      return { isValid: false, errors };
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    
    // Check if time is within business hours (9 AM - 5 PM)
    if (hours < 9 || hours > 17) {
      errors.push('Appointments can only be scheduled between 9 AM and 5 PM');
    }
    
    // Check if time is on the hour or half-hour
    if (minutes !== 0 && minutes !== 30) {
      errors.push('Appointments can only be scheduled on the hour or half-hour');
    }
    
    // Check if time is in the past for today's date
    const now = new Date();
    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes, 0, 0);
    
    if (selectedTime < now) {
      errors.push('Cannot book appointments in the past');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static validateNotes(notes: string): ValidationResult {
    const errors: string[] = [];
    
    if (notes && notes.length > 1000) {
      errors.push('Notes cannot exceed 1000 characters');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static validateServiceId(serviceId: string): ValidationResult {
    const errors: string[] = [];
    
    if (!serviceId) {
      errors.push('Service selection is required');
      return { isValid: false, errors };
    }
    
    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(serviceId)) {
      errors.push('Invalid service selected');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .trim();
  }
  
  static validateAllAppointmentData(data: {
    service_id: string;
    appointment_date: string;
    appointment_time: string;
    notes?: string;
  }): ValidationResult {
    const errors: string[] = [];
    
    const serviceValidation = this.validateServiceId(data.service_id);
    errors.push(...serviceValidation.errors);
    
    const dateValidation = this.validateAppointmentDate(data.appointment_date);
    errors.push(...dateValidation.errors);
    
    const timeValidation = this.validateAppointmentTime(data.appointment_time);
    errors.push(...timeValidation.errors);
    
    const notesValidation = this.validateNotes(data.notes || '');
    errors.push(...notesValidation.errors);
    
    return { isValid: errors.length === 0, errors };
  }
}