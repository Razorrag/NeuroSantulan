'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Brain, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
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
            <div className="text-sm text-slate-700">Password recovery</div>
          </div>
        </Link>

        {!sent ? (
          <>
            <div className="mb-8">
              <span className="section-label">
                <span className="eyebrow-dot" />
                Reset password
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Get a reset link</h1>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Enter the email address used for your account and we&apos;ll send recovery instructions.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-400/12 px-4 py-3 text-sm text-rose-950">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="field-label">Email address</label>
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

              <button type="submit" disabled={loading} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Sending link...' : 'Send reset link'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/14">
              <Mail className="h-8 w-8 text-slate-950" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Check your email</h1>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              A password reset link has been sent to <span className="font-medium text-slate-950">{email}</span>.
            </p>
            <Link href="/login" className="secondary-button mt-6 inline-flex">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        )}

        <p className="mt-6 text-sm text-slate-700">
          Remembered your password?{' '}
          <Link href="/login" className="font-medium text-slate-950 underline decoration-slate-950/30 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
