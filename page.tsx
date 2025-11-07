'use client';
import React from 'react';
import { motion } from 'framer-motion';

const CTA_LINK = "https://handldhome.typeform.com/to/lEaYy0ka";
const HERO_VIDEO = "https://drive.google.com/uc?export=download&id=1taSkaMMNSEqmjLHPnk6k4a1LrBcEut4h";
const fadeUp = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.45, ease: "easeOut" }
};

const services = [
  {
    name: "Window Washing",
    desc: "Crystal-clear glass, frames, and screens.",
    why: "Keeps natural light bright and prevents buildup that can etch or dull glass over time.",
    freq: "Twice a year — spring and fall.",
    price: "$130"
  },
  {
    name: "Gutter Cleaning",
    desc: "Debris removal and downspout flush.",
    why: "Prevents overflow, foundation damage, and roof leaks.",
    freq: "Twice a year — before and after rainy season.",
    price: "$95"
  },
  {
    name: "Holiday Light Install & Take Down",
    desc: "Professional, hassle-free holiday lighting.",
    why: "Skip the ladder and let us handle setup, safety, and clean takedown — so you can enjoy the holidays stress-free.",
    freq: "Once a year — install before the holidays, takedown in January.",
    price: "$385"
  },
  {
    name: "Pressure Washing",
    desc: "Driveways, patios, walkways, siding.",
    why: "Restores your home’s curb appeal and removes algae and grime that can damage surfaces.",
    freq: "Once a year, or as needed for outdoor buildup.",
    price: "$135"
  },
  {
    name: "Trash Bin Cleaning",
    desc: "Deep-cleaned, sanitized, and deodorized.",
    why: "Eliminates bacteria and odor that attract pests.",
    freq: "Every 3–6 months.",
    price: "$55"
  },
  {
    name: "Handyman Tasks",
    desc: "Small fixes, seasonal maintenance, and installations.",
    why: "Keeps your home running smoothly without waiting for multiple contractors.",
    freq: "As needed — or bundle routine tasks in one visit.",
    price: "$75"
  },
  {
    name: "Pest Control",
    desc: "Preventative perimeter treatments.",
    why: "Protects your home year-round from ants, spiders, and other seasonal pests.",
    freq: "Quarterly.",
    price: "Varies"
  },
];

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-handldCream via-handldCream/70 to-handldCream/30" />
        <div className="relative z-10 max-w-2xl mx-auto p-8 text-center">
          <motion.h1 {...fadeUp} className="text-4xl sm:text-6xl font-extrabold leading-tight">
            Home maintenance,<br />handled for you.
          </motion.h1>
          <motion.p {...fadeUp} className="mt-4 text-neutral-800 text-lg">
            Your home’s personal concierge — everything managed, all year long.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8">
            <a href={CTA_LINK} className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow-soft hover:bg-blue-700 transition">
              Get My Custom Quote
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4" id="services">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">What We Do</p>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">Exterior & home care, bundled</h2>
          <p className="mt-4 text-gray-700">
            Reliable maintenance from the same trusted team — with bundled savings when you combine three or more services.
          </p>
          <p className="mt-2 text-gray-700 font-semibold">
            We want to be your one-stop shop for home maintenance — that’s why we offer a <strong>Bundld Discount of 30%</strong> when you sign up for <strong>three or more unique services.</strong>
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service) => (
            <motion.div key={service.name} {...fadeUp} className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="mt-2 text-gray-600 italic">{service.desc}</p>
              <p className="mt-2 text-sm text-gray-500"><strong>Why it matters:</strong> {service.why}</p>
              <p className="mt-1 text-sm text-gray-500"><strong>Recommended:</strong> {service.freq}</p>
              <p className="mt-2 text-lg font-bold">Starting at {service.price}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href={CTA_LINK} className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow-soft hover:bg-blue-700 transition">
            Get My Custom Quote
          </a>
        </div>
      </section>

      <section className="py-16 px-4 bg-handldBlue/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">Effortless from quote to completion</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <motion.div {...fadeUp} className="p-6">
              <h3 className="text-xl font-semibold">1. Tell us about your home</h3>
              <p className="mt-2 text-gray-600">Square footage, lot size, and a few details help us tailor your quote.</p>
            </motion.div>
            <motion.div {...fadeUp} className="p-6">
              <h3 className="text-xl font-semibold">2. Get your quote</h3>
              <p className="mt-2 text-gray-600">See transparent pricing and service options — add or remove what you need. Change or update anytime — we’re just a call or text away.</p>
            </motion.div>
            <motion.div {...fadeUp} className="p-6">
              <h3 className="text-xl font-semibold">3. We handle the rest</h3>
              <p className="mt-2 text-gray-600">We’ll notify you a week before each visit, confirm timing, and take care of everything. Once it’s done, you’ll get photos and a quick summary — so you know your home’s in great shape without lifting a finger.</p>
            </motion.div>
          </div>
          <div className="mt-10">
            <a href={CTA_LINK} className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow-soft hover:bg-blue-700 transition">
              Get My Custom Quote
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">About Handld</p>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">Set-it-and-forget-it home care, done right</h2>
          <p className="mt-4 text-gray-700">
            Handld was built for busy homeowners who want the comfort of a well-kept home — without the coordination headache.
            We provide a concierge-style service experience: one team, one point of contact, and total peace of mind.
          </p>
          <p className="mt-4 text-gray-700">
            Every Handld service provider is a full-time employee — trained, vetted, and committed to delivering consistent, quality work.
            No revolving door of contractors, just people who care for your home as if it were their own.
          </p>
          <p className="mt-4 text-gray-700">
            You tell us what you need once — we’ll take it from there. From window cleaning to handyman fixes, we keep your home in top shape year-round, seamlessly and reliably.
          </p>
          <div className="mt-10">
            <a href={CTA_LINK} className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow-soft hover:bg-blue-700 transition">
              Get My Custom Quote
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-handldBlue/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to get your home Handld?</h2>
          <p className="mt-2 text-gray-700">
            Answer a few quick questions and we’ll send your custom quote — complete with bundled savings and suggested maintenance schedule.
          </p>
          <div className="mt-6">
            <a href={CTA_LINK} className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow-soft hover:bg-blue-700 transition">
              Get My Custom Quote
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
