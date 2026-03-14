'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Brain, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/profile');
  };

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="form-card glass-dark relative z-10">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <span className="brand-mark">
            <Brain className="h-5 w-5 text-slate-950" />
          </span>
          <div>
            <div className="text-lg font-semibold text-slate-950">Neurosantulan</div>
            <div className="text-sm text-slate-700">Patient portal</div>
          </div>
        </Link>

        <div className="mb-8">
          <span className="section-label">
            <span className="eyebrow-dot" />
            Sign in
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Access your appointments, update your profile, and continue your recovery plan.
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-400/12 px-4 py-3 text-sm text-rose-950">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="field-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="control"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="field-label mb-0">Password</label>
              <Link href="/forgot-password" className="text-sm text-slate-800 transition hover:text-slate-950">
                Forgot password?
              </Link>
            </div>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="control pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700/65 transition hover:text-slate-950"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-700">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-slate-950 underline decoration-slate-950/30 underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
