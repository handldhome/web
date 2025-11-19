"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const bundles = [
  {
    name: "Outdoor Refresh",
    services: "Pressure Washing + Window Washing + Outdoor Furniture",
    img: "/bundles/outdoor.jpg",
  },
  {
    name: "Fall Prep",
    services: "Gutter Cleaning + Window Washing + Pressure Washing",
    img: "/bundles/fall.jpg",
  },
  {
    name: "Annual Essentials",
    services: "Trash Bin + Gutter Cleaning + Window Washing",
    img: "/bundles/essentials.jpg",
  },
];

export default function Bundld() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl text-navy mb-4">Bundld & Save</h2>
        <p className="text-navy/70 mb-12 max-w-2xl">
          Save <strong>30%</strong> when you choose 3 or more unique services. 
          Your one-stop shop for year-round home care.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {bundles.map((bundle, i) => (
            <motion.div
              key={bundle.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <Image
                src={bundle.img}
                alt={bundle.name}
                width={600}
                height={400}
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-navy">{bundle.name}</h3>
                <p className="text-navy/70 mt-1">{bundle.services}</p>
                <span className="mt-3 inline-block bg-sky text-white text-sm px-3 py-1 rounded-full">
                  Save 30%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

