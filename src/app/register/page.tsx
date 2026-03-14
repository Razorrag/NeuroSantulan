'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Brain, Calendar, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    country_code: '+91',
    password: '',
    confirmPassword: '',
    date_of_birth: '',
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      username: formData.username,
      phone: formData.country_code + formData.phone,
      country_code: formData.country_code,
      date_of_birth: formData.date_of_birth || undefined,
      gender: formData.gender || undefined,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/login?registered=true');
  };

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="glass-dark relative z-10 w-full max-w-3xl rounded-[1.8rem] p-6 sm:p-8">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <span className="brand-mark">
            <Brain className="h-5 w-5 text-slate-950" />
          </span>
          <div>
            <div className="text-lg font-semibold text-slate-950">Neurosantulan</div>
            <div className="text-sm text-slate-700">Create your patient account</div>
          </div>
        </Link>

        <div className="mb-8 max-w-2xl">
          <span className="section-label">
            <span className="eyebrow-dot" />
            Registration
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Create an account that is actually easy to fill out.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Clean spacing, clear input sizes, and a layout that stays readable on both desktop and mobile.
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-400/12 px-4 py-3 text-sm text-rose-950">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="form-grid form-grid--2col">
          <div className="form-group">
            <label className="field-label">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input name="username" value={formData.username} onChange={handleChange} className="control" placeholder="Choose a username" required />
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="control" placeholder="Enter your email" required />
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Country code</label>
            <select name="country_code" value={formData.country_code} onChange={handleChange} className="control control--no-icon">
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
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="control" placeholder="Phone number" />
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Date of birth</label>
            <div className="input-wrapper">
              <Calendar className="input-icon" />
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="control" />
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="control control--no-icon">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="field-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="control pr-12"
                placeholder="Create password"
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

          <div className="form-group">
            <label className="field-label">Confirm password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="control"
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <div className="form-group sm:col-span-2 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-slate-950 underline decoration-slate-950/30 underline-offset-4">
                Sign in
              </Link>
            </p>

            <button type="submit" disabled={loading} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
