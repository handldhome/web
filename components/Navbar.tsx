"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled ? "bg-white/90 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            width={120}
            height={40}
            alt="Handld Logo"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-navy font-medium">
          <a href="#services" className="hover:opacity-70">Services</a>
          <a href="#how" className="hover:opacity-70">How It Works</a>

          {/* CTA */}
          <a
            href="https://handldhome.typeform.com/to/lEaYy0ka"
            className="bg-brandBlue text-white px-5 py-2 rounded-full font-medium hover:bg-brandBlue/90 transition"
          >
            Get My Custom Quote
          </a>
        </div>

      </div>
    </nav>
  );
}
