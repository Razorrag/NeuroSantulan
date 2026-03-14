'use client';

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  Calendar,
  ChevronRight,
  Clock3,
  HeartPulse,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
  Instagram,
  Linkedin,
  Award,
  Quote,
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ScrollProgress } from '@/components/ui/scroll-progress';

const services = [
  {
    icon: Stethoscope,
    title: 'Guided assessment',
    description: 'A structured first session to understand pain, mobility, routine, and recovery goals.',
    href: '/services/guided-assessment',
  },
  {
    icon: HeartPulse,
    title: 'Recovery plans',
    description: 'Clear exercise guidance, posture corrections, and follow-up milestones tailored to the patient.',
    href: '/services/recovery-plans',
  },
  {
    icon: ShieldCheck,
    title: 'Long-term support',
    description: 'Ongoing monitoring and updates so treatment stays useful outside the clinic as well.',
    href: '/services/long-term-support',
  },
];

const highlights = [
  { value: '1:1', label: 'Personal attention' },
  { value: 'Fast', label: 'Booking workflow' },
  { value: 'Clear', label: 'Session planning' },
];

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#approach', label: 'Approach' },
  { href: '#contact', label: 'Contact' },
];

// Memoized components for performance
const ServiceCard = memo(({ service, index }: { service: typeof services[0]; index: number }) => (
  <AnimatedCard
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.08, duration: 0.4 }}
    className="group cursor-pointer"
  >
    <Link href={service.href} className="block">
      <motion.div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors group-hover:bg-white/60"
        style={{
          background: index === 0 
            ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(255, 142, 83, 0.1))'
            : index === 1
            ? 'linear-gradient(135deg, rgba(124, 92, 255, 0.15), rgba(168, 133, 255, 0.1))'
            : 'linear-gradient(135deg, rgba(0, 201, 167, 0.15), rgba(52, 211, 153, 0.1))',
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <service.icon className="h-6 w-6" style={{ color: index === 0 ? '#ff6b35' : index === 1 ? '#7c5cff' : '#00c9a7' }} />
      </motion.div>
      <h3 className="text-xl font-semibold text-slate-950">{service.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{service.description}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-950">
        Learn more
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.span>
      </div>
    </Link>
  </AnimatedCard>
));
ServiceCard.displayName = 'ServiceCard';

const HighlightCard = memo(({ item, index }: { item: typeof highlights[0]; index: number }) => {
  const gradients = [
    'linear-gradient(135deg, rgba(255, 107, 53, 0.08), rgba(255, 142, 83, 0.05))',
    'linear-gradient(135deg, rgba(124, 92, 255, 0.08), rgba(168, 133, 255, 0.05))',
    'linear-gradient(135deg, rgba(0, 201, 167, 0.08), rgba(52, 211, 153, 0.05))',
  ];
  const textColors = ['#ff6b35', '#7c5cff', '#00c9a7'];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="surface-card rounded-[1.4rem] px-4 py-5"
      style={{ background: gradients[index] }}
    >
      <div className="text-2xl font-semibold" style={{ color: textColors[index] }}>{item.value}</div>
      <div className="mt-1 text-sm text-slate-700">{item.label}</div>
    </motion.div>
  );
});
HighlightCard.displayName = 'HighlightCard';

