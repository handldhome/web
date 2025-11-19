"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-20 bg-sky-light">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl text-navy mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Tell us what your home needs",
              desc: "Fill out a quick custom quote form so we can tailor your service plan.",
            },
            {
              title: "Review your custom plan",
              desc: "Transparent pricing, suggested frequency, and Bundld savings. Change anytime — we’re just a text away.",
            },
            {
              title: "We handle the rest",
              desc: "We notify you a week before each service and send photos when work is complete.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <CheckCircle className="text-sky w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold text-navy mb-2">{step.title}</h3>
              <p className="text-navy/70">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

