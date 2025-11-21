"use client";

import Image from "next/image";

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
  return (
    <section id="services" className="bg-cream py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl text-navy mb-10">Services</h2>

        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4">
          {services.map((s) => (
            <div
              key={s.name}
              className="min-w-[260px] bg-white shadow-md rounded-xl p-4"
            >
              <Image
                src={s.img}
                alt={s.name}
                width={400}
                height={300}
                className="rounded-lg mb-4 object-cover h-[160px] w-full"
              />

              <h3 className="font-serif text-2xl text-navy">{s.name}</h3>
              <p className="text-sm text-navy/70 font-medium">
                Starting at {s.price}
              </p>
              <p className="text-sm text-navy/80 mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
