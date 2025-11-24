"use client";

import Image from "next/image";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main className="pt-28 bg-cream">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl sm:text-5xl font-serif text-navy leading-tight">
            The easiest way to keep your home clean, bright, and maintained.
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl">
            Handld Home Services takes care of the tasks you don’t want to—
            from window cleaning and gutter clearing to outdoor furniture,
            trash bin cleaning, holiday lights, handyman tasks, and more.
          </p>

          <a
            href="https://handldhome.typeform.com/to/lEaYy0ka"
            className="rounded-full bg-[#2A54A1] text-white text-base font-semibold px-6 py-3 shadow hover:bg-[#244987] transition"
          >
            Get My Custom Quote
          </a>
        </div>
      </section>

      {/* SERVICES MARQUEE */}
      <Services />

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="py-20 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-serif text-navy mb-10">How It Works</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-c
