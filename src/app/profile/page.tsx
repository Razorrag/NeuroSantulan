'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Brain, Calendar, CheckCircle2, Clock3, FileText, LogOut, Plus, Settings, Target, User, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  service?: {
    name: string;
    price: number;
  };
}

interface TreatmentPlan {
  goals: string[];
  exercises: { name: string; frequency: string; description: string }[];
  recommendations: string[];
  nextMilestone: string;
}

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        service:services(name, price)
      `)
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: false });

    if (!error && data) {
      setAppointments(data);
    }

    setLoading(false);
  }, [user]);

  const fetchTreatmentPlan = useCallback(async () => {
    if (!user) return;

    // Get completed appointments to generate a treatment plan
    const { data: completedAppointments } = await supabase
      .from('appointments')
      .select(`
        *,
        service:services(name, description)
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('appointment_date', { ascending: false })
      .limit(5);

    if (completedAppointments && completedAppointments.length > 0) {
      // Generate treatment plan based on completed sessions
      
      setTreatmentPlan({
        goals: [
          'Reduce pain and discomfort',
          'Improve mobility and flexibility',
          'Strengthen affected areas',
          'Prevent future injuries',
        ],
        exercises: [
          { name: 'Gentle stretching', frequency: '2-3 times daily', description: 'Focus on affected areas, hold each stretch for 30 seconds' },
          { name: 'Strengthening exercises', frequency: 'Once daily', description: 'Light resistance exercises as demonstrated in session' },
          { name: 'Posture correction', frequency: 'Throughout the day', description: 'Maintain proper posture during daily activities' },
        ],
        recommendations: [
          'Apply heat before exercises and ice after activity',
          'Take short breaks every hour if sitting for long periods',
          'Stay hydrated and maintain good nutrition',
          'Get adequate rest for recovery',
        ],
        nextMilestone: 'Complete 2 weeks of home exercises before next evaluation',
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        void fetchAppointments();
        void fetchTreatmentPlan();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [user, fetchAppointments, fetchTreatmentPlan]);

  const handleCancelAppointment = async (appointmentId: string) => {
    setCancelling(appointmentId);
    const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appointmentId);

    if (!error) {
      await fetchAppointments();
    }
    setCancelling(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pill bg-amber-400/18 text-slate-950';
      case 'confirmed':
        return 'status-pill bg-sky-400/18 text-slate-950';
      case 'completed':
        return 'status-pill bg-emerald-400/18 text-slate-950';
      case 'cancelled':
        return 'status-pill bg-rose-400/18 text-slate-950';
      default:
        return 'status-pill bg-white/45 text-slate-950';
    }
  };

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
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="brand-mark">
              <Brain className="h-5 w-5 text-slate-950" />
            </span>
            <div>
              <div className="text-lg font-semibold text-slate-950">Neurosantulan</div>
              <div className="text-sm text-slate-700">Patient dashboard</div>
            </div>
          </Link>

          <button onClick={handleSignOut} className="secondary-button">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="space-y-6">
            <div className="glass-dark rounded-[1.8rem] p-6">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.4rem] bg-white/45">
                  <User className="h-9 w-9 text-slate-950" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="section-label">
                    <span className="eyebrow-dot" />
                    Profile
                  </span>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{userProfile?.username || 'User'}</h1>
                  <p className="mt-2 break-all text-sm text-slate-700">{userProfile?.email}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="status-pill bg-white/45 text-slate-950">{userProfile?.role || 'user'}</span>
                    {userProfile?.phone ? <span className="status-pill bg-white/45 text-slate-950">{userProfile.phone}</span> : null}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/book-appointment" className="primary-button">
                  <Plus className="h-4 w-4" />
                  Book appointment
                </Link>
                <Link href="/profile/edit" className="secondary-button">
                  <Settings className="h-4 w-4" />
                  Edit profile
                </Link>
              </div>
            </div>

            {treatmentPlan ? (
              <div className="glass-dark rounded-[1.8rem] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/45">
                    <Target className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <span className="section-label">
                      <span className="eyebrow-dot" />
                      Treatment plan
                    </span>
                  </div>
                </div>

                <div className="mb-5 rounded-2xl bg-emerald-400/12 px-4 py-3">
                  <p className="text-sm font-medium text-emerald-950">Next milestone</p>
                  <p className="mt-1 text-sm text-emerald-800">{treatmentPlan.nextMilestone}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium text-slate-950">
                      <CheckCircle2 className="h-4 w-4" />
                      Goals
                    </h4>
                    <ul className="mt-2 space-y-1.5">
                      {treatmentPlan.goals.map((goal) => (
                        <li key={goal} className="text-sm text-slate-700">• {goal}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium text-slate-950">
                      <FileText className="h-4 w-4" />
                      Home exercises
                    </h4>
                    <div className="mt-2 space-y-3">
                      {treatmentPlan.exercises.map((exercise) => (
                        <div key={exercise.name} className="rounded-xl border border-slate-900/8 bg-white/30 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-950">{exercise.name}</p>
                            <span className="rounded-full bg-orange-400/16 px-2 py-0.5 text-xs font-medium text-orange-950">
                              {exercise.frequency}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-700">{exercise.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-950">Recommendations</h4>
                    <ul className="mt-2 space-y-1.5">
                      {treatmentPlan.recommendations.map((rec) => (
                        <li key={rec} className="text-sm text-slate-700">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="glass-dark rounded-[1.8rem] p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-slate-950" />
                <div>
                  <p className="font-medium text-slate-950">Need help?</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    Contact the clinic if your session needs to be moved or if you need assistance before your appointment.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-dark rounded-[1.8rem] p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="section-label">
                  <span className="eyebrow-dot" />
                  Appointments
                </span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Your upcoming and past sessions</h2>
              </div>
              <Link href="/book-appointment" className="secondary-button min-h-11 px-4 py-2">
                <Plus className="h-4 w-4" />
                New booking
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="empty-state surface-card rounded-[1.5rem]">
                <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300/22" />
                <p>No appointments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <article key={appointment.id} className="surface-card rounded-[1.4rem] p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">{appointment.service?.name || 'Session'}</h3>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(appointment.appointment_date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Clock3 className="h-4 w-4" />
                            {appointment.appointment_time}
                          </span>
                        </div>
                      </div>

                      <span className={getStatusClass(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    {appointment.notes ? (
                      <p className="mt-4 rounded-2xl bg-white/35 px-4 py-3 text-sm leading-6 text-slate-700">
                        {appointment.notes}
                      </p>
                    ) : null}

                    {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                      <div className="mt-4">
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={cancelling === appointment.id}
                          className="danger-button disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <X className="h-4 w-4" />
                          {cancelling === appointment.id ? 'Cancelling...' : 'Cancel appointment'}
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
