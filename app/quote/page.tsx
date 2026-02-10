'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import QuoteModal from '@/components/QuoteModal';

export default function QuotePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showChecklist, setShowChecklist] = useState(false);
  // Start with modal open
  const [showQuoteModal, setShowQuoteModal] = useState(true);

  const tuneUpChecklist = [
    "Smoke Detector Function & Age",
    "CO Detector Function & Age",
    "Carbon Monoxide Detector Protection",
    "Dryer Vent Lint Accumulation (Fire Prevention)",
    "Dryer Vent Hose Termination Assessment",
    "GFCI Outlet Protection Test",
    "Electrical Panel Visual Inspection",
    "Attic Visual Inspection",
    "Stairway Safety & Lighting",
    "Outlet & Switch Safety Check",
    "Water Heater Condition & Safety",
    "Foundation Perimeter Inspection",
    "Deck & External Stair Condition",
    "Fence Condition (including finishing and sealing)",
    "HVAC System Age & Early Warning",
    "Kitchen Exhaust Grease Management",
    "HVAC Filter Condition & Upgrade",
    "HVAC Secondary Drain Line",
    "Water Heater Loss Protection",
    "Hose Bib Condition",
    "Pool/Spa Leak Detection",
    "Window & Door Seal Assessment",
    "Caulking Assessment & Maintenance",
    "Garage Safety Inspection",
    "Refrigerator Efficiency Check",
    "Water Supply Assessment",
    "Indoor Air Quality Assessment",
    "Exterior Faucet Winterization",
    "Exterior Paint Assessment",
    "Main Water Shut-Off Accessibility",
    "Dishwasher Seal & Leak Prevention"
  ];

  const services = [
    { title: "Gutter Cleaning", description: "Avoid costly water damage by keeping your gutters clear and flowing. We remove debris to protect your roof and foundation.", price: "$90", img: "/services/gutter.jpg" },
    { title: "Plumbing Repairs", description: "Licensed professionals to fix leaks, clogs, and other plumbing issues quickly and reliably.", price: "$105", img: "/services/plumbing.jpg" },
    { title: "Pressure Washing", description: "Restore your home's curb appeal. From driveways to patios, we blast away dirt, grime, and years of buildup.", price: "$65", img: "/services/pressure.jpg" },
    { title: "Window Washing", description: "Crystal-clear views, inside and out. We leave your windows sparkling and streak-free.", price: "$60", img: "/services/window.jpg" },
    { title: "Handyman", description: "From minor repairs to bigger fixes, our handymen handle it all so you don't have to.", price: "$75", img: "/services/handyman.jpg" },
    { title: "Electrical Repairs", description: "Licensed electricians for outlets, switches, fixtures, and other electrical needs.", price: "$69", img: "/services/electrical.jpg" },
    { title: "Home TuneUp", description: "Our signature 30-point inspection catches small issues before they become costly repairs.", price: "$149", img: "/services/tuneup.jpg" },
    { title: "Pest Control", description: "Protect your home and family. Effective pest management for lasting peace of mind.", price: "$95", img: "/services/pest.jpg" },
    { title: "Trash Bin Cleaning", description: "Eliminate odors and bacteria with our deep-clean bin service. Fresh and sanitized every time.", price: "$30", img: "/services/trashbin.jpg" },
    { title: "Holiday Lights", description: "Spread the holiday cheer without the hassle. We install and take down your lights with care.", price: "$150", img: "/services/holiday.jpg" },
  ];

  const testimonials = [
    { name: "Sarah M.", location: "Glendale", text: "Handld has been a game-changer for our home. From gutter cleaning to our holiday lights, they handle everything with such professionalism. It's like having a home maintenance team on speed dial!" },
    { name: "Mike T.", location: "Pasadena", text: "I used to spend my weekends doing home repairs. Now I just text Handld and it's done. The annual plan pays for itself in peace of mind alone." },
    { name: "Jennifer L.", location: "La Cañada", text: "Their Home TuneUp found a water heater issue we had no idea about. Saved us from what could have been a disaster. Can't recommend them enough!" },
    { name: "David K.", location: "South Pasadena", text: "Professional, punctual, and fairly priced. Handld takes care of our pressure washing, window cleaning, and random handyman tasks throughout the year." },
  ];

  const faqs = [
    { q: "What areas do you service?", a: "We currently service Glendale, La Cañada, Pasadena, San Marino, and South Pasadena." },
    { q: "How does the Annual Plan work?", a: "Our Annual Plan gives you priority scheduling, discounted rates on all services, and a dedicated home manager who knows your property. You get proactive reminders for seasonal maintenance and exclusive access to our emergency response team." },
    { q: "Are your technicians licensed and insured?", a: "Yes! All our technicians are fully licensed, insured, and background-checked. We only hire experienced professionals who meet our high standards." },
    { q: "What's included in the Home TuneUp?", a: "Our comprehensive 30-point inspection covers everything from HVAC systems and water heaters to smoke detectors and foundation checks. We identify potential issues before they become costly repairs." },
    { q: "Can I book individual services without an Annual Plan?", a: "Absolutely! While our Annual Plan offers the best value, you can book any service individually through our website or by calling us." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleCTA = () => setShowQuoteModal(true);

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');

        .font-display {
          font-family: 'Libre Baskerville', Georgia, serif;
        }
        .font-body {
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .cta-button {
          background-color: #2A54A1;
          color: white;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 4px 4px 0px #1a3a6e;
        }
        .cta-button:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #1a3a6e;
        }
        .cta-button:disabled {
          background-color: #9ca3af;
          box-shadow: 4px 4px 0px #6b7280;
          cursor: not-allowed;
        }
        .shadow-retro {
          box-shadow: 6px 6px 0px rgba(42, 84, 161, 0.3);
        }
      `}</style>

      <div className="bg-[#FFFFF2] text-[#2A54A1]">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFF2] border-b-2 border-[#2A54A1]/20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
            <Image
              src="/logo.png"
              alt="Handld Home"
              width={160}
              height={80}
              className="h-16 md:h-20 w-auto"
            />
            <div className="flex gap-6 md:gap-8 items-center font-body font-medium">
              <a href="#services" className="text-[#2A54A1] hover:opacity-70 transition-opacity text-sm md:text-base">Services</a>
              <a href="#how-it-works" className="text-[#2A54A1] hover:opacity-70 transition-opacity text-sm md:text-base">How It Works</a>
              <button onClick={handleCTA} className="cta-button text-sm md:text-base">
                Get a Quote
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-4 md:px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Home ownership,<br />
                  <span className="text-[#2A54A1]">Handld.</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-[#2A54A1]/80 mb-8 max-w-xl mx-auto lg:mx-0">
                  We handle the repairs, maintenance, and to-dos so you can enjoy your home instead of working on it.
                </p>
                <button onClick={handleCTA} className="cta-button text-lg">
                  Get Started Today
                </button>
              </div>
              <div className="lg:w-1/2 relative w-full max-w-xl lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-retro border-4 border-[#2A54A1]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto"
                    poster="/hero-poster.jpg"
                  >
                    <source src="/hero-video.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 bg-[#2A54A1]/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Our Services</h2>
            <p className="font-body text-center text-[#2A54A1]/70 mb-12 max-w-2xl mx-auto">
              From routine maintenance to unexpected repairs, we've got your home covered.
            </p>
            <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-6" style={{ width: 'max-content' }}>
                {services.map((service, i) => (
                  <div key={i} className="bg-white rounded-xl border-2 border-[#2A54A1] shadow-retro overflow-hidden flex-shrink-0 w-72 md:w-80">
                    <div className="relative h-48">
                      <Image
                        src={service.img}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 288px, 320px"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display text-xl font-bold">{service.title}</h3>
                        <span className="font-body font-bold text-[#2A54A1] whitespace-nowrap ml-2">from {service.price}</span>
                      </div>
                      <p className="font-body text-[#2A54A1]/70 text-sm">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Home TuneUp Section */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#2A54A1] text-white rounded-2xl p-8 md:p-12 shadow-retro border-4 border-[#1a3a6e]">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                    The Handld Home TuneUp
                  </h2>
                  <p className="font-body text-white/90 text-lg mb-6">
                    Our signature 30-point inspection catches small issues before they become costly repairs.
                    Like a physical for your home.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleCTA} className="bg-white text-[#2A54A1] px-8 py-4 rounded-full font-bold hover:bg-[#FFFFF2] transition-colors">
                      Book Your TuneUp — $149
                    </button>
                    <button
                      onClick={() => setShowChecklist(!showChecklist)}
                      className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
                    >
                      {showChecklist ? 'Hide' : 'See'} Full Checklist
                    </button>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="font-display text-4xl font-bold mb-2">30</div>
                      <div className="font-body text-white/80">Point Inspection</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="font-display text-4xl font-bold mb-2">2hr</div>
                      <div className="font-body text-white/80">Average Time</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="font-display text-4xl font-bold mb-2">$149</div>
                      <div className="font-body text-white/80">Flat Rate</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="font-display text-4xl font-bold mb-2">100%</div>
                      <div className="font-body text-white/80">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
              {showChecklist && (
                <div className="mt-8 pt-8 border-t border-white/20">
                  <h3 className="font-display text-xl font-bold mb-4">Full 30-Point Inspection Checklist</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tuneUpChecklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 font-body text-sm text-white/90">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-[#2A54A1]/5 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: "1", title: "Tell Us What You Need", desc: "Fill out our quick form or give us a call. We'll understand your home's needs." },
                { num: "2", title: "Get Your Custom Plan", desc: "We'll create a maintenance plan tailored to your home and budget." },
                { num: "3", title: "Relax, It's Handld", desc: "We handle scheduling, reminders, and service. You just enjoy your home." },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-[#2A54A1] text-white rounded-full flex items-center justify-center font-display text-2xl font-bold mx-auto mb-4 shadow-retro">
                    {step.num}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
                  <p className="font-body text-[#2A54A1]/70">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button onClick={handleCTA} className="cta-button text-lg">
                Get Your Free Quote
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">What Homeowners Say</h2>
            <div className="relative bg-white rounded-2xl border-2 border-[#2A54A1] shadow-retro p-8 md:p-12">
              <div className="text-6xl text-[#2A54A1]/20 font-display absolute top-4 left-6">"</div>
              <div className="relative z-10">
                <p className="font-body text-lg md:text-xl text-[#2A54A1]/80 mb-6 italic">
                  {testimonials[currentTestimonial].text}
                </p>
                <div className="font-body">
                  <span className="font-bold">{testimonials[currentTestimonial].name}</span>
                  <span className="text-[#2A54A1]/60"> — {testimonials[currentTestimonial].location}</span>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === currentTestimonial ? 'bg-[#2A54A1]' : 'bg-[#2A54A1]/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-[#2A54A1]/5 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white rounded-xl border-2 border-[#2A54A1] shadow-retro group">
                  <summary className="font-display font-bold p-6 cursor-pointer list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 font-body text-[#2A54A1]/70">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Your Home Handld?
            </h2>
            <p className="font-body text-lg text-[#2A54A1]/70 mb-8 max-w-2xl mx-auto">
              Join hundreds of homeowners who've reclaimed their weekends. Let us handle the maintenance while you enjoy your home.
            </p>
            <button onClick={handleCTA} className="cta-button text-lg">
              Get Your Free Quote Today
            </button>
            <p className="font-body text-sm text-[#2A54A1]/50 mt-4">
              No commitment required. Get a custom quote in minutes.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2A54A1] text-white py-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <div className="font-display text-2xl font-bold mb-2">Handld Home</div>
                <p className="font-body text-white/70">Professional home maintenance services</p>
              </div>
              <div className="font-body text-white/70 text-center md:text-right">
                <p>Serving Glendale, La Cañada, Pasadena, San Marino & South Pasadena</p>
                <p className="mt-2">
                  <a href="tel:6262987128" className="hover:text-white">(626) 298-7128</a>
                  {' • '}
                  <a href="mailto:hello@handldhome.com" className="hover:text-white">hello@handldhome.com</a>
                </p>
              </div>
            </div>
            <div className="border-t border-white/20 mt-8 pt-8 text-center font-body text-white/50 text-sm">
              <p>© {new Date().getFullYear()} Handld Home Services. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <a href="/privacy" className="hover:text-white">Privacy Policy</a>
                <a href="/terms" className="hover:text-white">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Quote Modal */}
        <QuoteModal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
      </div>
    </>
  );
}
