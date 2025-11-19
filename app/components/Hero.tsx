"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-cream/90" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col justify-center h-full"
      >
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-4">
          Care for your home<br />without the hassle.
        </h1>

        <p className="text-lg md:text-xl text-navy/80 max-w-2xl">
          Your home's personal concierge — one place to plan, price, and schedule a year’s worth of upkeep in just a few minutes.
        </p>

        <a
          href="https://handldhome.typeform.com/to/lEaYy0ka"
          className="mt-6 inline-block bg-sky text-white px-6 py-3 rounded-full text-md font-medium"
        >
          Get My Custom Quote
        </a>
      </motion.div>
    </section>
  );
}
