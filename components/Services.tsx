"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const services = [
  {
    name: "Pressure Washing",
    price: "$130",
    img: "/services/pressure.jpg",
    desc: "Save time and restore brightness to your home’s exterior.",
  },
  {
    name: "Window Cleaning",
    price: "$95",
    img: "/services/window.jpg",
    desc: "Keep your windows spotless year-round with zero hassle.",
  },
  {
    name: "Gutter Cleaning",
    price: "$95",
    img: "/services/gutter.jpg",
    desc: "Prevent clogs and protect your home with routine cleaning.",
  },
  {
    name: "Holiday Lights",
    price: "$385",
    img: "/services/holiday.jpg",
    desc: "Professional installation, removal, and storage for lights.",
  },
];

export default function Services() {
  const scrollRef = useRef<HTMLDivElement>(null);

  /** Auto-scroll logic **/
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let scrollAmount = 0;

    const scroll = () => {
      if (!el) return;
      scrollAmount += 0.7;
      el.scrollLeft = scrollAmount;

      if (scrollAmount >= el.scrollWidth / 2) {
        scrollAmount = 0;
      }
    };

    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="font-serif text-4xl text-navy mb-8">Services</h2>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory"
      >
        {[...services, ...services].map((s, idx) => (
          <div
            key={idx}
            className="min-w-[240px] max-w-[260px] card snap-start hover:-translate-y-1 transition"
          >
            <Image
              src={s.img}
              alt={s.name}
              width={500}
              height={350}
              className="rounded-lg mb-4 object-cover h-[150px] w-full"
            />

            <h3 className="font-serif text-xl text-navy">{s.name}</h3>
            <p className="text-sm text-navy/70">Starting at {s.price}</p>
            <p className="text-sm text-navy/80 mt-2 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
