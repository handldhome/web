"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "Handld made maintaining our home effortless.",
    name: "Sarah T.",
    city: "Pasadena, CA",
  },
  {
    quote: "The team is reliable, friendly, and incredibly thorough.",
    name: "Michael R.",
    city: "South Pasadena, CA",
  },
  {
    quote: "Finally, a service that handles everything for you.",
    name: "Emily W.",
    city: "Altadena, CA",
  },
  {
    quote: "The scheduling and reminders make home upkeep stress-free.",
    name: "Jason K.",
    city: "San Marino, CA",
  },
  {
    quote: "High-quality work every time — worth every penny.",
    name: "Claire M.",
    city: "La Cañada, CA",
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  /** Auto-scroll logic **/
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let scrollAmount = 0;

    const scroll = () => {
      scrollAmount += 0.5;
      if (el) el.scrollLeft = scrollAmount;

      // seamless infinite loop
      if (scrollAmount >= el.scrollWidth / 2) {
        scrollAmount = 0;
      }
    };

    const interval = setInterval(scroll, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="font-serif text-4xl text-navy mb-10">What People Are Saying</h2>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory"
      >
        {[...testimonials, ...testimonials].map((t, idx) => (
          <div
            key={idx}
            className="min-w-[300px] max-w-[320px] snap-start card p-6 hover:-translate-y-1 transition"
          >
            <p className="text-navy/80 mb-4 italic leading-relaxed">
              “{t.quote}”
            </p>
            <p className="font-semibold text-navy">{t.name}</p>
            <p className="text-sm text-navy/70">{t.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
