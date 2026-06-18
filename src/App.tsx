import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf, Sun, Droplets, Footprints, Moon, ArrowRight, Check } from 'lucide-react';

export default function App() {
  // Load Beehiiv embed form
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://subscribe-forms.beehiiv.com/v3/loader.js';
    script.setAttribute('data-beehiiv-form', '0917a56b-b200-4d24-99b9-7ea5f5dd9c33');
    script.async = true;
    const container = document.getElementById('beehiiv-embed');
    if (container) {
      container.appendChild(script);
    }
    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, []);

  // Track Beehiiv form submissions via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Beehiiv iframe fires postMessage on successful subscription
      // Origin check: Beehiiv forms come from subscribe-forms.beehiiv.com
      if (!event.origin.includes('beehiiv.com')) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // Beehiiv sends various message types; look for form submission success
        if (
          data?.type === 'beehiiv-form-submit' ||
          data?.type === 'subscription-success' ||
          data?.event === 'subscribe' ||
          (data?.data?.email && event.origin.includes('beehiiv'))
        ) {
          // Fire GA4 event
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'beehiiv_signup', {
              event_category: 'engagement',
              event_label: 'newsletter_signup',
              form_location: window.location.pathname
            });
          }
          console.log('[Analytics] Beehiiv signup tracked');
        }
      } catch {
        // Ignore parse errors — Beehiiv may send non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col font-sans text-earth-900">
      {/* Navigation */}
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="font-serif text-xl md:text-2xl font-medium tracking-wide text-sage-800">
          Kai Makana Health
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-earth-900/70">
          <a href="#about" className="hover:text-sage-600 transition-colors">About</a>
          <a href="#habits" className="hover:text-sage-600 transition-colors">Habits</a>
          <a href="https://kaimakana.gumroad.com/l/sbmvnn" className="hover:text-sage-600 transition-colors">The Guide</a>
        </div>
        <a 
          href="https://kaimakana.gumroad.com/l/sbmvnn" 
          className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 rounded-full transition-colors"
        >
          Get the Guide
        </a>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-sage-100 text-sage-800 text-xs font-medium tracking-wider uppercase mb-4">
              A Return to Balance
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight text-earth-900 max-w-4xl mx-auto">
              Simple, Natural Ways to <br className="hidden md:block" />
              <span className="italic text-sage-700">Take Control</span> of Your Health
            </h1>
            <p className="text-lg md:text-xl text-earth-900/70 max-w-2xl mx-auto font-light leading-relaxed">
              Rediscover your vitality through small, consistent daily habits. No extremes, no overwhelm—just clear, grounded guidance for a healthier you.
            </p>
            <div className="max-w-md mx-auto pt-8 space-y-6">
              {/* Buy Button — Primary CTA */}
              <a
                href="https://kaimakana.gumroad.com/l/sbmvnn"
                data-gumroad-overlay="true"
                data-gumroad-action="buy"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'gumroad_click', {
                      event_category: 'purchase',
                      event_label: 'guide_cta_hero'
                    });
                  }
                }}
                className="block w-full px-8 py-4 text-base font-medium text-white bg-sage-600 hover:bg-sage-700 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Get the Complete Guide — $14.99 <ArrowRight className="w-4 h-4" />
              </a>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-sand-200"></div>
                <span className="text-xs text-earth-900/40 uppercase tracking-wider font-medium">or</span>
                <div className="flex-1 border-t border-sand-200"></div>
              </div>

              {/* Free Lead Magnet */}
              <h2 className="text-xl md:text-2xl font-serif text-earth-900 mb-1">
                Free Kidney Cleanse Guide
              </h2>
              <p className="text-earth-900/60 text-sm font-light">
                A simple, natural drink routine that supports kidney health — enter your email to get it free.
              </p>
              <div id="beehiiv-embed" className="flex justify-center"></div>
              <p className="text-xs text-earth-900/40">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="profile.jpeg" 
                    alt="Kai Makana" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sage-100 rounded-full -z-10 blur-2xl opacity-60"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-sand-200 rounded-full -z-10 blur-2xl opacity-60"></div>
              </div>
              <div className="space-y-8">
                <Leaf className="w-8 h-8 text-sage-400" strokeWidth={1.5} />
                <h2 className="text-3xl md:text-4xl font-serif text-earth-900 leading-tight">
                  Wellness Doesn't Have to Be Complicated
                </h2>
                <div className="space-y-6 text-lg text-earth-900/70 font-light leading-relaxed">
                  <p>
                    At Kai Makana Health, we believe that true well-being is built on consistency, not intensity. In a world full of extreme diets, biohacking trends, and overwhelming advice, we offer a return to the basics.
                  </p>
                  <p>
                    We're here to help you build a foundation of natural, practical habits that fit seamlessly into your everyday life. Whether you're navigating the changes of midlife or simply want to feel more energized and grounded, our approach is designed to support you—gently and sustainably.
                  </p>
                  <div className="pt-4">
                    <p className="font-serif italic text-sage-800 text-xl">— Kai Makana</p>
                    <p className="text-sm text-earth-900/50 uppercase tracking-widest mt-1">Founder, Kai Makana Health</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value / Free Content Section */}
        <section id="habits" className="py-24 px-6 md:px-12 bg-sand-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-earth-900 mb-4">
                4 Simple Habits to Start Today
              </h2>
              <p className="text-lg text-earth-900/70 max-w-2xl mx-auto font-light">
                You don't need a complete lifestyle overhaul to feel better. Begin with these foundational practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {[
                {
                  icon: <Sun className="w-6 h-6 text-sand-600" />,
                  title: "Morning Sunlight",
                  desc: "Step outside for 10-15 minutes each morning. Natural light helps reset your circadian rhythm, boosting your mood and improving your sleep."
                },
                {
                  icon: <Droplets className="w-6 h-6 text-sand-600" />,
                  title: "Hydrate First",
                  desc: "Drink a large glass of water before your morning coffee. It rehydrates your body after a night of rest and gently wakes up your digestion."
                },
                {
                  icon: <Footprints className="w-6 h-6 text-sand-600" />,
                  title: "Walk Daily",
                  desc: "A gentle 20-minute walk, especially after meals, supports healthy digestion, clears the mind, and keeps your joints mobile without strain."
                },
                {
                  icon: <Moon className="w-6 h-6 text-sand-600" />,
                  title: "Unplug Early",
                  desc: "Turn off screens an hour before bed. Read a book or stretch gently to signal to your nervous system that it's time to rest."
                }
              ].map((habit, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-sand-200/50">
                  <div className="w-12 h-12 bg-sand-100 rounded-full flex items-center justify-center mb-6">
                    {habit.icon}
                  </div>
                  <h3 className="text-xl font-serif font-medium text-earth-900 mb-3">{habit.title}</h3>
                  <p className="text-earth-900/70 font-light leading-relaxed">{habit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Email Capture / Lead Magnet Section */}
        <section id="cleanse" className="py-24 px-6 md:px-12 bg-earth-900 text-sand-50 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              The 5-Minute Kidney Cleanse
            </h2>
            <p className="text-sand-50/70 font-light mb-10 text-lg leading-relaxed">
              A simple, natural drink routine that supports kidney health — used for generations.
            </p>
            <div id="beehiiv-embed" className="flex justify-center"></div>
            <p className="text-xs text-sand-50/40 mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>

        {/* Product Section */}
        <section id="guide" className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-5xl mx-auto bg-sage-50 rounded-3xl overflow-hidden shadow-sm border border-sage-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <span className="text-sage-600 font-medium tracking-wider uppercase text-sm mb-4 block">
                  The Everyday Wellness Blueprint
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-earth-900 mb-6 leading-tight">
                  A Practical Guide to Feeling Your Best
                </h2>
                <p className="text-earth-900/70 font-light leading-relaxed mb-8 text-lg">
                  A step-by-step digital guide designed to help you build lasting, natural health habits without the stress. Perfect for those looking to regain energy and balance through sustainable lifestyle changes.
                </p>
                
                <div className="space-y-4 mb-10">
                  <h4 className="font-medium text-earth-900">What's inside:</h4>
                  <ul className="space-y-3">
                    {[
                      "20+ simple natural remedies for skin, digestion, sleep, energy, and stress",
                      "A clear, easy-to-follow morning routine",
                      "A calming nighttime routine to support better rest",
                      "Simple daily habits that help you feel more in control of your health",
                      "Practical strategies for improving sleep naturally",
                      "Grounded ways to reduce stress without overcomplicating your life"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-earth-900/70 font-light">
                        <Check className="w-5 h-5 text-sage-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href="https://kaimakana.gumroad.com/l/sbmvnn" 
                  className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-sage-600 hover:bg-sage-700 rounded-full transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  Download the Guide <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-xs text-earth-900/50 mt-4 text-center sm:text-left">
                  *This guide provides educational wellness information and is not a substitute for medical advice.
                </p>
              </div>
              <div className="bg-sage-200 min-h-[300px] lg:min-h-full relative overflow-hidden flex items-center justify-center p-12">
                {/* Guide Cover Image */}
                <div className="w-full max-w-sm aspect-[3/4] rounded-lg shadow-2xl transform rotate-2 transition-transform hover:rotate-0 duration-500 relative z-10 overflow-hidden border-4 border-white group">
                  <img 
                    src="cover.png" 
                    alt="The Everyday Wellness Blueprint Cover" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-900/90 via-earth-900/20 to-transparent flex flex-col justify-end p-8">
                    <span className="text-white/80 text-xs font-medium tracking-wider uppercase mb-2">Kai Makana Health</span>
                    <h3 className="text-white font-serif text-2xl leading-tight">The Everyday<br/>Wellness Blueprint</h3>
                  </div>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sage-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-sand-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 md:px-12 border-t border-sand-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-xl font-medium text-sage-800">
            Kai Makana Health
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-earth-900/60">
            <a href="#" className="hover:text-sage-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-sage-600 transition-colors">About</a>
            <a href="https://kaimakana.gumroad.com/l/sbmvnn" className="hover:text-sage-600 transition-colors">The Guide</a>
            <a href="#" className="hover:text-sage-600 transition-colors">Privacy Policy</a>
          </div>
          <div className="text-sm text-earth-900/60">
            <a href="mailto:hello@kaimakanahealth.com" className="hover:text-sage-600 transition-colors">
              hello@kaimakanahealth.com
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-sand-100 text-center text-xs text-earth-900/40">
          &copy; {new Date().getFullYear()} Kai Makana Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}