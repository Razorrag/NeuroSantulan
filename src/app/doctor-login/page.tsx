"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function DoctorLoginPage() {
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".login-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      gsap.to(".form-element", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
      });

      gsap.to(".abstract-shape", {
        scale: 1,
        opacity: 0.3,
        duration: 1.5,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen abstract-bg flex items-center justify-center px-4 md:px-6 py-12 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="abstract-shape scale-0 opacity-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 top-10 -left-48"></div>
      <div className="abstract-shape scale-0 opacity-0 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-br from-orange-400 to-orange-600 bottom-10 -right-40"></div>
      <div className="abstract-shape scale-0 opacity-0 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-purple-blue-300 to-orange-400 top-1/2 left-1/4 hidden md:block"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-blue-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-white font-bold text-3xl">N</span>
            </div>
            <span className="text-blue-950 font-bold text-2xl tracking-wider">NEURO SANTULAN</span>
          </Link>
        </div>

        {/* Doctor Login Card */}
        <div className="login-card opacity-0 translate-y-[50px] scale-95 glass-card rounded-3xl p-6 md:p-10 glow-effect w-full">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center">
              <span className="text-2xl md:text-4xl">👨‍⚕️</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
              Doctor Portal
            </h2>
          </div>
          <p className="text-blue-900/70 text-center mb-10">
            Sign in to access your dashboard
          </p>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-4 opacity-0 translate-y-[20px] form-content">
              <div className="floating-label-group">
                <input
                  type="text"
                  id="doctorId"
                  className="floating-input peer"
                  placeholder=" "
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                />
                <label htmlFor="doctorId" className="floating-label">
                  Doctor ID / Email
                </label>
              </div>

              <div className="floating-label-group">
                <input
                  type="password"
                  id="password"
                  className="floating-input peer"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password" className="floating-label">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1 text-blue-900/60 hover:text-blue-900 transition-colors z-20"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-element opacity-0 translate-y-[20px] flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-blue-900/20 bg-white/50 text-purple-blue-500 focus:ring-purple-blue-500" />
                <span className="text-blue-900/70 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-purple-blue-400 text-sm font-semibold hover:text-purple-blue-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <Link href="/doctor-dashboard" className="form-element opacity-0 translate-y-[20px] block">
              <button
                type="button"
                className="w-full btn-primary text-lg text-white"
              >
                Sign In as Doctor
              </button>
            </Link>
          </form>

          {/* Back to Patient Login */}
          <div className="mt-8 text-center">
            <p className="text-blue-900/70">
              Not a doctor?{" "}
              <Link href="/login" className="text-purple-blue-400 font-bold hover:text-purple-blue-300 transition-colors">
                Patient Login →
              </Link>
            </p>
          </div>
        </div>
      </div >
    </div >
  );
}
