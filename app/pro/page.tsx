'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Route, FileText, BarChart3, CreditCard, Users, MessageSquare, User, Monitor } from 'lucide-react';

const FEATURES = [
  {
    icon: Route,
    title: 'Route Optimization',
    description: 'Stop sending techs across town and back. Jobs get sequenced intelligently so your team spends time working, not driving.',
  },
  {
    icon: FileText,
    title: 'Quote Preparation',
    description: 'Build and send professional quotes in minutes. No more texting photos and hoping for the best.',
  },
  {
    icon: BarChart3,
    title: 'Pricing Analysis',
    description: "Know your numbers. See what's working, what's underpriced, and where you're leaving money on the table.",
  },
  {
    icon: CreditCard,
    title: 'Automated Customer Billing',
    description: 'Invoices go out automatically when jobs close. Payments come in. The back-and-forth stops.',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Assign jobs, track your crew, and keep everyone on the same page — without a group text thread that nobody reads.',
  },
  {
    icon: MessageSquare,
    title: 'Automated & Mass Communication',
    description: 'Appointment reminders, follow-ups, review requests. Set them once, let them run.',
  },
  {
    icon: User,
    title: 'Customer Profiles',
    description: "Every property, every job, every note — in one place. Your techs show up knowing what they're walking into.",
  },
  {
    icon: Monitor,
    title: 'Customer Portal',
    description: "A clean, branded experience where your customers can view their history, upcoming appointments, and communicate with your team. Looks like you built it yourself.",
  },
];

const BUSINESS_TYPES = [
  'Lawn Care',
  'Pest Control',
  'Pool Service',
  'House Cleaning',
  'Handyman & General Maintenance',
  'HVAC',
  'Mobile Car Wash',
  'Painting',
];

