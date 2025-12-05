'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

export default function Page() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const servicesRef = useRef<HTMLDivElement>(null);

  const services = [
    { title: "Window Washing", description: "Crystal-clear views and natural light. We clean inside and out, leaving every pane spotless and streak-free.", price: "$175", img: "/services/window.jpg" },
    { title: "Pressure Washing", description: "Restore your home's curb appeal. From driveways to patios, we blast away dirt, grime, and years of buildup.", price: "$65", img: "/services/pressure.jpg" },
    { title: "Gutter Cleaning", description: "Avoid costly water damage by keeping your gutters clear and flowing. We remove debris to protect your roof and foundation.", price: "$90", img: "/services/gutter.jpg" },
    { title: "Trash Bin Cleaning", description: "Eliminate odors and bacteria from your trash bins. Deep-cleaning service that keeps these areas hygienic and fresh.", price: "$45", img: "/services/bin.jpg" },
    { title: "BBQ Cleaning", description: "Clean where it really counts. Remove grease and harmful bacteria from your BBQ grill for safe, delicious cooking.", price: "$125", img: "/services/furniture.jpg" },
    { title: "Pest Control", description: "Discreet and effective pest management. We ensure your home stays protected and pest-free without disrupting your peace.", price: "$170", img: "/services/handyman.jpg" },
    { title: "Mobile Car Wash", description: "Professional detailing at your doorstep. Keep your car looking its best without ever leaving home.", price: "$95", img: "/services/holiday.jpg" }
  ];

  const testimonials = [
    { text: "I didn't realize how much stress those 'to-dos' were causing until they were gone. Handld feels like a personal assistant for my house. Everything just…gets done!", author: "Keith, San Marino" },
    { text: "Finally one company that shows up on time, does great work, and doesn't make me chase them.", author: "Claire, South Pasadena" },
    { text: "I never thought I'd say this about a gutter cleaning, but the whole experience was genuinely enjoyable. Super professional and thoughtful. Feels like a concierge for my home.", author: "Maureen, Pasadena" },
    { text: "The pricing is transparent, the service is reliable, and I actually enjoy opening my calendar knowing Handld has everything scheduled for me.", author: "David, La Cañada" },
    { text: "As a busy professional, Handld has been a game-changer. I don't have to think about home maintenance anymore - it just happens.", author: "Jennifer, Glendale" },
    { text: "The quality of work is consistently excellent, and their team is always respectful and professional. Worth every penny.", author: "Michael, Pasadena" }
  ];

  const faqs = [
    { question: "What is Handld?", answer: "Handld is your one-stop home services partner - a local, membership-based company that takes care of the maintenance tasks that often fall through the cracks. From window and gutter cleaning to pressure washing and handyman services, we make it easy to keep your home in top shape all year long." },
    { question: "Do I have to sign up for a membership?", answer: "Not at all. You can book any of our services à la carte, whenever you need them. But if you're looking for savings, priority scheduling, and white-glove service, our membership program is a great value." },
    { question: "How does pricing work?", answer: "We use a simple, transparent pricing model based on a few key home attributes - like square footage, lot size, number of stories, and service complexity. You'll receive a detailed quote before anything is scheduled, with no surprises." },
    { question: "What areas do you service?", answer: "We currently serve Pasadena, La Cañada, San Marino, Glendale, & South Pasadena. Not sure if you're in our zone? Just reach out and we'll let you know." },
    { question: "Is there a cancellation policy?", answer: "We get it - things change. You can reschedule or cancel appointments up to 24 hours in advance. No fees, no problem." },
    { question: "Will I get reminders before service?", answer: "Yes. We'll send you appointment reminders by text or email, depending on your communication preferences. You'll also get a heads-up when your technician is en route." }
  ];

  useEffect(() => {
    const container = servicesRef.current;
    if (!container) return;
    let scrollAmount = 0;
    const scroll = () => {
      scrollAmount += 0.5;
      if (scrollAmount >= container.scrollWidth / 2) scrollAmount = 0;
      container.scrollLeft = scrollAmount;
    };
    const interval = setInterval(scroll, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCTA = () => window.open('https://handldhome.pro.typeform.com/to/lEaYy0ka', '_blank');

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
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFF2] border-b-2 border-[#2A54A1]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <img src="/logo.png" alt="Handld Home" className="h-10 md:h-12" />
          <div className="flex gap-6 md:gap-8 items-center font-body font-medium">
            <a href="#services" className="text-[#2A54A1] hover:opacity-70 transition-opacity text-sm md:text-base">Services</a>
            <a href="#how-it-works" className="text-[#2A54A1] hover:opacity-70 transition-opacity text-sm md:text-base">How It Works</a>
            <button onClick={handleCTA} className="cta-button text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold text-sm md:text-base">Get Quote</button>
          </div>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A54A1]/60 to-[#2A54A1]/40" />
        <div className="relative z-10 text-center text-[#FFFFF2] max-w-5xl mx-auto px-4 md:px-6">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            Home Maintenance Isn't Your Job. It's Ours.
          </h1>
          <p className="font-body text-lg md:text-2xl mb-8 md:mb-10 text-[#FFFFF2]/95">
            One quote, one provider, an entire year of home upkeep handled in under 5 minutes!
          </p>
          <button onClick={handleCTA} className="cta-button text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-base md:text-lg font-body font-bold">
            Get My Custom Quote
          </button>
        </div>
      </section>

      <section id="services" className="py-8 md:py-12 overflow-hidden bg-[#FBF9F0]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 md:mb-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-[#2A54A1]">Our Services</h2>
          <p className="font-body text-base md:text-lg text-[#2A54A1]">Let us take care of the jobs you don't have time for</p>
        </div>
        <div ref={servicesRef} className="flex gap-6 px-6 pb-6 scrollbar-hide" style={{ overflowX: 'hidden' }}>
          {[...services, ...services].map((service, idx) => (
            <div key={idx} className="flex-shrink-0 w-80 md:w-96 bg-white rounded-xl overflow-hidden shadow-retro border-2 border-[#2A54A1]/10 hover:shadow-2xl transition-shadow">
              <div className="h-48 md:h-56 bg-gray-200 relative overflow-hidden">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
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
        <div className="text-center mt-6">
          <button onClick={handleCTA} className="cta-button text-white px-8 md:px-10 py-3 rounded-full text-base md:text-lg font-body font-bold">
            See All Services & Pricing
          </button>
        </div>
      </section>

      <section id="how-it-works" className="py-8 md:py-12 bg-[#FFFFF2]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-10 text-center text-[#2A54A1]">How It Works</h2>
          
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
                    <p className="font-body text-sm md:text-base text-[#2A54A1]">Fill out a quick 2-minute questionnaire to help us understand your needs and preferences.</p>
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
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-[#2A54A1]">Review & approve your quote</h3>
                    <p className="font-body text-sm md:text-base text-[#2A54A1]">Select your preferred services and timing that works perfectly for your schedule.</p>
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
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-[#2A54A1]">We'll schedule your year</h3>
                    <p className="font-body text-sm md:text-base text-[#2A54A1]">We handle the maintenance, reminders, and coordinate everything for you.</p>
                  </div>
                </div>
              </div>

              <div className="ml-24 md:ml-48 step-card">
                <div className="bg-gradient-to-br from-[#2A54A1] to-[#1e3d7a] p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-[#2A54A1]/20 relative overflow-hidden">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-xl p-3">
                      <img src="/logo.png" alt="Handld" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-[#FFFFF2]">
                      <h3 className="font-display text-xl md:text-2xl font-bold mb-1">Enjoy your free time!</h3>
                      <p className="font-body text-sm md:text-base text-[#FFFFF2]/90">Relax while we maintain your home perfectly.</p>
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

      <section className="py-8 md:py-12 bg-[#2A54A1] text-[#FFFFF2] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFFFF2]/10 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">Bundld & Save</h2>
              <p className="font-body text-lg md:text-xl mb-6">Commit to 3 or more services and save 30% on your membership</p>
              <div className="bg-[#FFFFF2]/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 mb-6 border-2 border-[#FFFFF2]/20">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <Check className="w-8 h-8" />
                  <span className="font-display text-3xl font-bold">30% Discount</span>
                </div>
                <p className="font-body text-base">The more services you bundle, the more you save. It's that simple.</p>
              </div>
              <button onClick={handleCTA} className="bg-[#FFFFF2] text-[#2A54A1] px-8 md:px-10 py-3 rounded-full text-base md:text-lg font-body font-bold hover:bg-white transition-all transform hover:scale-105 shadow-lg">Build My Bundle</button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-[#FFFFF2]/20">
              <div className="bg-[#FFFFF2]/20 h-64 md:h-80 flex items-center justify-center">
                <span className="text-[#FFFFF2]/50 font-body text-lg">Bundle Services Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-[#FBF9F0]">
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
          <div className="text-center mt-6">
            <button onClick={handleCTA} className="cta-button text-white px-8 md:px-10 py-3 rounded-full text-base md:text-lg font-body font-bold">Join Our Happy Customers</button>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-[#FFFFF2]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center text-[#2A54A1]">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-[#FBF9F0] rounded-xl p-4 md:p-5 shadow-sm border-2 border-[#2A54A1]/10 group">
                <summary className="font-display text-base md:text-lg font-semibold cursor-pointer text-[#2A54A1] hover:text-[#1e3d7a] list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-2xl group-open:rotate-45 transition-transform text-[#2A54A1]">+</span>
                </summary>
                <p className="mt-3 font-body text-sm md:text-base text-[#2A54A1] leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-6">
            <button onClick={handleCTA} className="cta-button text-white px-8 md:px-10 py-3 rounded-full text-base md:text-lg font-body font-bold">Still Have Questions? Let's Talk</button>
          </div>
        </div>
      </section>

      <section id="about" className="py-8 md:py-12 bg-[#FBF9F0]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center text-[#2A54A1]">About Handld Home</h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="bg-white rounded-xl p-6 border-2 border-[#2A54A1]/10 shadow-lg">
              <div className="bg-gray-200 rounded-lg h-56 mb-5 flex items-center justify-center overflow-hidden">
                <span className="text-[#2A54A1]/40 font-body">Team Photo Placeholder</span>
              </div>
              <p className="font-body text-base text-[#2A54A1] leading-relaxed mb-3">At Handld Home, we believe in simplifying the way you care for your home. From proactive seasonal upkeep to responsive repairs, our membership is built to give you time back and peace of mind, year-round.</p>
              <p className="font-body text-base text-[#2A54A1] leading-relaxed">We're a local company serving Pasadena, La Cañada, San Marino, Glendale, and South Pasadena with experienced professionals, natural products, and top-tier equipment.</p>
            </div>
            <div className="grid gap-4">
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
                <h3 className="font-display text-lg md:text-xl font-bold mb-1 text-[#2A54A1]">Experienced Pros</h3>
                <p className="font-body text-sm text-[#2A54A1]">Skilled, vetted experts you can trust</p>
              </div>
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
                <h3 className="font-display text-lg md:text-xl font-bold mb-1 text-[#2A54A1]">Natural Products</h3>
                <p className="font-body text-sm text-[#2A54A1]">Safe, non-toxic solutions for your home</p>
              </div>
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
                <h3 className="font-display text-lg md:text-xl font-bold mb-1 text-[#2A54A1]">Top-Tier Equipment</h3>
                <p className="font-body text-sm text-[#2A54A1]">We use the best tools for better results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-[#2A54A1] text-[#FFFFF2]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="font-body text-lg md:text-xl mb-6">Get your custom quote in under 5 minutes</p>
          <button onClick={handleCTA} className="bg-[#FFFFF2] text-[#2A54A1] px-10 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg font-body font-bold hover:bg-white transition-all transform hover:scale-105 shadow-lg">Get My Custom Quote</button>
        </div>
      </section>

      <footer className="bg-[#1e3d7a] text-[#FFFFF2] py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src="/logo.png" alt="Handld Home" className="h-10 md:h-12 mb-4" />
              <p className="font-body text-sm md:text-base text-[#FFFFF2]/80">Your trusted home maintenance partner</p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-[#FFFFF2]">Contact</h4>
              <p className="font-body text-[#FFFFF2]/80">Concierge@HandldHome.com</p>
              <p className="font-body text-[#FFFFF2]/80">(626) 298-7128</p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-[#FFFFF2]">Service Areas</h4>
              <p className="font-body text-[#FFFFF2]/80">Pasadena • La Cañada • San Marino</p>
              <p className="font-body text-[#FFFFF2]/80">Glendale • South Pasadena</p>
            </div>
          </div>
          <div className="border-t border-[#FFFFF2]/20 pt-6 text-center">
            <p className="font-body text-[#FFFFF2]/60 mb-2">&copy; 2024 Handld Home Services. All rights reserved.</p>
            <a href="/privacy-policy" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
