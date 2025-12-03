"use client";

import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="w-full bg-cream py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <h2 className="font-serif text-4xl text-navy mb-12 text-center">
          How It Works
        </h2>

        {/* Graphic */}
        <div className="w-full flex justify-center">
          <Image
            src="/how-it-works.png"   // <-- make sure the file is placed in /public/
            alt="How Handld Works"
            width={1600}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>

      </div>
    </section>
  );
}
