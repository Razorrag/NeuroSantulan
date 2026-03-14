'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Check, Clock3, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Store inquiry in database (you'll need to create an inquiries table)
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccess(true);
    setLoading(false);
    toast.success('Message sent successfully!');
  };

  if (success) {
    return (
      <div className="app-shell flex items-center justify-center px-4 py-10">
        <div className="form-card glass-dark text-center">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.6rem] bg-emerald-400/14">
            <Check className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Message sent</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="primary-button">Back home</Link>
            <Link href="/book-appointment" className="secondary-button">Book appointment</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell px-4 py-8 sm:py-10">
      <div className="page-shell">
        <div className="mb-10">
          <span className="section-label">
            <span className="eyebrow-dot" />
            Contact us
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Get in touch</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
            Have questions about our services? Need help booking an appointment? We&apos;re here to help.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <div className="glass-dark rounded-[1.8rem] p-6">
              <h2 className="text-xl font-semibold text-slate-950">Contact information</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Reach out through any of these channels and we&apos;ll respond as soon as possible.
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/45">
                    <MapPin className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">Clinic location</p>
                    <p className="mt-1 text-sm text-slate-700">
                      123 Wellness Street, Health District<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/45">
                    <Phone className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">Phone</p>
                    <p className="mt-1 text-sm text-slate-700">
                      <a href="tel:+919876543210" className="transition hover:text-slate-950">+91 98765 43210</a>
                    </p>
                    <p className="text-xs text-slate-500">Mon-Sat, 9:00 AM - 7:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/45">
                    <Mail className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">Email</p>
                    <p className="mt-1 text-sm text-slate-700">
                      <a href="mailto:info@neurosantulan.com" className="transition hover:text-slate-950">info@neurosantulan.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/45">
                    <Clock3 className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">Clinic hours</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: By appointment only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-[1.8rem] p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-950">Need an appointment?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Book your session online in just a few clicks.
              </p>
              <Link href="/book-appointment" className="primary-button mt-4 inline-flex">
                <Calendar className="h-4 w-4" />
                Book now
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-dark rounded-[1.8rem] p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-950">Send us a message</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Fill out the form below and we&apos;ll respond within 24-48 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="form-group">
                  <label className="field-label">Name</label>
                  <div className="input-wrapper">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="control"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Email</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="control"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="form-group">
                  <label className="field-label">Phone (optional)</label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="control"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="control control--no-icon"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General inquiry</option>
                    <option value="appointment">Help with booking</option>
                    <option value="billing">Billing question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Message</label>
                <div className="input-wrapper">
                  <MessageSquare className="input-icon top-4" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="control min-h-[8rem] resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send message'}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
