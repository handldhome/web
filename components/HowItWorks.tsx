"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function HowItWorks() {
  // Trigger fade-up animation on scroll
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-cream py-32 flex justify-center fade-section">
      <div className="relative w-full max-w-6xl px-6">
        <Image
          src="/how-it-works.png" // <- confirm filename
          alt="How it works"
          width={2000}
          height={1200}
          className="w-full h-auto object-contain drop-shadow-md"
          priority
        />
      </div>
    </section>
  );
}
