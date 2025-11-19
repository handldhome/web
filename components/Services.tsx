"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  { name: "Gutter Cleaning", price: "$95", img: "/services/gutter.jpg" },
  { name: "Handyman", price: "$75", img: "/services/handyman.jpg" },
  { name: "Holiday Lights", price: "$385", img: "/services/holiday.jpg" },
  { name: "Outdoor Furniture", price: "$55", img: "/services/furniture.jpg" },
  { name: "Pressure Washing", price: "$135", img: "/services/pressure.jpg" },
  { name: "Trash Bin", price: "$55", img: "/services/bin.jpg" },
  { name: "Window Washing", price: "$130", img: "/services/window.jpg" },
  { name: "Pest Control", price: "$95", img: "/services/pest.jpg" },
];

export default function Services() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl text-navy mb-10">Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <Image src={service.img} width={600} height={400} className="w-full h-40 object-cover" alt={service.name} />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-navy">{service.name}</h3>
                <p className="text-sm text-navy/60 mt-1">Starting at {service.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

