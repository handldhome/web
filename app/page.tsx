'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Check, Menu, X, Users, Clock, Shield, CreditCard, MapPin } from 'lucide-react';
import QuoteModal from '@/components/QuoteModal';

export default function Page() {
  const searchParams = useSearchParams();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(searchParams?.get('quote') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { title: "Handyman", description: "From minor repairs to odd jobs around the house, our skilled handymen tackle it all with expertise and care.", price: "$75", img: "/services/handyman.jpg" },
    { title: "Plumbing Repairs", description: "Licensed professionals to fix leaks, clogs, and other plumbing issues quickly and reliably.", price: "$105", img: "/services/plumbing.jpg" },
    { title: "Electrical Repairs", description: "Licensed electricians for outlets, switches, and minor electrical work.", price: "$69", img: "/services/electrical.jpg" },
    { title: "Window Washing", description: "Crystal-clear views and natural light. We clean inside and out, leaving every pane spotless and streak-free.", price: "$175", img: "/services/window.jpg" },
    { title: "Gutter Cleaning", description: "Avoid costly water damage by keeping your gutters clear and flowing. We remove debris to protect your roof and foundation.", price: "$90", img: "/services/gutter.jpg" },
    { title: "Pressure Washing — Home Exterior", description: "Restore your home's curb appeal. We blast away dirt, grime, and years of buildup from siding and exteriors.", price: "$165", img: "/services/pressure.jpg" },
    { title: "Pressure Washing — Driveways & Patios", description: "Transform your driveway and patio areas. Remove oil stains, mold, and weathering for a fresh, clean look.", price: "$65", img: "/services/pressure.jpg" },
    /* TODO: Add image for HVAC Repair & Maintenance */
    { title: "HVAC Repair & Maintenance", description: "Keep your heating and cooling systems running efficiently. Regular maintenance prevents costly breakdowns.", price: "$125", img: "/services/handyman.jpg" },
    { title: "Pest Control", description: "Protect your home from unwanted guests. Safe, effective treatments for common household pests.", price: "$95", img: "/services/handyman.jpg" },
    /* TODO: Add image for Landscaping & Gardening */
    { title: "Landscaping & Gardening", description: "Keep your outdoor spaces beautiful. From lawn care to garden maintenance, we handle it all.", price: "$75", img: "/services/handyman.jpg" },
    { title: "Holiday Lights Install & Take Down", description: "Professional installation and removal of holiday lighting. Make your home festive without the hassle.", price: "$200", img: "/services/holiday.jpg" },
    { title: "Home Tune-Up", description: "Our comprehensive 31-point inspection catches safety hazards and prevents costly repairs before they happen.", price: "$350", img: "/Handyman Notes.jpg" },
    { title: "Outdoor Furniture Cleaning", description: "Restore your patio furniture to like-new condition. We clean and protect all types of outdoor furniture.", price: "$125", img: "/services/furniture.jpg" },
    { title: "Trash Bin Cleaning", description: "Eliminate odors and bacteria from your trash bins. Deep-cleaning service that keeps these areas hygienic and fresh.", price: "$45", img: "/services/bin.jpg" }
  ];

  const testimonials = [
    { text: "I didn't realize how much stress those 'to-dos' were causing until they were gone. Handld feels like a personal assistant for my house. Everything just…gets done!", author: "Keith, Los Angeles" },
    { text: "Finally one company that shows up on time, does great work, and doesn't make me chase them.", author: "Claire, Los Angeles" },
    { text: "I never thought I'd say this about a gutter cleaning, but the whole experience was genuinely enjoyable. Super professional and thoughtful. Feels like a concierge for my home.", author: "Maureen, Los Angeles" },
    { text: "The pricing is transparent, the service is reliable, and I actually enjoy opening my calendar knowing Handld has everything scheduled for me.", author: "David, Los Angeles" },
    { text: "As a busy professional, Handld has been a game-changer. I don't have to think about home maintenance anymore - it just happens.", author: "Jennifer, Los Angeles" },
    { text: "The quality of work is consistently excellent, and their team is always respectful and professional. Worth every penny.", author: "Michael, Los Angeles" }
  ];

  const faqs = [
    { question: "What is Handld?", answer: "Handld is your one-stop home maintenance team. We handle 14+ services — from gutter cleaning to plumbing to pest control — so you don't have to juggle multiple vendors. We're a local company serving Los Angeles with experienced, full-time professionals who treat your home like their own." },
    { question: "Do I have to commit to anything?", answer: "No commitments, no subscriptions. You pay only for the services you request, after they're completed. Book one service or bundle several — it's completely up to you. Cancel anytime, no fees." },
    { question: "How does pricing work?", answer: "We use a simple, transparent pricing model based on your home's attributes — square footage, lot size, and number of stories. You get a flat-rate quote in under a minute, without needing an in-person walkthrough. No surprises, no waiting days for an estimate. Bundle 3+ services and save 30%." },
    { question: "What areas do you service?", answer: "We currently serve Los Angeles. Not sure if you're in our zone? Just reach out and we'll let you know." },
    { question: "Is there a cancellation policy?", answer: "We get it — things change. You can reschedule or cancel appointments up to 24 hours in advance. No fees, no problem." },
    { question: "Will I get reminders before service?", answer: "Yes. We'll send you appointment reminders by text or email, depending on your preferences. You'll also get a heads-up when your technician is en route. Plus, you can view all your upcoming and past appointments in your customer portal." },
    { question: "Who are your service providers?", answer: "Every Handld technician is a W-2 employee (not a subcontractor) with 10+ years of experience in their specific trade. They're background-checked, insured, and trained to treat your home with care. No random strangers — the same trusted team, every time." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCTA = () => setShowQuoteModal(true);
  const handleEmail = () => window.location.href = 'mailto:Concierge@HandldHome.com';

  return (
    <div className="bg-[#FFFFF2] text-[#2A54A1]">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
        .font-display { font-family: 'Libre Baskerville', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-retro { box-shadow: 8px 8px 0px rgba(42, 84, 161, 0.15); }
        .cta-button {
          background: linear-gradient(135deg, #2A54A1 0%, #1e3d7a 100%);
          box-shadow: 0 4px 15px rgba(42, 84, 161, 0.3);
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(42, 84, 161, 0.4);
        }
        .step-card {
          transition: all 0.3s ease;
        }
        .step-card:hover {
          transform: scale(1.05);
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll-left 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFF2] border-b-2 border-[#2A54A1]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <Image src="/logo.png" alt="Handld Home" width={160} height={80} className="h-12 md:h-20 w-auto" />

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 items-center font-body font-medium">
            <a href="#services" className="text-[#2A54A1] hover:opacity-70 transition-opacity">Services</a>
            <a href="#how-it-works" className="text-[#2A54A1] hover:opacity-70 transition-opacity">How It Works</a>
            <a href="/account" className="text-[#2A54A1] hover:opacity-70 transition-opacity">My Account</a>
            <button onClick={handleCTA} className="cta-button text-white px-6 py-2.5 rounded-full font-semibold">Get Quote</button>
          </div>

          {/* Mobile: Get Quote + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={handleCTA} className="cta-button text-white px-4 py-2 rounded-full font-semibold text-sm font-body">Get Quote</button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2A54A1]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFFF2] border-t border-[#2A54A1]/10 px-4 py-4">
            <div className="flex flex-col gap-4 font-body font-medium">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#2A54A1] hover:opacity-70 transition-opacity py-2"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#2A54A1] hover:opacity-70 transition-opacity py-2"
              >
                How It Works
              </a>
              <a
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#2A54A1] hover:opacity-70 transition-opacity py-2"
              >
                My Account
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A54A1]/60 to-[#2A54A1]/40" />
        <div className="relative z-10 text-center text-[#FFFFF2] max-w-5xl mx-auto px-4 md:px-6">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            Home maintenance, handled.
          </h1>
          <p className="font-body text-lg md:text-2xl mb-8 md:mb-10 text-[#FFFFF2]/95">
            One team for everything your home needs. Plan your whole year of maintenance or book a single service — in under a minute.
          </p>
          <button onClick={handleCTA} className="cta-button text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-base md:text-lg font-body font-bold">
            Get My Custom Quote
          </button>
        </div>
      </section>

      {/* THE PROBLEM / EMPATHY SECTION */}
      <section className="py-12 md:py-16 bg-[#FFFFF2]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[#2A54A1]">
            You've got a list. You just haven't gotten around to it.
          </h2>
          <div className="font-body text-base md:text-lg text-[#2A54A1]/80 leading-relaxed space-y-4 max-w-3xl mx-auto">
            <p>
              The gutters that need cleaning. The leaky faucet you've been meaning to fix. The window washing you keep pushing to "next weekend." Sound familiar?
            </p>
            <p>
              Finding someone you trust is exhausting. Waiting days for a quote is frustrating. Coordinating multiple vendors for different jobs? Forget it. And remembering what needs to be done and when — that's a full-time job in itself.
            </p>
            <p className="font-semibold text-[#2A54A1]">
              We built Handld to take all of that off your plate.
            </p>
          </div>
        </div>
      </section>

      {/* WHY HANDLD IS DIFFERENT SECTION */}
      <section className="py-12 md:py-16 bg-[#FBF9F0]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center text-[#2A54A1]">
            Why homeowners switch to Handld
          </h2>
          <p className="font-body text-base md:text-lg text-[#2A54A1]/70 text-center mb-10 max-w-2xl mx-auto">
            Not your typical home services company
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
              <div className="w-12 h-12 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#2A54A1]" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-2 text-[#2A54A1]">One team, one contact</h3>
              <p className="font-body text-sm text-[#2A54A1]/80">Stop juggling five vendors. One call to us covers everything from gutters to plumbing to pest control.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
              <div className="w-12 h-12 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#2A54A1]" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-2 text-[#2A54A1]">Flat, upfront pricing</h3>
              <p className="font-body text-sm text-[#2A54A1]/80">No walkthroughs. No waiting. Get an instant quote based on your home's size and layout — in under a minute, not days.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
              <div className="w-12 h-12 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#2A54A1]" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-2 text-[#2A54A1]">Experienced W-2 employees</h3>
              <p className="font-body text-sm text-[#2A54A1]/80">Every technician has 10+ years in their trade and works directly for Handld. No random subcontractors showing up at your door.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
              <div className="w-12 h-12 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-[#2A54A1]" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-2 text-[#2A54A1]">No commitments</h3>
              <p className="font-body text-sm text-[#2A54A1]/80">Pay only for the services you request, after they're completed. Cancel anytime, no fees. It's that simple.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
              <div className="w-12 h-12 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#2A54A1]" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-2 text-[#2A54A1]">Local to your neighborhood</h3>
              <p className="font-body text-sm text-[#2A54A1]/80">We live and work in LA. Your crew knows your neighborhood, your home styles, your trees.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10 flex flex-col justify-center">
              <p className="font-body text-base text-[#2A54A1] italic">"Peace of mind knowing things are handled — without me having to manage it."</p>
              <p className="font-body text-sm text-[#2A54A1]/60 mt-2">— What our customers tell us</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-8 md:py-12 bg-[#FFFFF2]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center text-[#2A54A1]">How It Works</h2>
          <p className="font-body text-base md:text-lg text-[#2A54A1]/70 text-center mb-10">Get a quote in under a minute. Not 5 days.</p>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="ml-0 mb-6 step-card">
                <div className="bg-gradient-to-br from-white to-[#FBF9F0] p-6 md:p-8 rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 text-[200px] font-display font-bold text-[#2A54A1]/5">01</div>
                  <div className="relative z-10">
                    <div className="bg-[#2A54A1] px-3 py-1 rounded-full inline-block mb-3">
                      <span className="font-display text-xs font-bold text-[#FFFFF2]">Step 1</span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-[#2A54A1]">Tell us about your home</h3>
                    <p className="font-body text-sm md:text-base text-[#2A54A1]">Answer a few quick questions about your home — it takes under a minute. Choose to plan out your whole year of maintenance or just book a single service.</p>
                  </div>
                </div>
              </div>

              <div className="ml-8 md:ml-16 mb-6 step-card">
                <div className="bg-gradient-to-br from-white to-[#FBF9F0] p-6 md:p-8 rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 text-[200px] font-display font-bold text-[#2A54A1]/5">02</div>
                  <div className="relative z-10">
                    <div className="bg-[#2A54A1] px-3 py-1 rounded-full inline-block mb-3">
                      <span className="font-display text-xs font-bold text-[#FFFFF2]">Step 2</span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-[#2A54A1]">Review your instant quote</h3>
                    <p className="font-body text-sm md:text-base text-[#2A54A1]">Get a flat-rate quote instantly — not in days. Pick the services and schedule that work for you. No walkthroughs, no waiting around.</p>
                  </div>
                </div>
              </div>

              <div className="ml-16 md:ml-32 mb-6 step-card">
                <div className="bg-gradient-to-br from-white to-[#FBF9F0] p-6 md:p-8 rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 text-[200px] font-display font-bold text-[#2A54A1]/5">03</div>
                  <div className="relative z-10">
                    <div className="bg-[#2A54A1] px-3 py-1 rounded-full inline-block mb-3">
                      <span className="font-display text-xs font-bold text-[#FFFFF2]">Step 3</span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-[#2A54A1]">We handle the rest</h3>
                    <p className="font-body text-sm md:text-base text-[#2A54A1]">We take care of scheduling, reminders, and coordination. You don't have to think about it — your home maintenance just happens.</p>
                  </div>
                </div>
              </div>

              <div className="ml-24 md:ml-48 step-card">
                <div className="bg-gradient-to-br from-[#2A54A1] to-[#1e3d7a] p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-[#2A54A1]/20 relative overflow-hidden">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-xl p-3 relative">
                      <Image src="/logo.png" alt="Handld" fill className="object-contain p-2" sizes="80px" />
                    </div>
                    <div className="text-[#FFFFF2]">
                      <h3 className="font-display text-xl md:text-2xl font-bold mb-1">Enjoy your weekends</h3>
                      <p className="font-body text-sm md:text-base text-[#FFFFF2]/90">Your home is taken care of. Your time is yours again.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button onClick={handleCTA} className="cta-button text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-body font-bold">Get Started Today</button>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-8 md:py-12 overflow-hidden bg-[#FBF9F0]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 md:mb-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-[#2A54A1]">Everything your home needs. One team.</h2>
          <p className="font-body text-base md:text-lg text-[#2A54A1]">From gutters to gardens, we've got it covered</p>
        </div>
        <div className="relative">
          <div className="flex gap-6 px-6 pb-6 animate-scroll" style={{ width: 'fit-content' }}>
            {[...services, ...services].map((service, idx) => (
              <div key={idx} className="flex-shrink-0 w-80 md:w-96 bg-white rounded-xl overflow-hidden shadow-retro border-2 border-[#2A54A1]/10 hover:shadow-2xl transition-shadow">
                <div className="h-48 md:h-56 bg-gray-200 relative overflow-hidden">
                  <Image src={service.img} alt={service.title} fill className="object-cover" sizes="(max-width: 768px) 320px, 384px" />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-display text-lg md:text-xl font-bold mb-2 text-[#2A54A1]">{service.title}</h3>
                  <p className="font-body text-sm text-[#2A54A1] mb-3 leading-relaxed">{service.description}</p>
                  <div className="font-display text-2xl font-bold text-[#2A54A1]">{service.price}</div>
                  <p className="font-body text-xs text-[#2A54A1]/70 mt-1">starting at</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <button onClick={handleCTA} className="cta-button text-white px-8 md:px-10 py-3 rounded-full text-base md:text-lg font-body font-bold">
            See Pricing for My Home
          </button>
        </div>
      </section>

      {/* BUNDLD & SAVE SECTION */}
      <section className="py-8 md:py-12 bg-[#2A54A1] text-[#FFFFF2] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFFFF2]/10 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">The more you bundle, the more you save</h2>
              <p className="font-body text-lg md:text-xl mb-6">Pick 3 or more services and save 30%. No commitment required — just smart savings for taking care of more at once.</p>
              <div className="bg-[#FFFFF2]/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 mb-6 border-2 border-[#FFFFF2]/20">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <Check className="w-8 h-8" />
                  <span className="font-display text-3xl font-bold">30% Bundle Discount</span>
                </div>
                <p className="font-body text-base">Whether you want to plan your whole year or just need a few things done, Handld works on your terms. Not sure where to start? Check out our pre-packaged bundles.</p>
              </div>
              <button onClick={handleCTA} className="bg-[#FFFFF2] text-[#2A54A1] px-8 md:px-10 py-3 rounded-full text-base md:text-lg font-body font-bold hover:bg-white transition-all transform hover:scale-105 shadow-lg">Build My Bundle</button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-[#FFFFF2]/20 relative h-64 md:h-80">
              <Image src="/bundle-photo.jpg" alt="Bundle Services" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* HOME TUNE-UP SECTION */}
      <section className="py-12 md:py-16 bg-[#FBF9F0]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center">
            {/* Photo - Left */}
            <div className="rounded-2xl overflow-hidden shadow-retro border-2 border-[#2A54A1]/10 order-1 md:order-1 relative h-64 md:h-80">
              <Image src="/Handyman Notes.jpg" alt="Home Tune-Up Inspection" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>

            {/* Description - Middle */}
            <div className="order-2 md:order-2">
              <div className="bg-[#2A54A1] px-4 py-1.5 rounded-full inline-block mb-4">
                <span className="font-body text-sm font-semibold text-[#FFFFF2]">Featured Service</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-[#2A54A1]">Home Tune-Up</h2>
              <p className="font-body text-sm md:text-base text-[#2A54A1] mb-5 leading-relaxed">
                Small issues become big problems. Our comprehensive 31-point inspection catches safety hazards and prevents costly repairs before they happen. You'll receive a detailed photo report with easy booking or trusted vendor referrals for anything that needs attention.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={handleCTA} className="cta-button text-white px-6 py-3 rounded-full text-sm font-body font-bold">
                  Schedule My Tune-Up
                </button>
                <button
                  onClick={() => setShowChecklist(true)}
                  className="border-2 border-[#2A54A1] text-[#2A54A1] px-6 py-3 rounded-full text-sm font-body font-bold hover:bg-[#2A54A1] hover:text-[#FFFFF2] transition-all"
                >
                  View 31-Point Checklist
                </button>
              </div>
            </div>

            {/* 4-Hour Service Block - Right */}
            <div className="order-3 md:order-3">
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-retro border-2 border-[#2A54A1]/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#2A54A1] rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-[#FFFFF2]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#2A54A1]">4-Hour Service Block</h3>
                    <p className="font-body text-xs text-[#2A54A1]/70">31-point inspection + repairs</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2A54A1] mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-[#2A54A1]">Safety systems check (smoke detectors, CO detectors, GFCI outlets)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2A54A1] mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-[#2A54A1]">Fire prevention inspection (dryer vents, electrical panels)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2A54A1] mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-[#2A54A1]">Water damage prevention (hose bibs, seals, shut-offs)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2A54A1] mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-[#2A54A1]">HVAC efficiency assessment</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2A54A1] mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-[#2A54A1]">Minor repairs & adjustments included</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChecklist(true)}
                  className="w-full text-center font-body text-xs font-semibold text-[#2A54A1] hover:underline"
                >
                  + View all 31 checklist items
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="py-8 md:py-12 bg-[#FFFFF2]">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center text-[#2A54A1]">What Our Clients Say</h2>
          <div className="bg-white rounded-2xl p-6 md:p-10 min-h-[180px] flex flex-col justify-center shadow-retro border-2 border-[#2A54A1]/10">
            <p className="font-body text-lg md:text-xl mb-4 text-[#2A54A1] leading-relaxed">"{testimonials[currentTestimonial].text}"</p>
            <p className="font-display text-base md:text-lg font-semibold text-[#2A54A1]">— {testimonials[currentTestimonial].author}</p>
          </div>
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentTestimonial(idx)} className={`h-2.5 rounded-full transition-all ${idx === currentTestimonial ? 'bg-[#2A54A1] w-8' : 'bg-[#2A54A1]/30 w-2.5'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-8 md:py-12 bg-[#FBF9F0]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center text-[#2A54A1]">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-white rounded-xl p-4 md:p-5 shadow-sm border-2 border-[#2A54A1]/10 group">
                <summary className="font-display text-base md:text-lg font-semibold cursor-pointer text-[#2A54A1] hover:text-[#1e3d7a] list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-2xl group-open:rotate-45 transition-transform text-[#2A54A1]">+</span>
                </summary>
                <p className="mt-3 font-body text-sm md:text-base text-[#2A54A1] leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-6">
            <button onClick={handleEmail} className="cta-button text-white px-8 md:px-10 py-3 rounded-full text-base md:text-lg font-body font-bold">Email Us Your Questions</button>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-10 md:py-12 bg-[#2A54A1] text-[#FFFFF2]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">Your home has a to-do list. Let us handle it.</h2>
          <p className="font-body text-lg md:text-xl mb-6">Get your custom quote in under a minute</p>
          <button onClick={handleCTA} className="bg-[#FFFFF2] text-[#2A54A1] px-10 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg font-body font-bold hover:bg-white transition-all transform hover:scale-105 shadow-lg">Get My Custom Quote</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1e3d7a] text-[#FFFFF2] py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Image src="/logo.png" alt="Handld Home" width={120} height={48} className="h-10 md:h-12 w-auto mb-4" />
              <p className="font-body text-sm md:text-base text-[#FFFFF2]/80">Your trusted home maintenance partner</p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-[#FFFFF2]">Contact</h4>
              <p className="font-body text-[#FFFFF2]/80">Concierge@HandldHome.com</p>
              <p className="font-body text-[#FFFFF2]/80">(626) 298-7128</p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-[#FFFFF2]">Service Area</h4>
              <p className="font-body text-[#FFFFF2]/80">Los Angeles</p>
            </div>
          </div>
          <div className="border-t border-[#FFFFF2]/20 pt-6 text-center">
            <p className="font-body text-[#FFFFF2]/60 mb-2">&copy; 2024 Handld Home Services. All rights reserved.</p>
            <div className="flex justify-center gap-4">
              <a href="/contact" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Contact Us</a>
              <a href="/terms" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Terms &amp; Conditions</a>
              <a href="/privacy" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {showChecklist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowChecklist(false)}>
          <div className="bg-[#FFFFF2] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#2A54A1] px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-xl md:text-2xl font-bold text-[#FFFFF2]">Home Tune-Up Checklist</h3>
              <button onClick={() => setShowChecklist(false)} className="text-[#FFFFF2] hover:opacity-70 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              <p className="font-body text-sm text-[#2A54A1]/70 mb-4">4-Hour Visit Includes Full 31-Point Inspection + Handyman Repairs</p>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                {tuneUpChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 py-2 border-b border-[#2A54A1]/10">
                    <Check className="w-4 h-4 text-[#2A54A1] mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-[#2A54A1]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#FBF9F0] px-6 py-4 border-t border-[#2A54A1]/10">
              <button onClick={() => { setShowChecklist(false); handleCTA(); }} className="w-full cta-button text-white px-8 py-3 rounded-full text-base font-body font-bold">
                Schedule My Home Tune-Up
              </button>
            </div>
          </div>
        </div>
      )}

      <QuoteModal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
    </div>
  );
}
