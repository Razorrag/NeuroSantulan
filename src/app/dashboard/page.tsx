"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function PatientDashboard() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    // Simulate Data Loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't animate if loading

    const ctx = gsap.context(() => {
      gsap.from(".welcome-section", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".stat-card", {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
        delay: 0.2,
      });

      gsap.from(".action-card", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <div ref={containerRef} className="min-h-screen abstract-bg relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="abstract-shape w-96 h-96 bg-gradient-to-br from-orange-400 to-orange-600 top-20 -left-48"></div>
        <div className="abstract-shape w-80 h-80 bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 top-1/3 -right-40"></div>
        <div className="abstract-shape w-72 h-72 bg-gradient-to-br from-orange-300 to-purple-blue-400 bottom-20 left-1/4"></div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-blue-900/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-blue-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg logo-morph">
                <span className="text-white font-bold text-lg md:text-2xl">N</span>
              </div>
              <span className="text-blue-950 font-bold text-lg md:text-xl tracking-wider gradient-animate">NEURO SANTULAN</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-blue-950 font-semibold">{profile?.full_name || user?.email}</p>
                <p className="text-blue-900/70 text-sm">Patient</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {(profile?.full_name || user?.email || "User").charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="pt-32 md:pt-28 px-4 md:px-6 pb-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="welcome-section opacity-0 translate-y-[30px] glass-card rounded-3xl p-6 md:p-10 mb-8 md:mb-10 glow-effect">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-950 mb-3 md:mb-4">
                Welcome, <span className="gradient-animate">{profile?.full_name || "Patient"}</span>
              </h1>
              <p className="text-blue-900/80 text-base md:text-xl">
                Track your progress and manage your wellness journey from your dashboard.
              </p>
            </div>

            {/* Dashboard Stats */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="glass-card rounded-3xl p-6 md:p-8">
                    <div className="animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded-2xl mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                <div className="stat-card opacity-0 scale-80 glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 smart-hover">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center micro-bounce">
                      <span className="text-2xl md:text-3xl">📊</span>
                    </div>
                    <span className="text-green-600 text-xs md:text-sm font-bold bg-green-400/20 px-3 py-1 rounded-full">+15%</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-1 md:mb-2">12</h3>
                  <p className="text-blue-900/70 text-sm md:text-base">Assessments</p>
                </div>

                <div className="stat-card opacity-0 scale-80 glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 smart-hover">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center micro-bounce">
                      <span className="text-2xl md:text-3xl">📅</span>
                    </div>
                    <span className="text-blue-600 text-xs md:text-sm font-bold bg-blue-400/20 px-3 py-1 rounded-full">Next: Today</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-1 md:mb-2">3</h3>
                  <p className="text-blue-900/70 text-sm md:text-base">Upcoming</p>
                </div>

                <div className="stat-card opacity-0 scale-80 glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 smart-hover">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-orange-300 to-purple-blue-400 flex items-center justify-center micro-bounce">
                      <span className="text-2xl md:text-3xl">🎯</span>
                    </div>
                    <span className="text-green-600 text-xs md:text-sm font-bold bg-green-400/20 px-3 py-1 rounded-full">Good</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-1 md:mb-2">85%</h3>
                  <p className="text-blue-900/70 text-sm md:text-base">Progress</p>
                </div>

                <div className="stat-card opacity-0 scale-80 glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 smart-hover">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-blue-500 flex items-center justify-center micro-bounce">
                      <span className="text-2xl md:text-3xl">⭐</span>
                    </div>
                    <span className="text-yellow-600 text-xs md:text-sm font-bold bg-yellow-400/20 px-3 py-1 rounded-full">Active</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-1 md:mb-2">2</h3>
                  <p className="text-blue-900/70 text-sm md:text-base">Treatment Plans</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="action-card opacity-0 translate-y-[40px] glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                  <span className="text-4xl">🧠</span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Take Assessment</h3>
                <p className="text-white/70">Complete a new cognitive assessment.</p>
              </div>

              <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                  <span className="text-4xl">📋</span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">View Progress</h3>
                <p className="text-white/70">Track your wellness journey.</p>
              </div>

              <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-300 to-purple-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                  <span className="text-4xl">📅</span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Book Appointment</h3>
                <p className="text-white/70">Schedule your next consultation.</p>
              </div>

              <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Messages</h3>
                <p className="text-white/70">Communicate with your doctor.</p>
              </div>

              <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-blue-500 to-purple-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                  <span className="text-4xl">📖</span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Resources</h3>
                <p className="text-white/70">Access learning materials.</p>
              </div>

              <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                  <span className="text-4xl">⚙️</span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Settings</h3>
                <p className="text-white/70">Manage your account preferences.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass-enhanced border-t border-blue-900/10 z-40">
          <div className="grid grid-cols-5 gap-1 p-2">
            <button className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-xl">🏠</span>
              <span className="text-xs text-blue-900/70">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-xl">📊</span>
              <span className="text-xs text-blue-900/70">Progress</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-xl">🧠</span>
              <span className="text-xs text-blue-900/70">Assess</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-xl">💬</span>
              <span className="text-xs text-blue-900/70">Messages</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-xl">👤</span>
              <span className="text-xs text-blue-900/70">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
