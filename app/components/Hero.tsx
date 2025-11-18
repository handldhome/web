import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          Care for your home without the hassle.
        </h1>

        <p className="text-white text-xl md:text-2xl mb-8">
          Everything—from quote to scheduled—handled in under 5 minutes.
        </p>

        <Link href="https://form.typeform.com/to/lEaYy0ka">
          <span className="inline-block bg-[#2A54A1] hover:bg-[#1E3C78] text-white font-semibold py-3 px-6 rounded-lg cursor-pointer transition">
            Get My Custom Quote
          </span>
        </Link>
      </div>
    </section>
  );
}
