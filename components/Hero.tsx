"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
      
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-cream/85" />

      {/* Centered Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-3xl mx-auto text-center px-6"
      >
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy leading-tight mb-4">
          Care for your home<br />without the hassle.
        </h1>

        <p className="text-lg md:text-xl text-navy/80 mb-6">
          Your home’s personal concierge—quote, coordinate, schedule in minutes.
        </p>

        <a
          href="https://handldhome.typeform.com/to/lEaYy0ka"
          className="inline-block bg-brandBlue text-white px-7 py-3 rounded-full text-lg font-medium hover:bg-brandBlue/90 transition"
        >
          Get My Custom Quote
        </a>
      </motion.div>
    </section>
  );
}
