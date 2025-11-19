"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section className="py-20 bg-sky-light">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl text-navy mb-4">About Us</h2>
          <p className="text-navy/70 leading-relaxed mb-4">
            Handld is your home’s personal concierge — helping you stay on top of the chores
            that always fall to the bottom of your to-do list.
          </p>
          <p className="text-navy/70 leading-relaxed mb-4">
            From cleaning to repairs, every service is completed by a <strong>full-time Handld employee</strong>, 
            not a contractor. We train, background-check, and support our team to deliver a seamless experience.
          </p>
          <p className="text-navy/70 leading-relaxed">
            Sit back, relax, and let us handle it — as easy as ordering something on Amazon.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Image
            src="/about/handyman.jpg"
            alt="Handld Team"
            width={600}
            height={500}
            className="rounded-xl shadow-sm object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}

