"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-black/5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-2.5 py-1">
        
        {/* Logo */}
        <a href="/">
          <Image
            src="/logo.png"
            alt="Handld Home Services"
            width={110}
            height={40}
            className="h-auto w-auto"
          />
        </a>

        {/* Links */}
        <div className="flex items-center gap-8">
          <a className="text-navy text-sm font-medium hover:opacity-70" href="#services">
            Services
          </a>

          <a className="text-navy text-sm font-medium hover:opacity-70" href="#how">
            How It Works
          </a>

          {/* CTA */}
          <a
            href="https://handldhome.typeform.com/to/lEaYy0ka"
            className="rounded-full bg-[#2A54A1] text-white text-sm font-semibold px-4 py-1.5 shadow-sm hover:bg-[#244987] transition"
          >
            Get My Custom Quote
          </a>
        </div>

      </nav>
    </header>
  );
}
