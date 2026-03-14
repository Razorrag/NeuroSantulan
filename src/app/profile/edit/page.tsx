'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Eye, EyeOff, Lock, Phone, Save, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@supabase/supabase-js';

export default function EditProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Compute initial form data from userProfile using useMemo
  const initialFormData = useMemo(() => ({
    username: userProfile?.username || '',
    phone: userProfile?.phone || '',
    country_code: userProfile?.country_code || '+91',
    date_of_birth: userProfile?.date_of_birth || '',
    gender: userProfile?.gender || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }), [userProfile]);

  const [formData, setFormData] = useState(initialFormData);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    // Validate password change if attempting
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        setLoading(false);
        return;
      }
    }

    try {
      // Update profile in database
      const { error: profileError } = await supabase.from('users').update({
        username: formData.username,
        phone: formData.phone,
        country_code: formData.country_code,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      // Change password if requested
      if (formData.newPassword && formData.currentPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword,
        });

        if (passwordError) {
          setError(passwordError.message);
          setLoading(false);
          return;
        }
      }

      setSuccess('Profile updated successfully!');
      setLoading(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (authLoading) {
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
              Settings
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Edit profile</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="glass-dark rounded-[1.8rem] p-5 sm:p-6">
            {error ? (
              <div className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-400/12 px-4 py-3 text-sm text-rose-950">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mb-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/12 px-4 py-3 text-sm text-emerald-950">
                {success}
              </div>
            ) : null}

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-950">Personal information</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">Update your profile details and account settings.</p>
            </div>

            <div className="space-y-6">
              <div className="form-group">
                <label className="field-label">Username</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="control"
                    placeholder="Your username"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="form-group">
                  <label className="field-label">Country code</label>
                  <select
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    className="control control--no-icon"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Phone</label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="control"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="form-group">
                  <label className="field-label">Date of birth</label>
                  <div className="input-wrapper">
                    <Calendar className="input-icon" />
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="control control--no-icon"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="my-6 border-t border-slate-900/10" />

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-950">Change password</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">Leave blank if you don&apos;t want to change your password.</p>
              </div>

              <div className="form-group">
                <label className="field-label">Current password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="control pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700/65 transition hover:text-slate-950"
                  >
                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="form-group">
                  <label className="field-label">New password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="control pr-12"
                      placeholder="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700/65 transition hover:text-slate-950"
                    >
                      {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Confirm new password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="control pr-12"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700/65 transition hover:text-slate-950"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link href="/profile" className="secondary-button">Cancel</Link>
              <button
                type="submit"
                disabled={loading}
                className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save changes'}
                <Save className="h-4 w-4" />
              </button>
            </div>
          </form>

          <aside className="glass-dark rounded-[1.8rem] p-5 sm:p-6">
            <span className="section-label">
              <span className="eyebrow-dot" />
              Account info
            </span>
            <div className="mt-5 space-y-4">
              <div className="surface-card rounded-[1.25rem] px-4 py-4">
                <p className="text-sm font-medium text-slate-700">Email address</p>
                <p className="mt-1 text-sm text-slate-950">{userProfile?.email}</p>
              </div>
              <div className="surface-card rounded-[1.25rem] px-4 py-4">
                <p className="text-sm font-medium text-slate-700">Account role</p>
                <p className="mt-1 text-sm text-slate-950 capitalize">{userProfile?.role || 'user'}</p>
              </div>
              <div className="rounded-2xl bg-orange-400/12 px-4 py-4">
                <p className="text-sm font-medium text-slate-950">Security tip</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Use a strong password with at least 8 characters, mixing letters, numbers, and symbols.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
