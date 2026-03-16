'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Check, Clock3, FileText, Stethoscope, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { BusinessRules } from '@/lib/business-rules';
import { Validators } from '@/lib/validators';
import { ErrorHandler, AppError } from '@/lib/error-handler';
import { supabase as supabaseLib } from '@/lib/supabase';

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

interface BookingFormData {
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
}

export default function BookAppointmentPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Get Supabase client from centralized instance
  const supabase = supabaseLib.getInstance();
  
  // Early return if Supabase is not initialized
  if (!supabase) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="text-slate-700">Supabase not initialized</div>
      </div>
    );
  }

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });
  
  // Validation and business rule states
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [businessRuleWarnings, setBusinessRuleWarnings] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && userProfile?.role === 'admin') {
      // Redirect admin users to admin dashboard
      router.push('/admin');
    }
  }, [user, userProfile, authLoading, router]);

  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').eq('is_active', true).order('name');

      if (error) {
        const appError = ErrorHandler.handleDatabaseError(error);
        ErrorHandler.showToastError(appError);
        return;
      }

      if (data) {
        setServices(data);
      }
    } catch (err: any) {
      const appError = ErrorHandler.handleDatabaseError(err);
      ErrorHandler.showToastError(appError);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchServices();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchServices]);

  const validateForm = useCallback(() => {
    const errors: string[] = [];
    
    // Basic validation
    const validation = Validators.validateAllAppointmentData(formData);
    errors.push(...validation.errors);
    
    // Additional business rule validation
    if (formData.service_id && services.length > 0) {
      const selectedService = services.find(s => s.id === formData.service_id);
      if (!selectedService) {
        errors.push('Selected service is not available');
      } else if (!selectedService.is_active) {
        errors.push('Selected service is currently unavailable');
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, [formData, services]);

  const checkBusinessRules = useCallback(async () => {
    if (!formData.service_id || !formData.appointment_date || !formData.appointment_time) {
      setBusinessRuleWarnings([]);
      return true;
    }

    setIsCheckingAvailability(true);
    setBusinessRuleWarnings([]);

    try {
      const businessRules = new BusinessRules(supabase);
      const result = await businessRules.validateAppointmentBooking(
        user!.id,
        formData.service_id,
        formData.appointment_date,
        formData.appointment_time
      );

      if (!result.isValid) {
        const error = BusinessRules.formatBusinessRuleError(result.conflicts);
        ErrorHandler.showToastError(error);
        return false;
      }

      if (result.warnings.length > 0) {
        setBusinessRuleWarnings(result.warnings);
        result.warnings.forEach(warning => ErrorHandler.showToastWarning(warning));
      }

      return true;
    } catch (err: any) {
      const appError = ErrorHandler.handleDatabaseError(err);
      ErrorHandler.showToastError(appError);
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [formData, supabase, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form
    if (!validateForm()) {
      ErrorHandler.showToastError(new AppError('VALIDATION_ERROR', 'Please fix the validation errors', 'Please fix the validation errors'));
      return;
    }

    // Check business rules
    const businessRulesValid = await checkBusinessRules();
    if (!businessRulesValid) {
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('appointments').insert({
        user_id: user.id,
        service_id: formData.service_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        notes: formData.notes || null,
        status: 'pending',
      });

      if (error) {
        const appError = ErrorHandler.handleDatabaseError(error);
        ErrorHandler.showToastError(appError);
        setSubmitting(false);
        return;
      }

      ErrorHandler.showToastSuccess('Appointment booked successfully!');
      setSuccess(true);
    } catch (err: any) {
      const appError = ErrorHandler.handleDatabaseError(err);
      ErrorHandler.showToastError(appError);
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    
    // Clear warnings when user changes date/time
    if ((field === 'appointment_date' || field === 'appointment_time') && businessRuleWarnings.length > 0) {
      setBusinessRuleWarnings([]);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const timeSlots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 17) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  if (success) {
    return (
      <div className="app-shell flex items-center justify-center px-4 py-10">
        <div className="form-card glass-dark text-center">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.6rem] bg-emerald-400/14">
            <Check className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Appointment request sent</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Your booking is in place. You can review status and details from your profile page.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/profile" className="primary-button">View appointments</Link>
            <Link href="/" className="secondary-button">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-400/60 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="app-shell px-4 py-8 sm:py-10">
      <div className="page-shell">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/profile" className="secondary-button min-h-11 px-4 py-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <span className="section-label">
              <span className="eyebrow-dot" />
              Booking
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Book an appointment</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="glass-dark rounded-[1.8rem] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-950">Choose a service</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">Everything here is sized to stay readable without wasting space.</p>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-4 rounded-xl border border-rose-400/25 bg-rose-400/12 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-rose-950">
                  <AlertCircle className="h-4 w-4" />
                  Please fix the following errors:
                </div>
                <ul className="mt-2 space-y-1 text-sm text-rose-800">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {services.map((service) => (
                <label
                  key={service.id}
                  className={`block cursor-pointer rounded-[1.3rem] border p-4 transition ${
                    formData.service_id === service.id
                      ? 'border-orange-300/70 bg-orange-400/16'
                      : 'border-slate-900/8 bg-white/30 hover:bg-white/45'
                  }`}
                >
                  <input
                    type="radio"
                    name="service_id"
                    value={service.id}
                    checked={formData.service_id === service.id}
                    onChange={(e) => handleInputChange('service_id', e.target.value)}
                    className="sr-only"
                    required
                  />
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/45">
                      <Stethoscope className="h-5 w-5 text-slate-950" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-semibold text-slate-950">{service.name}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-700">{service.description}</div>
                      <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-800">
                        <Clock3 className="h-4 w-4" />
                        {service.duration_minutes} minutes
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="form-group">
                <label className="field-label">Date</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" />
                  <input
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                    min={minDate}
                    className={`control ${validationErrors.some(e => e.includes('date')) ? 'border-rose-400' : ''}`}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Preferred time</label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleInputChange('appointment_time', time)}
                      className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                        formData.appointment_time === time
                          ? 'border-orange-300/70 bg-orange-400/18 text-slate-950'
                          : 'border-slate-900/8 bg-white/30 text-slate-800 hover:bg-white/45'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 form-group">
              <label className="field-label">Notes</label>
              <div className="input-wrapper">
                <FileText className="input-icon top-4" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={5}
                  className="control min-h-[8rem] resize-none"
                  placeholder="Add any context the therapist should know before the session."
                />
              </div>
            </div>

            {/* Business Rule Warnings */}
            {businessRuleWarnings.length > 0 && (
              <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/12 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-950">
                  <AlertCircle className="h-4 w-4" />
                  Booking recommendations:
                </div>
                <ul className="mt-2 space-y-1 text-sm text-amber-800">
                  {businessRuleWarnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link href="/profile" className="secondary-button">Cancel</Link>
              <button
                type="submit"
                disabled={submitting || !formData.service_id || !formData.appointment_date || !formData.appointment_time || isCheckingAvailability}
                className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : isCheckingAvailability ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking availability...
                  </>
                ) : (
                  'Confirm booking'
                )}
              </button>
            </div>
          </form>

          <aside className="glass-dark rounded-[1.8rem] p-5 sm:p-6">
            <span className="section-label">
              <span className="eyebrow-dot" />
              What to expect
            </span>
            <div className="mt-5 space-y-4">
              {[
                'Choose a service and an available time slot.',
                'Share any useful notes so the first session starts with context.',
                'Track status later from your profile without digging through the site.',
              ].map((item) => (
                <div key={item} className="surface-card rounded-[1.25rem] px-4 py-4 text-sm leading-6 text-slate-200/78">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}