export default function ProPage() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    workType: '',
    location: '',
    contact: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const subject = encodeURIComponent(`Handld Pro Application — ${formData.businessName}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Business: ${formData.businessName}\n` +
      `Work Type: ${formData.workType}\n` +
      `Location: ${formData.location}\n` +
      `Contact: ${formData.contact}`
    );
    window.location.href = `mailto:pro@handldhome.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 500);
  };

  const scrollToApplication = () => {
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FFFFF2] text-[#2A54A1]">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
        .font-display { font-family: 'Libre Baskerville', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
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
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFF2] border-b-2 border-[#2A54A1]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Handld Home" width={160} height={80} className="h-12 md:h-20 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-body text-sm text-[#2A54A1] hover:opacity-70 transition-opacity hidden md:block">
              Handld Home
            </Link>
            <button
              onClick={scrollToApplication}
              className="cta-button text-white px-6 py-2.5 rounded-full font-body font-semibold text-sm"
            >
              Apply to Partner
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-[#FFFFF2]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-block bg-[#2A54A1]/10 px-4 py-1.5 rounded-full mb-6">
            <span className="font-body text-sm font-medium text-[#2A54A1]">Handld Pro — Partner Program</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#2A54A1] leading-tight">
            We made the software. Now we&apos;re looking for operators to grow with.
          </h1>
          <p className="font-body text-lg md:text-xl text-[#2A54A1]/80 leading-relaxed max-w-3xl mx-auto mb-10">
            Handld Pro is the platform we built to run our own home services business. We&apos;re opening it up to operators in other markets — free to use, in exchange for a simple customer-sharing agreement.
          </p>
          <button
            onClick={scrollToApplication}
            className="cta-button text-white px-10 py-4 rounded-full text-lg font-body font-bold"
          >
            Apply to Partner
          </button>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-12 md:py-20 bg-[#FBF9F0]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <p className="font-body text-sm font-medium text-[#2A54A1]/60 uppercase tracking-wider mb-6">See the platform</p>
          <div className="relative w-full aspect-video bg-[#2A54A1]/10 rounded-2xl overflow-hidden shadow-retro border-2 border-[#2A54A1]/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-[#2A54A1] rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-[#FFFFF2] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-body text-sm text-[#2A54A1]/60 mt-4">
            A quick look at what Handld Pro does — built by operators, for operators.
          </p>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-16 md:py-24 bg-[#FFFFF2]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center text-[#2A54A1]">
            Everything in one place
          </h2>
          <p className="font-body text-base md:text-lg text-[#2A54A1]/70 text-center mb-12 max-w-3xl mx-auto">
            We got tired of running our business across six different tools. So we consolidated. Here&apos;s what&apos;s inside.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white p-6 rounded-xl shadow-retro border-2 border-[#2A54A1]/10">
                  <div className="w-12 h-12 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#2A54A1]" />
                  </div>
                  <h3 className="font-display text-base md:text-lg font-bold mb-2 text-[#2A54A1]">{feature.title}</h3>
                  <p className="font-body text-sm text-[#2A54A1]/80">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHO WE PARTNER WITH */}
      <section className="py-16 md:py-24 bg-[#FBF9F0]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#2A54A1]">
            Built for operators who run a real business
          </h2>
          <p className="font-body text-base md:text-lg text-[#2A54A1]/70 mb-10 max-w-2xl mx-auto">
            We&apos;re not in your market. We&apos;re in ours. That&apos;s the whole point.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {BUSINESS_TYPES.map((type) => (
              <span
                key={type}
                className="bg-white px-5 py-2.5 rounded-full font-body text-sm font-medium text-[#2A54A1] border-2 border-[#2A54A1]/15 shadow-sm"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* THE OFFER */}
      <section className="py-16 md:py-24 bg-[#FFFFF2]">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center text-[#2A54A1]">
            Here&apos;s the deal
          </h2>
          <div className="max-w-3xl mx-auto mb-12">
            <p className="font-body text-base md:text-lg text-[#2A54A1]/80 leading-relaxed mb-4">
              We&apos;re not a software company that stumbled into home services. We&apos;re the other way around — operators who got tired of duct-taping tools together and built something that actually works for the way this business runs.
            </p>
            <p className="font-body text-base md:text-lg text-[#2A54A1]/80 leading-relaxed">
              We made this platform for ourselves. Along the way we realized it works just as well for any operator running a serious home services business. So instead of selling it, we&apos;re sharing it — with people we&apos;d want in our corner anyway.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-retro border-2 border-[#2A54A1]/10 text-center">
              <div className="w-14 h-14 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-3 text-[#2A54A1]">Free, for real</h3>
              <p className="font-body text-sm text-[#2A54A1]/80">
                No trials. No tiers. No &ldquo;schedule a demo&rdquo; runaround. If you&apos;re a fit, you&apos;re in — and you use the software at no cost, indefinitely.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-retro border-2 border-[#2A54A1]/10 text-center">
              <div className="w-14 h-14 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">↔</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-3 text-[#2A54A1]">No contract</h3>
              <p className="font-body text-sm text-[#2A54A1]/80">
                Use it as long as it&apos;s working for you. We&apos;re not interested in locking anyone in. If it stops making sense, you walk away clean.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-retro border-2 border-[#2A54A1]/10 text-center">
              <div className="w-14 h-14 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">→</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-3 text-[#2A54A1]">We send you customers</h3>
              <p className="font-body text-sm text-[#2A54A1]/80">
                That&apos;s the trade. As we grow our referral network, qualified customers in your market get connected to you. You take care of the work. Everyone wins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION / CTA */}
      <section id="apply" className="py-16 md:py-24 bg-[#FBF9F0]">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center text-[#2A54A1]">
            Think you&apos;re a fit?
          </h2>
          <p className="font-body text-base md:text-lg text-[#2A54A1]/80 leading-relaxed text-center mb-10">
            We&apos;re selective about who we bring in — not because the software costs us anything to share, but because the customer-sharing side only works if we trust the operators on the other end of a referral. If you run a tight operation and want to grow, let&apos;s talk.
          </p>

          {submitted ? (
            <div className="bg-white p-8 rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-display text-2xl font-bold mb-2 text-[#2A54A1]">Application sent</h3>
              <p className="font-body text-base text-[#2A54A1]/80">
                We review every application personally and follow up within a few business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 space-y-5">
              <div>
                <label className="font-body text-sm font-medium text-[#2A54A1] block mb-1.5">Your name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-2 border-[#2A54A1]/15 rounded-xl px-4 py-3 font-body text-sm text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-[#2A54A1] block mb-1.5">Business name</label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border-2 border-[#2A54A1]/15 rounded-xl px-4 py-3 font-body text-sm text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-[#2A54A1] block mb-1.5">What type of work do you do?</label>
                <input
                  type="text"
                  name="workType"
                  required
                  value={formData.workType}
                  onChange={handleChange}
                  placeholder="e.g. Lawn care, pest control, pool service..."
                  className="w-full border-2 border-[#2A54A1]/15 rounded-xl px-4 py-3 font-body text-sm text-[#2A54A1] placeholder:text-[#2A54A1]/30 focus:border-[#2A54A1] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-[#2A54A1] block mb-1.5">Where do you operate? (city / region)</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border-2 border-[#2A54A1]/15 rounded-xl px-4 py-3 font-body text-sm text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-[#2A54A1] block mb-1.5">Best way to reach you (email or phone)</label>
                <input
                  type="text"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full border-2 border-[#2A54A1]/15 rounded-xl px-4 py-3 font-body text-sm text-[#2A54A1] focus:border-[#2A54A1] focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full cta-button text-white py-4 rounded-full text-lg font-body font-bold disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Apply to Partner'}
              </button>
              <p className="font-body text-xs text-[#2A54A1]/50 text-center">
                We review every application personally and follow up within a few business days.
              </p>
            </form>
          )}
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
              <p className="font-body text-[#FFFFF2]/80">pro@handldhome.com</p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-[#FFFFF2]">Links</h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Handld Home</Link>
                <Link href="/blog" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Blog</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-[#FFFFF2]/20 pt-6 text-center">
            <p className="font-body text-[#FFFFF2]/60 mb-2">&copy; 2024 Handld Home Services. All rights reserved.</p>
            <div className="flex justify-center gap-4">
              <Link href="/terms" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Terms &amp; Conditions</Link>
              <Link href="/privacy" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
