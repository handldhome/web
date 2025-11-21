"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-gray-200/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 
                      pt-3 pb-4  /* ← tighter top, more bottom padding */">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Handld Home Services"
            width={140}
            height={40}
            className="h-auto w-auto"
            priority
          />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-10 text-[1.05rem] font-medium text-[#2A2A2A]">
          <a href="#services" className="hover:opacity-70 transition">Services</a>
          <a href="#howitworks" className="hover:opacity-70 transition">How It Works</a>

          <a
            href="https://handldhome.typeform.com/to/lEaYy0ka"
            className="px-5 py-2 rounded-full text-white font-semibold shadow-sm"
            style={{ backgroundColor: "#2A54A1" }} // updated CTA color
          >
            Get My Custom Quote
          </a>
        </div>
      </div>
    </nav>
  );
}
