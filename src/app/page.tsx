"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.to(".hero-title", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.to(".hero-subtitle", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.to(".hero-btn", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.6,
      });

      gsap.to(".hero-card", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.8,
      });

      // Feature cards animation
      gsap.to(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      });

      // Stats animation
      gsap.to(".stat-card", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.1,
      });

      // Abstract shapes animation
      gsap.to(".abstract-shape-1", {
        x: 100,
        y: -50,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".abstract-shape-2", {
        x: -80,
        y: 60,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".abstract-shape-3", {
        x: 60,
        y: -80,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen abstract-bg relative overflow-hidden">
      {/* Abstract Background Shapes */}
      {/* Abstract Background Shapes */}
      <div className="abstract-shape w-96 h-96 bg-gradient-to-br from-orange-400 to-orange-600 top-20 -left-48"></div>
      <div className="abstract-shape w-80 h-80 bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 top-1/3 -right-40"></div>
      <div className="abstract-shape w-72 h-72 bg-gradient-to-br from-orange-300 to-purple-blue-400 bottom-20 left-1/4"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-blue-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg logo-morph">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <span className="text-blue-950 font-bold text-xl tracking-wider gradient-animate">NEURO SANTULAN</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>
              <Link href="/login" className="btn-primary px-6 py-3 text-sm">Login</Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className={`w-6 h-0.5 bg-blue-950 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-blue-950 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-blue-950 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-enhanced border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block nav-link text-lg" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#about" className="block nav-link text-lg" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a href="#contact" className="block nav-link text-lg" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
              <Link href="/login" className="block btn-primary text-center text-lg" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block mb-8 px-6 py-3 glass-card rounded-full">
              <span className="text-blue-900 text-sm font-medium">🧠 Advanced Neuroscience Solutions</span>
            </div>
            <h1 className="hero-title opacity-0 translate-y-[100px] text-4xl md:text-6xl lg:text-8xl font-bold text-blue-950 mb-6 md:mb-8 leading-tight">
              Balance Your Mind,
              <br />
              <span className="gradient-animate">Transform Your Life</span>
            </h1>
            <p className="hero-subtitle opacity-0 translate-y-[50px] text-lg md:text-xl text-blue-900/80 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-4">
              Discover the power of neuroscience-based wellness solutions. NEURO SANTULAN combines cutting-edge research with holistic approaches to help you achieve mental clarity and emotional balance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Link href="/login" className="hero-btn opacity-0 translate-y-[30px] btn-primary btn-smart text-base md:text-lg text-white w-full sm:w-auto text-center">Start Your Journey</Link>
              <a href="#features" className="hero-btn opacity-0 translate-y-[30px] btn-outline btn-smart text-base md:text-lg w-full sm:w-auto text-center">Learn More</a>
            </div>
          </div>

          {/* Hero Cards */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hero-card opacity-0 translate-y-[60px] glass-card rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-500 smart-hover">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center micro-bounce">
                <span className="text-3xl">🧬</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-3">Brain Science</h3>
              <p className="text-blue-900/70">Evidence-based approaches backed by neuroscience research</p>
            </div>

            <div className="hero-card opacity-0 translate-y-[60px] glass-card rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-500 smart-hover">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center micro-bounce">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-3">Quick Results</h3>
              <p className="text-blue-900/70">Experience noticeable improvements in just weeks</p>
            </div>

            <div className="hero-card opacity-0 translate-y-[60px] glass-card rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-500 smart-hover">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-300 to-purple-blue-400 flex items-center justify-center micro-bounce">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-3">Personalized</h3>
              <p className="text-blue-900/70">Tailored solutions designed for your unique needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-blue-950 mb-6">
              Our Core <span className="gradient-animate">Features</span>
            </h2>
            <p className="text-blue-900/70 text-xl max-w-2xl mx-auto">
              Comprehensive solutions designed to enhance your mental wellness and cognitive performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card opacity-0 translate-y-[80px] group smart-hover">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                <span className="text-3xl">🧘</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-4">Mindfulness Training</h3>
              <p className="text-blue-900/70 leading-relaxed">
                Learn proven meditation and mindfulness techniques to reduce stress and improve focus.
              </p>
            </div>

            <div className="feature-card opacity-0 translate-y-[80px] group smart-hover">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-4">Cognitive Assessment</h3>
              <p className="text-blue-900/70 leading-relaxed">
                Comprehensive brain function analysis to understand your cognitive strengths and areas for improvement.
              </p>
            </div>

            <div className="feature-card opacity-0 translate-y-[80px] group smart-hover">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-300 to-purple-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 micro-bounce">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-4">Neurofeedback</h3>
              <p className="text-blue-900/70 leading-relaxed">
                Real-time brain activity monitoring to help you gain control over your mental states.
              </p>
            </div>

            <div className="feature-card opacity-0 translate-y-[80px] group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-4">Expert Guidance</h3>
              <p className="text-blue-900/70 leading-relaxed">
                Access to certified neuroscientists and mental health professionals for personalized support.
              </p>
            </div>

            <div className="feature-card opacity-0 translate-y-[80px] group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-blue-500 to-purple-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-4">Mobile App</h3>
              <p className="text-blue-900/70 leading-relaxed">
                Track your progress and access exercises anytime, anywhere with our companion app.
              </p>
            </div>

            <div className="feature-card opacity-0 translate-y-[80px] group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-blue-950 text-2xl font-bold mb-4">Community Support</h3>
              <p className="text-blue-900/70 leading-relaxed">
                Connect with like-minded individuals on similar journeys toward mental wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} id="about" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-blue-950 mb-8">
                Why Choose <span className="gradient-text">NEURO SANTULAN</span>?
              </h2>
              <p className="text-blue-900/80 text-xl mb-10 leading-relaxed">
                At NEURO SANTULAN, we believe that everyone deserves access to cutting-edge neuroscience solutions for mental wellness. Our approach combines the latest research with practical, actionable strategies.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-blue-950 font-bold text-lg mb-2">Science-Backed Methods</h4>
                    <p className="text-blue-900/70">All our programs are based on peer-reviewed neuroscience research.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-blue-400 to-purple-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-blue-950 font-bold text-lg mb-2">Holistic Approach</h4>
                    <p className="text-blue-900/70">We address mental, emotional, and physical aspects of wellness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-300 to-purple-blue-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-blue-950 font-bold text-lg mb-2">Proven Results</h4>
                    <p className="text-blue-900/70">Join thousands who have transformed their lives with our programs.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="stat-card opacity-0 scale-80 text-center p-8">
                <div className="text-5xl font-bold gradient-text mb-3">10K+</div>
                <div className="text-blue-900/70">Active Users</div>
              </div>
              <div className="stat-card opacity-0 scale-80 text-center p-8">
                <div className="text-5xl font-bold gradient-text mb-3">95%</div>
                <div className="text-blue-900/70">Satisfaction</div>
              </div>
              <div className="stat-card opacity-0 scale-80 text-center p-8">
                <div className="text-5xl font-bold gradient-text mb-3">50+</div>
                <div className="text-blue-900/70">Expert Coaches</div>
              </div>
              <div className="stat-card opacity-0 scale-80 text-center p-8">
                <div className="text-5xl font-bold gradient-text mb-3">24/7</div>
                <div className="text-blue-900/70">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-12 text-center glow-effect">
            <h2 className="text-5xl md:text-6xl font-bold text-blue-950 mb-8">
              Ready to <span className="gradient-text">Transform</span> Your Mind?
            </h2>
            <p className="text-xl text-blue-900/80 mb-12 max-w-2xl mx-auto">
              Join thousands of people who have already started their journey to mental clarity and emotional balance with NEURO SANTULAN.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/login" className="btn-primary text-lg text-white">Get Started Free</Link>
              <button className="btn-outline text-lg">Schedule a Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-blue-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">N</span>
                </div>
                <span className="text-blue-950 font-bold text-xl tracking-wider">NEURO SANTULAN</span>
              </div>
              <p className="text-blue-900/70">
                Empowering minds through neuroscience-based wellness solutions.
              </p>
            </div>
            <div>
              <h4 className="text-blue-950 font-bold mb-6">Product</h4>
              <ul className="space-y-3 text-blue-900/70">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-blue-950 font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-blue-900/70">
                <li><a href="#" className="hover:text-orange-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-blue-950 font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-blue-900/70">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-900/10 pt-8 text-center">
            <p className="text-blue-900/50">
              © 2025 NEURO SANTULAN. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
