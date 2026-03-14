'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Check, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="app-shell flex items-center justify-center px-4 py-10">
        <div className="form-card glass-dark text-center">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.6rem] bg-emerald-400/14">
            <Check className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Password reset successful</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Link href="/login" className="primary-button mt-7 inline-flex">
            <ArrowRight className="h-4 w-4" />
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="form-card glass-dark relative z-10">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <span className="brand-mark">
            <Brain className="h-5 w-5 text-slate-950" />
          </span>
          <div>
            <div className="text-lg font-semibold text-slate-950">Neurosantulan</div>
            <div className="text-sm text-slate-700">Set new password</div>
          </div>
        </Link>

        <div className="mb-8">
          <span className="section-label">
            <span className="eyebrow-dot" />
            New password
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Create a new password</h1>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Choose a strong password to keep your account secure.
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-400/12 px-4 py-3 text-sm text-rose-950">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="field-label">New password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="control pr-12"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700/65 transition hover:text-slate-950"
              >
                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Confirm password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="control pr-12"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700/65 transition hover:text-slate-950"
              >
                {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Updating password...' : 'Update password'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-700">
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-slate-950 underline decoration-slate-950/30 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="app-shell flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-400/60 border-t-transparent" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