const FeatureItem = memo(({ icon: Icon, title, detail, colorIndex }: { icon: React.ElementType; title: string; detail: string; colorIndex: number }) => {
  const gradients = [
    'linear-gradient(135deg, rgba(255, 107, 53, 0.12), rgba(255, 142, 83, 0.08))',
    'linear-gradient(135deg, rgba(124, 92, 255, 0.12), rgba(168, 133, 255, 0.08))',
    'linear-gradient(135deg, rgba(0, 201, 167, 0.12), rgba(52, 211, 153, 0.08))',
  ];
  const iconColors = ['#ff6b35', '#7c5cff', '#00c9a7'];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ x: 4 }}
      className="flex gap-4 rounded-[1.25rem] border border-slate-900/8 p-4 transition-colors"
      style={{ background: gradients[colorIndex] }}
    >
      <motion.div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: gradients[colorIndex] }}
        whileHover={{ scale: 1.1, rotate: 8 }}
      >
        <Icon className="h-5 w-5" style={{ color: iconColors[colorIndex] }} />
      </motion.div>
      <div>
        <p className="font-medium text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">{detail}</p>
      </div>
    </motion.div>
  );
});
FeatureItem.displayName = 'FeatureItem';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = useCallback((href: string) => {
    setMobileMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="app-shell pb-20">
      <ScrollProgress />
      
      <header className="hero-shell relative z-10 pt-5 sm:pt-7">
        <nav className="glass flex items-center justify-between rounded-[1.6rem] px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <motion.span
              className="brand-mark"
              whileHover={{ scale: 1.05, rotate: -5 }}
            >
              <Brain className="h-5 w-5 text-slate-950" />
            </motion.span>
            <span className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
              Neurosantulan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 text-sm text-slate-700 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative transition hover:text-slate-950 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-400 to-violet-400 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center gap-2 sm:flex">
            <Link href="/login" className="secondary-button min-h-11 px-4 py-2 text-sm sm:text-base">
              Login
            </Link>
            <Link href="/register" className="primary-button min-h-11 px-4 py-2 text-sm sm:text-base">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/45 transition-colors hover:bg-white/60 md:hidden"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass mt-3 rounded-[1.6rem] p-4 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-white/40"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-slate-900/8 pt-3">
                  <Link href="/login" className="secondary-button justify-center">
                    Login
                  </Link>
                  <Link href="/register" className="primary-button justify-center">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="hero-shell relative z-10 mt-10 sm:mt-14">
        {/* Hero Section */}
        <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="max-w-3xl pt-2 sm:pt-4">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="section-label mb-5 inline-flex"
            >
              <span className="eyebrow-dot" />
              Smarter physiotherapy, calmer experience
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl"
            >
              Recovery support that feels modern, clear, and human.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-2xl text-base leading-7 text-slate-800/80 sm:text-lg"
            >
              Neurosantulan helps patients book sessions, stay informed, and follow a more structured recovery path
              without the clutter and confusion of a typical clinic website.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/book-appointment" className="primary-button group">
                Book an appointment
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
              <Link href="#services" className="secondary-button">
                Explore services
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 grid gap-3 sm:grid-cols-3"
            >
              {highlights.map((item, index) => (
                <HighlightCard key={item.label} item={item} index={index} />
              ))}
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-dark rounded-[2rem] p-5 sm:p-6"
          >
            <div className="surface-card rounded-[1.6rem] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-700">Today&apos;s overview</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">Focused care workflow</h2>
                </div>
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="rounded-full bg-emerald-400/16 px-3 py-1 text-xs font-semibold text-emerald-950"
                >
                  Patient-first
                </motion.span>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { icon: Calendar, title: 'Simple booking', detail: 'Choose a session without visual noise or broken spacing.' },
                  { icon: Sparkles, title: 'Cleaner dashboard', detail: 'Appointments, profile details, and actions stay readable on all screens.' },
                  { icon: Clock3, title: 'Visible next steps', detail: 'Important controls remain obvious instead of getting lost in the background.' },
                ].map((item, index) => (
                  <FeatureItem
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    detail={item.detail}
                    colorIndex={index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="services" className="pt-20 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 max-w-2xl"
          >
            <span className="section-label">
              <span className="eyebrow-dot" />
              Services
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              A layout that explains care instead of distracting from it.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">
              Each service card has consistent spacing, readable text contrast, and a clear visual hierarchy.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </section>

        {/* Approach Section */}
        <section id="approach" className="pt-20 sm:pt-24">
          <AnimatedCard variant="glass-dark" className="rounded-[2rem] p-6 sm:p-8" hover={false}>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="section-label">
                  <span className="eyebrow-dot" />
                  Approach
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Designed to be usable before it tries to be impressive.
                </h2>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  'Clear spacing on desktop and mobile',
                  'Buttons sized for real touch targets',
                  'Forms with consistent input depth',
                  'Cards that separate content without clutter',
                ].map((point, index) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    className="surface-card rounded-[1.4rem] px-4 py-5 text-sm leading-7 text-slate-700 cursor-default"
                  >
                    {point}
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </section>

        {/* Contact CTA Section */}
        <section id="contact" className="pt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-[2rem] px-6 py-8 text-center sm:px-8"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Need to get started quickly?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-700">
              Use the patient flow directly. The core pages now share one design system instead of each page fighting the others.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className="primary-button">
                Create account
              </Link>
              <Link href="/login" className="secondary-button">
                Sign in
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Founder Section */}
        <section className="pt-20 sm:pt-24">
          <AnimatedCard variant="glass-dark" className="overflow-hidden" hover={false}>
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-orange-400/20 via-purple-400/20 to-teal-400/20 p-1">
                  <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="text-center p-8"
                    >
                      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-purple-500 shadow-xl">
                        <Award className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-slate-950">Dr. Sachin Goyal</p>
                      <p className="mt-2 text-sm font-medium text-slate-600">Founder & Lead Physiotherapist</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <span className="section-label w-fit">
                  <span className="eyebrow-dot" />
                  About the Founder
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Meet Dr. Sachin Goyal
                </h2>
                
                <div className="mt-6 space-y-4">
                  <p className="text-base leading-7 text-slate-700">
                    Dr. Sachin Goyal is a renowned physiotherapist with over 15 years of experience in neurological rehabilitation and sports injury treatment. He founded Neurosantulan with a vision to make quality physiotherapy accessible to everyone through modern, patient-centric care.
                  </p>
                  <p className="text-base leading-7 text-slate-700">
                    His expertise lies in combining traditional physiotherapy techniques with cutting-edge technology to create personalized treatment plans that deliver faster, longer-lasting results.
                  </p>
                  
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="surface-card rounded-[1.4rem] p-4">
                      <div className="text-3xl font-bold gradient-text">15+</div>
                      <div className="mt-1 text-sm text-slate-700">Years Experience</div>
                    </div>
                    <div className="surface-card rounded-[1.4rem] p-4">
                      <div className="text-3xl font-bold gradient-text">5000+</div>
                      <div className="mt-1 text-sm text-slate-700">Patients Treated</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 hover:shadow-lg"
                    >
                      <Phone className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <a
                      href="mailto:drsachingoyal@neurosantulan.com"
                      className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600 hover:shadow-lg"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                    <a
                      href="https://instagram.com/neurosantulan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:shadow-lg"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedCard>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-900/8 pt-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="brand-mark">
                  <Brain className="h-5 w-5 text-slate-950" />
                </span>
                <span className="text-lg font-semibold text-slate-950">Neurosantulan</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                Modern physiotherapy care that puts patients first. Book your session today and experience the difference.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-950">Quick Links</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/book-appointment" className="text-slate-700 transition hover:text-slate-950">
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-slate-700 transition hover:text-slate-950">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-700 transition hover:text-slate-950">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-slate-700 transition hover:text-slate-950">
                    Patient Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-950">Connect With Us</h3>
              <div className="mt-4 space-y-3">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-700 transition hover:text-slate-950"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/14">
                    <Phone className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span>+91 98765 43210</span>
                </a>
                
                <a
                  href="mailto:info@neurosantulan.com"
                  className="flex items-center gap-3 text-sm text-slate-700 transition hover:text-slate-950"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/14">
                    <Mail className="h-4 w-4 text-sky-600" />
                  </div>
                  <span>info@neurosantulan.com</span>
                </a>
                
                <a
                  href="https://instagram.com/neurosantulan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-700 transition hover:text-slate-950"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-400/20">
                    <Instagram className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>@neurosantulan</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-900/8 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-slate-600">
                © {new Date().getFullYear()} Neurosantulan. All rights reserved.
              </p>
              <p className="text-sm text-slate-600">
                Founded by Dr. Sachin Goyal
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
