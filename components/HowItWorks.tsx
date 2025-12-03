"use client";

import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="w-full bg-cream py-24 flex justify-center">
      <div className="relative w-full max-w-6xl px-6">
        <Image
          src="/how-it-works.png"  // <-- replace with your actual filename
          alt="How It Works Flow"
          width={2000}
          height={1200}
          className="w-full h-auto object-contain drop-shadow-sm"
          priority
        />
      </div>
    </section>
  );
}
