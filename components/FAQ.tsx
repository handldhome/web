"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How does Handld work?",
    a: "Tell us about your home, review and approve your quote, and we’ll schedule your services for the year while keeping you notified one week before each visit.",
  },
  {
    q: "Do I need to be home during service?",
    a: "In most cases, no. For exterior services (gutter cleaning, pressure washing, window cleaning, etc.), you don’t need to be home. If interior access is needed, we’ll coordinate with you directly.",
  },
  {
    q: "What areas do you serve?",
    a: "We proudly serve Pasadena, Altadena, South Pasadena, San Marino, La Cañada, and surrounding neighborhoods.",
  },
  {
    q: "Is pricing based on home size?",
    a: "Yes — our pricing is flat-rate and based on your home’s square footage so you always know what to expect.",
  },
  {
    q: "Can I customize my services?",
    a: "Absolutely. You can choose any combination of services — and when you select 3 or more unique services, you automatically save 30% across the board.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpen(open === i ? null : i);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="font-serif text-4xl text-navy mb-10">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <div key={i} className="border-b border-navy/10 pb-4">
            
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center py-3 text-left"
            >
              <span className="font-medium text-navy text-lg">{item.q}</span>
              <span className="text-brandBlue text-2xl leading-none">
                {open === i ? "–" : "+"}
              </span>
            </button>

            <div
              className={`transition-all overflow-hidden ${
                open === i ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              <p className="text-navy/70 leading-relaxed">{item.a}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
