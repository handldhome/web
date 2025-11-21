"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled ? "bg-white/90 backdrop-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            width={120}
            height={40}
            alt="Handld Logo"
            className="cursor-pointer"
          />
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8 items-center text-navy font-medium">
          <a href="#services" className="hover:opacity-70">Services</a>
          <a href="#how" className="hover:opacity-70">How It Works</a>

          <a
            href="https://handldhome.typeform.com/to/lEaYy0ka"
            className="bg-sky px-5 py-2 rounded-full text-white hover:bg-sky/90 transition"
          >
            Get My Custom Quote
          </a>
        </div>
      </div>
    </nav>
  );
}
