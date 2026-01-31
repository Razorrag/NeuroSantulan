"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DoctorDashboard() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
      // ... (Animations logic moved here to run AFTER loading)
      gsap.from(".welcome-section", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
      // ... rest of animations
      // Re-triggering animations for content
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
  }, [isLoading]); // Rerun when loading finishes


  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div ref={containerRef} className="min-h-screen abstract-bg relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="abstract-shape w-96 h-96 bg-gradient-to-br from-orange-400 to-orange-600 top-20 -left-48"></div>
      <div className="abstract-shape w-80 h-80 bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 top-1/3 -right-40"></div>
      <div className="abstract-shape w-72 h-72 bg-gradient-to-br from-orange-300 to-purple-blue-400 bottom-20 left-1/4"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-blue-900/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-blue-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg logo-morph">
              <span className="text-white font-bold text-lg md:text-2xl">N</span>
            </div>
            <span className="text-blue-950 font-bold text-lg md:text-xl tracking-wider gradient-animate">NEURO SANTULAN</span>
          </Link>
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
            {/* Quick Search - Desktop */}
            <div className="hidden md:block relative w-64">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 border border-white/10 text-blue-950 placeholder-blue-900/60 text-sm focus:outline-none focus:bg-white/40 transition-all"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-blue-950/60">🔍</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">DS</span>
              </div>
              <span className="text-white font-semibold">Dr. Smith</span>
            </div>
            <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="pt-32 md:pt-28 px-4 md:px-6 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="welcome-section opacity-0 translate-y-[30px] glass-card rounded-3xl p-6 md:p-10 mb-8 md:mb-10 glow-effect">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-950 mb-3 md:mb-4">
              Welcome, <span className="gradient-animate">Dr. Smith</span>
            </h1>
            <p className="text-blue-900/80 text-base md:text-xl">
              Access your patient records, appointments, and clinical tools from your dashboard.
            </p>
          </div>

          {/* Dashboard Stats */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card rounded-3xl p-6 md:p-8 h-48 skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
              {/* Stats Content... (Kept same) */}
              <div className="stat-card opacity-0 scale-80 glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 smart-hover">

                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center micro-bounce">
                    <span className="text-2xl md:text-3xl">👥</span>
                  </div>
                  <span className="text-green-600 text-xs md:text-sm font-bold bg-green-400/20 px-3 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-1 md:mb-2">248</h3>
                <p className="text-blue-900/70 text-sm md:text-base">Total Patients</p>
              </div>

              <div className="stat-card opacity-0 scale-80 glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 smart-hover">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center micro-bounce">
                    <span className="text-2xl md:text-3xl">📅</span>
                  </div>
                  <span className="text-green-600 text-xs md:text-sm font-bold bg-green-400/20 px-3 py-1 rounded-full">+5%</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-1 md:mb-2">18</h3>
                <p className="text-blue-900/70 text-sm md:text-base">Today's Appointments</p>
              </div>

              <div className="stat-card opacity-0 scale-80 glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 smart-hover">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-orange-300 to-purple-blue-400 flex items-center justify-center micro-bounce">
                    <span className="text-2xl md:text-3xl">📋</span>
                  </div>
                  <span className="text-yellow-600 text-xs md:text-sm font-bold bg-yellow-400/20 px-3 py-1 rounded-full">Pending</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-1 md:mb-2">7</h3>
                <p className="text-blue-900/70 text-sm md:text-base">Pending Reports</p>
              </div>

              <div className="stat-card opacity-0 scale-80 glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 smart-hover">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-blue-500 flex items-center justify-center micro-bounce">
                    <span className="text-2xl md:text-3xl">⭐</span>
                  </div>
                  <span className="text-green-600 text-xs md:text-sm font-bold bg-green-400/20 px-3 py-1 rounded-full">+2%</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-1 md:mb-2">4.9</h3>
                <p className="text-blue-900/70 text-sm md:text-base">Patient Rating</p>
              </div>
            </div>
          )}

          {/* Quick Actions Header for filtering context */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-950">Quick Actions</h2>
            {/* Mobile Search visible here */}
            <div className="md:hidden relative w-1/2">
              <input
                type="text"
                className="w-full pl-8 pr-3 py-2 rounded-full bg-white/20 border border-white/10 text-blue-950 placeholder-blue-900/60 text-xs focus:outline-none focus:bg-white/40 transition-all"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-2.5 top-2 text-blue-950/60 text-xs">🔍</span>
            </div>
          </div>


          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="action-card opacity-0 translate-y-[40px] glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                <span className="text-4xl">➕</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">Add New Patient</h3>
              <p className="text-white/70">Register a new patient and create their medical profile.</p>
            </div>

            <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">View Reports</h3>
              <p className="text-white/70">Access and review patient assessment reports.</p>
            </div>

            <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group smart-hover">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-300 to-purple-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">Schedule</h3>
              <p className="text-white/70">Manage your appointments and calendar.</p>
            </div>

            <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">Messages</h3>
              <p className="text-white/70">Communicate with patients and colleagues.</p>
            </div>

            <div className="action-card glass-card rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-blue-500 to-purple-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🧠</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">Neuro Assessments</h3>
              <p className="text-white/70">Create and manage cognitive assessments.</p>
            </div>

            <div className="action-card opacity-0 translate-y-[40px] glass-card rounded-3xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">⚙️</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-3">Settings</h3>
              <p className="text-blue-900/70">Configure your account and preferences.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <Link href="/" className="flex flex-col items-center gap-1 text-blue-950 opacity-100">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-blue-900/60 hover:text-orange-500">
          <span className="text-2xl">👥</span>
          <span className="text-[10px] font-medium">Patients</span>
        </Link>
        <div className="w-12 h-12 -mt-8 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center shadow-lg border-4 border-white">
          <span className="text-2xl text-white">➕</span>
        </div>
        <Link href="#" className="flex flex-col items-center gap-1 text-blue-900/60 hover:text-orange-500">
          <span className="text-2xl">📅</span>
          <span className="text-[10px] font-medium">Schedule</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-blue-900/60 hover:text-orange-500">
          <span className="text-2xl">⚙️</span>
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </div>
      </div>
    </ProtectedRoute>
  );
}
