"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden" id="hero">
      {/* Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-cream/90" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto px-6 pt-40"
      >
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy leading-tight mb-4">
          Care for your home<br />without the hassle.
        </h1>

        <p className="text-lg md:text-xl text-navy/80 max-w-2xl mb-6">
          Your home’s personal concierge—quote, coordinate, schedule in minutes.
        </p>

        <a
          href="https://handldhome.typeform.com/to/lEaYy0ka"
          className="inline-block bg-sky text-white px-6 py-3 rounded-full text-md font-semibold"
        >
          Get a Free Estimate
        </a>
      </motion.div>
    </section>
  );
}
