"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const containerRef = useRef(null);

  const checkStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 5) strength++;
    if (pass.length > 9) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    checkStrength(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { email, password, username });
    alert(`${isLogin ? 'Login' : 'Signup'} functionality would be implemented here`);
  };

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
      <div className="abstract-shape scale-0 opacity-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-orange-400 to-orange-600 top-10 -left-20 md:-left-48"></div>
      <div className="abstract-shape scale-0 opacity-0 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 bottom-10 -right-20 md:-right-40"></div>
      <div className="abstract-shape scale-0 opacity-0 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-orange-300 to-purple-blue-400 top-1/2 left-1/4 hidden md:block"></div>

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

        {/* Login Card */}
        <div className="login-card opacity-0 translate-y-[50px] scale-95 glass-card rounded-3xl p-6 md:p-10 glow-effect w-full">
          {!showForgotPassword ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-950 text-center mb-3">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-blue-900/70 text-center mb-10">
                {isLogin
                  ? "Sign in to continue your journey"
                  : "Start your journey to mental wellness"}
              </p>

              {/* Google Sign In */}
              <button 
                onClick={() => alert('Google OAuth would be implemented here')}
                className="form-element opacity-0 translate-y-[20px] w-full flex items-center justify-center gap-3 bg-white text-beige-900 px-6 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 mb-8"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLogin ? "Sign in with Google" : "Sign up with Google"}
              </button>

              {/* Divider */}
              <div className="form-element opacity-0 translate-y-[20px] flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-blue-900/20"></div>
                <span className="text-blue-900/60 text-sm">or continue with</span>
                <div className="flex-1 h-px bg-blue-900/20"></div>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="username"
                      className="floating-input peer"
                      placeholder=" "
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="username" className="floating-label">
                      Full Name
                    </label>
                  </div>
                )}

                <div className="floating-label-group">
                  <input
                    type="email"
                    id="email"
                    className="floating-input peer"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email" className="floating-label">
                    Email Address
                  </label>
                </div>

                <div className="floating-label-group relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="floating-input peer"
                    placeholder=" "
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <label htmlFor="password" className="floating-label">
                    Password
                  </label>

                  {/* Password Toggle */}
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

                  {/* Password Strength Indicator */}
                  {!isLogin && password && (
                    <div className="flex gap-1 mt-2 h-1 px-1 absolute -bottom-3 left-0 w-full">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${passwordStrength >= level
                              ? level <= 2
                                ? "bg-red-400"
                                : level <= 3
                                  ? "bg-orange-400"
                                  : "bg-green-500"
                              : "bg-gray-200"
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div className="form-element opacity-0 translate-y-[20px]">
                    <label htmlFor="confirmPassword" className="block text-blue-950 text-sm font-semibold mb-3">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="input-field"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="form-element opacity-0 translate-y-[20px] flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded-lg border-blue-900/20 bg-white/50 text-orange-500 focus:ring-orange-500" />
                      <span className="text-blue-900/70 text-sm">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-orange-400 text-sm font-semibold hover:text-orange-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="form-element opacity-0 translate-y-[20px] w-full btn-primary text-lg text-white"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>

              {/* Toggle Login/Signup */}
              <p className="form-element opacity-0 translate-y-[20px] text-center text-blue-900/70 mt-8">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-400 font-bold hover:text-orange-300 transition-colors"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </>
          ) : (
            <>
              {/* Forgot Password */}
              <h2 className="text-4xl font-bold text-blue-950 text-center mb-3">
                Forgot Password?
              </h2>
              <p className="text-blue-900/70 text-center mb-10">
                Enter your email address and we'll send you a link to reset your password
              </p>

              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                alert('Password reset link would be sent to your email');
              }}>
                <div className="form-element">
                  <label htmlFor="resetEmail" className="block text-blue-950 text-sm font-semibold mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  className="form-element w-full btn-primary text-lg text-white"
                >
                  Send Reset Link
                </button>
              </form>

              <button
                onClick={() => setShowForgotPassword(false)}
                className="form-element w-full mt-6 text-orange-400 font-bold hover:text-orange-300 transition-colors"
              >
                ← Back to Login
              </button>
            </>
          )}
        </div>

        {/* Doctor Login Link */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-blue-900/70">
            Are you a healthcare professional?{" "}
            <Link href="/doctor-login" className="text-sm text-orange-600 font-bold hover:text-orange-500 transition-colors">
              Doctor Login →
            </Link>
          </p>
          <div>
            <Link href="/" className="text-sm text-blue-800/60 hover:text-blue-800 transition-colors font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
