"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-black">
      {/* --- Background Video --- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* --- Overlay Gradient for readability --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60"></div>

      {/* --- Centered Content --- */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full px-6">
        <h1 className="text-white font-serif text-4xl md:text-6xl leading-tight mb-6 drop-shadow-lg">
          Care for your home, <br className="hidden md:block" /> without the
          hassle.
        </h1>

        <p className="text-white/90 text-lg md:text-2xl max-w-2xl leading-relaxed mb-10 drop-shadow">
          Your home’s personal concierge — quote, coordinate, schedule in minutes.
        </p>

        <a
          href="https://handldhome.typeform.com/to/lEaYy0ka"
          className="bg-[#2A54A1] hover:bg-[#22437F] text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-200"
        >
          Get My Custom Quote
        </a>
      </div>
    </section>
  );
}
