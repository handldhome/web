"use client";

import Image from "next/image";

const services = [
  {
    title: "Pressure Washing",
    price: "$130",
    desc: "Save time and restore brightness to your home's exterior.",
    img: "/services/pressure.jpg",
  },
  {
    title: "Plumbing Repairs",
    price: "$105",
    desc: "Licensed professionals to fix leaks, clogs, and other plumbing issues.",
    img: "/services/plumbing.jpg",
  },
  {
    title: "Window Cleaning",
    price: "$95",
    desc: "Keep your windows spotless year-round with zero hassle.",
    img: "/services/window.jpg",
  },
  {
    title: "Gutter Cleaning",
    price: "$95",
    desc: "Prevent clogs and protect your home with routine cleaning.",
    img: "/services/gutter.jpg",
  },
  {
    title: "Holiday Lights",
    price: "$385",
    desc: "Professional installation, removal, and storage for lights.",
    img: "/services/holiday.jpg",
  },
  {
    title: "Outdoor Furniture Cleaning",
    price: "$95",
    desc: "Refresh outdoor furniture and extend its life with deep cleaning.",
    img: "/services/furniture.jpg",
  },
  {
    title: "Electrical Repairs",
    price: "$69",
    desc: "Licensed electricians for outlets, switches, and minor electrical work.",
    img: "/services/electrical.jpg",
  },
  {
    title: "Handyman Services",
    price: "$75",
    desc: "Reliable help for small home fixes, repairs, and improvements.",
    img: "/services/handyman.jpg",
  },
  {
    title: "Trash Bin Cleaning",
    price: "$45",
    desc: "Eliminate odors and bacteria with high-pressure bin cleaning.",
    img: "/services/bin.jpg",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 bg-cream relative">
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">

        <h2 className="text-3xl font-serif text-navy mb-8">Services</h2>

        {/* Fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-cream to-transparent z-20"></div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-cream to-transparent z-20"></div>

        {/* Marquee wrapper */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-10 whitespace-nowrap">

            {[...services, ...services].map((service, idx) => (
              <div
                key={idx}
                className="inline-block flex-shrink-0 w-[430px] bg-white shadow-md rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                
                <div className="relative h-60 w-full">
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
