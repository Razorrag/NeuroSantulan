'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  Filter,
  Search,
  Users,
  X,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@supabase/supabase-js';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Skeleton, StatCardSkeleton, AppointmentSkeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

interface Appointment {
  id: string;
  user_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string | null;
  service?: {
    name: string;
  };
  user?: {
    username: string;
    email: string;
  };
}

const statusFilters = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const;
type StatusFilter = typeof statusFilters[number];

export default function AdminPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'users'>('appointments');
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  
  // Filtering and search
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && userProfile?.role !== 'admin') {
      router.push('/profile');
    }
  }, [user, userProfile, authLoading, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usersData) setUsers(usersData);
    if (usersError) toast.error('Failed to load users');

    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        *,
        service:services(name),
        user:users(username, email)
      `)
      .order('appointment_date', { ascending: false });

    if (appointmentsData) setAppointments(appointmentsData);
    if (appointmentsError) toast.error('Failed to load appointments');

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && userProfile?.role === 'admin') {
      const timeoutId = setTimeout(() => {
        void fetchData();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [user, userProfile, fetchData]);

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    setUpdating(prev => new Set(prev).add(appointmentId));
    const { error } = await supabase.from('appointments').update({ status }).eq('id', appointmentId);
    
    if (error) {
      toast.error('Failed to update appointment');
    } else {
      toast.success(`Appointment ${status}`);
      await fetchData();
    }
    setUpdating(prev => {
      const next = new Set(prev);
      next.delete(appointmentId);
      return next;
    });
  };

  const handleBulkUpdate = async (status: string) => {
    if (selectedAppointments.size === 0) return;
    
    setUpdating(selectedAppointments);
    
    for (const id of selectedAppointments) {
      await supabase.from('appointments').update({ status }).eq('id', id);
    }
    
    toast.success(`Updated ${selectedAppointments.size} appointments`);
    setSelectedAppointments(new Set());
    await fetchData();
    setUpdating(new Set());
  };

  const toggleAppointmentSelection = (id: string) => {
    setSelectedAppointments(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      const matchesSearch = searchQuery === '' || 
        apt.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [appointments, statusFilter, searchQuery]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pill bg-amber-400/18 text-amber-950';
      case 'confirmed':
        return 'status-pill bg-sky-400/18 text-sky-950';
      case 'completed':
        return 'status-pill bg-emerald-400/18 text-emerald-950';
      case 'cancelled':
        return 'status-pill bg-rose-400/18 text-rose-950';
      default:
        return 'status-pill bg-white/45 text-slate-950';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600';
      case 'confirmed': return 'text-sky-600';
      case 'completed': return 'text-emerald-600';
      case 'cancelled': return 'text-rose-600';
      default: return 'text-slate-600';
    }
  };

  if (authLoading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-400/60 border-t-transparent" />
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Users', 
      value: users.length, 
      icon: Users,
      trend: '+12%',
      trendDirection: 'up' as const,
      color: 'from-violet-500 to-purple-500'
    },
    { 
      label: 'Appointments', 
      value: appointments.length, 
      icon: Calendar,
      trend: '+5%',
      trendDirection: 'up' as const,
      color: 'from-orange-500 to-amber-500'
    },
    { 
      label: 'Pending', 
      value: appointments.filter((item) => item.status === 'pending').length, 
      icon: Clock3,
      trendDirection: 'neutral' as const,
      color: 'from-amber-500 to-orange-500'
    },
    { 
      label: 'Completed', 
      value: appointments.filter((item) => item.status === 'completed').length, 
      icon: CheckCircle2,
      trend: '+18%',
      trendDirection: 'up' as const,
      color: 'from-emerald-500 to-green-500'
    },
  ];

  return (
    <div className="app-shell px-4 py-8 sm:py-10">
      <div className="page-shell">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              className="brand-mark"
              whileHover={{ scale: 1.05, rotate: -5 }}
            >
              <Brain className="h-5 w-5 text-slate-950" />
            </motion.span>
            <div>
              <div className="text-lg font-semibold text-slate-950">Neurosantulan</div>
              <div className="text-sm text-slate-700">Admin workspace</div>
            </div>
          </div>
          <Link href="/profile" className="secondary-button">
            <Users className="h-4 w-4" />
            Back to profile
          </Link>
        </header>

        {/* Stats Grid */}
        {loading ? (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-dark rounded-[1.6rem] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <motion.div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </motion.div>
                  {stat.trend && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-1 text-sm font-medium ${getStatusColor(stat.trendDirection === 'up' ? 'completed' : 'pending')}`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </motion.span>
                  )}
                </div>
                <div className="text-3xl font-semibold text-slate-950">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-700">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tabs and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('appointments')}
              className={`min-h-11 rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === 'appointments'
                  ? 'bg-slate-950 text-white shadow-lg'
                  : 'bg-white/40 text-slate-700 hover:bg-white/60'
              }`}
            >
              Appointments
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('users')}
              className={`min-h-11 rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === 'users'
                  ? 'bg-slate-950 text-white shadow-lg'
                  : 'bg-white/40 text-slate-700 hover:bg-white/60'
              }`}
            >
              Users
            </motion.button>
          </div>

          {activeTab === 'appointments' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="input-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="control w-48 pl-10 sm:w-64"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`secondary-button min-h-11 px-4 ${showFilters ? 'bg-slate-950 text-white' : ''}`}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Status Filters */}
        <AnimatePresence>
          {showFilters && activeTab === 'appointments' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="glass-dark rounded-[1.6rem] p-4">
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((status) => (
                    <motion.button
                      key={status}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        statusFilter === status
                          ? 'bg-slate-950 text-white shadow-md'
                          : 'bg-white/40 text-slate-700 hover:bg-white/60'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedAppointments.size > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mb-6 glass rounded-[1.2rem] px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {selectedAppointments.size} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkUpdate('confirmed')}
                    className="secondary-button min-h-9 px-3 py-2 text-sm"
                  >
                    <Check className="h-4 w-4" />
                    Confirm
                  </button>
                  <button
                    onClick={() => handleBulkUpdate('completed')}
                    className="primary-button min-h-9 px-3 py-2 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete
                  </button>
                  <button
                    onClick={() => handleBulkUpdate('cancelled')}
                    className="danger-button min-h-9 px-3 py-2 text-sm"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={() => setSelectedAppointments(new Set())}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatedCard variant="glass-dark" className="p-5 sm:p-6" hover={false}>
          {activeTab === 'appointments' ? (
            loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <AppointmentSkeleton key={i} />
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="empty-state surface-card rounded-[1.5rem] py-12"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No appointments match your filters'
                    : 'No appointments found'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment, index) => (
                  <motion.article
                    key={appointment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 4 }}
                    className={`surface-card rounded-[1.4rem] p-4 sm:p-5 transition-colors ${
                      selectedAppointments.has(appointment.id) ? 'ring-2 ring-slate-950' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAppointments.has(appointment.id)}
                          onChange={() => toggleAppointmentSelection(appointment.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-950">
                            {appointment.service?.name || 'Session'}
                          </h3>
                          <p className="mt-1 text-sm text-slate-700">
                            <span className="font-medium">{appointment.user?.username || 'Unknown user'}</span>
                            {appointment.user?.email && (
                              <span className="text-slate-500"> • {appointment.user.email}</span>
                            )}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(appointment.appointment_date).toLocaleDateString('en-IN', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {appointment.appointment_time}
                            </span>
                          </div>
                          {appointment.notes && (
                            <div className="mt-3 rounded-xl bg-slate-900/5 p-3">
                              <p className="text-xs text-slate-600">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <span className={getStatusClass(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {appointment.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            disabled={updating.has(appointment.id)}
                            className="secondary-button min-h-11 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Check className="h-4 w-4" />
                            Confirm
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            disabled={updating.has(appointment.id)}
                            className="danger-button disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      ) : null}

                      {appointment.status === 'confirmed' ? (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          disabled={updating.has(appointment.id)}
                          className="primary-button min-h-11 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark completed
                        </button>
                      ) : null}
                    </div>
                  </motion.article>
                ))}
              </div>
            )
          ) : loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="surface-card rounded-[1.4rem] p-5 space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state surface-card rounded-[1.5rem] py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600">No users found.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {users.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -2 }}
                  className="surface-card rounded-[1.4rem] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{item.username}</h3>
                      <p className="mt-1 break-all text-sm text-slate-700">{item.email}</p>
                      <p className="mt-2 text-sm text-slate-700">{item.phone || 'No phone'}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Joined {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={item.role === 'admin' ? 'status-pill bg-violet-400/18 text-violet-950' : 'status-pill bg-white/45 text-slate-950'}>
                      {item.role}
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatedCard>
      </div>
    </div>
  );
}
