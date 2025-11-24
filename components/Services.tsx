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

        {/* Auto-scrolling marquee */}
        <div className="overflow-hidden">
          <div className="flex gap-6 whitespace-nowrap animate-scroll">
            
            {[...services, ...services].map((service, idx) => (
              <div
                key={idx}
                className="inline-block w-64 bg-white shadow-md rounded-xl overflow-hidden"
              >
                <div className="h-40 bg-gray-100">
                  <Image
                    src={service.img}
                    alt={service.title}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-navy">
                    {service.title}
                  </h3>
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
