"use client";

import Image from "next/image";
import Hero from "@/components/Hero";
import About from "@/components/About";
import BundledSave from "@/components/BundldSave";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="pt-28 bg-cream">

      {/* HERO */}
      <Hero />

      {/* ABOUT */}
      <About />

      {/* BUNDLED & SAVE */}
      <BundledSave />

      {/* HOW IT WORKS (NEW IMAGE VERSION) */}
      <HowItWorks />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FINAL CTA */}
      <FinalCTA />

    </main>
  );
}
