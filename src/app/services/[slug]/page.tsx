'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Brain, Calendar, Check, Clock3, Stethoscope } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/lib/auth-context';

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug as string;

  const fetchService = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      // Decode the slug (replace hyphens with spaces for matching)
      const serviceName = slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .ilike('name', serviceName)
        .eq('is_active', true)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setService(data);
      } else {
        // Try to find by partial match
        const { data: searchData, error: searchError } = await supabase
          .from('services')
          .select('*')
          .ilike('name', `%${slug}%`)
          .eq('is_active', true)
          .single();
        
        if (searchError) throw searchError;
        if (searchData) {
          setService(searchData);
        } else {
          setError('Service not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching service:', err);
      setError(err.message || 'Failed to load service');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchService();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchService]);

  const handleBookNow = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Redirect to booking page with service pre-selected
    router.push(`/book-appointment?service=${service?.id}`);
  };

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-400/60 border-t-transparent" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="app-shell px-4 py-8 sm:py-10">
        <div className="page-shell">
          <div className="glass-dark rounded-[1.8rem] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/14">
              <X className="h-7 w-7 text-rose-600" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-950">
              {error || 'Service not found'}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              The service you&apos;re looking for doesn&apos;t exist or is no longer available.
            </p>
            <Link href="/" className="primary-button mt-6 inline-flex">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const serviceDetails: Record<string, { benefits: string[]; conditions: string[] }> = {
    'Initial Consultation': {
      benefits: [
        'Comprehensive health history review',
        'Physical assessment and diagnosis',
        'Personalized treatment plan creation',
        'Goal setting for recovery',
      ],
      conditions: [
        'First-time physiotherapy patients',
        'New injuries or pain',
        'Post-surgical rehabilitation needs',
        'Chronic condition assessment',
      ],
    },
    'Follow-up Session': {
      benefits: [
        'Progress monitoring and assessment',
        'Treatment plan adjustments',
        'Exercise progression guidance',
        'Ongoing support and motivation',
      ],
      conditions: [
        'Continuing treatment from initial consultation',
        'Need exercise program updates',
        'Progress check-ins',
      ],
    },
    'Manual Therapy': {
      benefits: [
        'Hands-on pain relief',
        'Improved joint mobility',
        'Reduced muscle tension',
        'Enhanced circulation',
      ],
      conditions: [
        'Joint stiffness',
        'Muscle tightness',
        'Limited range of motion',
        'Soft tissue injuries',
      ],
    },
    'Exercise Therapy': {
      benefits: [
        'Strengthening weakened muscles',
        'Improved flexibility and balance',
        'Pain reduction through movement',
        'Long-term injury prevention',
      ],
      conditions: [
        'Post-injury rehabilitation',
        'Chronic pain management',
        'Post-surgical recovery',
        'Sports performance enhancement',
      ],
    },
    'Electrotherapy': {
      benefits: [
        'Drug-free pain relief',
        'Muscle stimulation and strengthening',
        'Reduced inflammation',
        'Accelerated healing',
      ],
      conditions: [
        'Acute or chronic pain',
        'Muscle weakness',
        'Nerve pain',
        'Swelling and inflammation',
      ],
    },
    'Ultrasound Therapy': {
      benefits: [
        'Deep tissue heating',
        'Improved blood flow',
        'Reduced muscle spasms',
        'Faster tissue healing',
      ],
      conditions: [
        'Deep muscle injuries',
        'Tendonitis',
        'Bursitis',
        'Scar tissue breakdown',
      ],
    },
    'Traction Therapy': {
      benefits: [
        'Spinal decompression',
        'Reduced nerve pressure',
        'Improved spinal alignment',
        'Pain relief for back conditions',
      ],
      conditions: [
        'Herniated discs',
        'Sciatica',
        'Degenerative disc disease',
        'Chronic back pain',
      ],
    },
    'Sports Injury Rehab': {
      benefits: [
        'Sport-specific rehabilitation',
        'Faster return to activity',
        'Injury prevention strategies',
        'Performance optimization',
      ],
      conditions: [
        'Sprains and strains',
        'Tendon injuries',
        'Joint injuries',
        'Overuse injuries',
      ],
    },
  };

  const details = serviceDetails[service.name] || {
    benefits: [
      'Professional assessment and treatment',
      'Personalized care plan',
      'Evidence-based techniques',
      'Ongoing support and guidance',
    ],
    conditions: [
      'Pain management',
      'Mobility improvement',
      'Injury recovery',
      'Preventive care',
    ],
  };

  return (
    <div className="app-shell px-4 py-8 sm:py-10">
      <div className="page-shell">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="secondary-button min-h-11 px-4 py-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <span className="section-label">
              <span className="eyebrow-dot" />
              Services
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{service.name}</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="glass-dark rounded-[1.8rem] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/45">
                  <Stethoscope className="h-7 w-7 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">{service.name}</h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{service.description}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="surface-card rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Clock3 className="h-4 w-4" />
                    <span className="font-medium text-slate-950">{service.duration_minutes} minutes</span>
                  </div>
                </div>
                <div className="surface-card rounded-xl px-4 py-3">
                  <div className="text-sm text-slate-700">
                    <span className="font-medium text-slate-950">₹{service.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-[1.8rem] p-6">
              <h3 className="text-xl font-semibold text-slate-950">Benefits</h3>
              <ul className="mt-4 space-y-3">
                {details.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/14">
                      <Check className="h-3 w-3 text-emerald-700" />
                    </div>
                    <span className="text-sm leading-6 text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-dark rounded-[1.8rem] p-6">
              <h3 className="text-xl font-semibold text-slate-950">Recommended for</h3>
              <ul className="mt-4 space-y-3">
                {details.conditions.map((condition) => (
                  <li key={condition} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-400/14">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    </div>
                    <span className="text-sm leading-6 text-slate-700">{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-[1.8rem] p-6">
              <h3 className="text-lg font-semibold text-slate-950">Ready to book?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Schedule your {service.name.toLowerCase()} session today. Our team will confirm your appointment within 24 hours.
              </p>
              
              <div className="mt-6 space-y-4">
                <button
                  onClick={handleBookNow}
                  className="primary-button w-full"
                >
                  <Calendar className="h-4 w-4" />
                  {user ? 'Book this service' : 'Sign in to book'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <Link href="/contact" className="secondary-button w-full">
                  <MessageSquare className="h-4 w-4" />
                  Have questions?
                </Link>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-900/5 p-4">
                <div className="flex items-start gap-3">
                  <Brain className="mt-0.5 h-5 w-5 text-slate-950" />
                  <div>
                    <p className="text-sm font-medium text-slate-950">What to expect</p>
                    <p className="mt-1 text-xs leading-5 text-slate-700">
                      Arrive 10 minutes early. Wear comfortable clothing. Bring any relevant medical reports or referrals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-[1.8rem] p-6">
              <h3 className="text-lg font-semibold text-slate-950">Other services</h3>
              <OtherServices currentServiceId={service.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OtherServices({ currentServiceId }: { currentServiceId: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .neq('id', currentServiceId)
        .limit(4)
        .order('name');

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(() => {
      void fetchServices();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentServiceId]);

  if (loading) {
    return <div className="text-sm text-slate-700">Loading...</div>;
  }

  return (
    <div className="mt-4 space-y-3">
      {services.map((service) => (
        <Link
          key={service.id}
          href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="block rounded-xl border border-slate-900/8 bg-white/30 p-3 transition hover:bg-white/45"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-950">{service.name}</p>
              <p className="mt-0.5 text-xs text-slate-700">{service.duration_minutes} min • ₹{service.price}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-700" />
          </div>
        </Link>
      ))}
    </div>
  );
}

// Helper component for MessageSquare icon since it's used above
function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
