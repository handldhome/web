"use client";

import Image from "next/image";

const services = [
  {
    title: "Holiday Lights",
    price: "$385",
    desc: "Professional installation, removal, and storage for lights.",
    img: "/services/holiday-lights.jpg",
  },
  {
    title: "Pressure Washing",
    price: "$130",
    desc: "Save time and restore brightness to your home’s exterior.",
    img: "/services/pressure-washing.jpg",
  },
  {
    title: "Window Cleaning",
    price: "$95",
    desc: "Keep your windows spotless year-round with zero hassle.",
    img: "/services/window-cleaning.jpg",
  },
  {
    title: "Gutter Cleaning",
    price: "$95",
    desc: "Prevent clogs and protect your home with routine cleaning.",
    img: "/services/gutter-cleaning.jpg",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-serif text-navy mb-8">Services</h2>

        {/* Marquee container */}
        <div className="overflow-hidden relative">
          <div className="flex gap-6 animate-marquee whitespace-nowrap">

            {[...services, ...services].map((service, idx) => (
              <div
                key={idx}
                className="inline-block w-[340px] bg-white shadow-md rounded-xl overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-navy">{service.title}</h3>
                  <p className="text-sm text-gray-600">Starting at {service.price}</p>
                  <p className="text-sm text-gray-700 mt-2">{service.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
