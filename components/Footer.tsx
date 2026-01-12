import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-lightblue mt-20 py-12">
      <div className="max-w-6xl mx-auto text-center px-6">

        <Image
          src="/logo.png"
          alt="Handld Logo"
          width={150}
          height={50}
          className="mx-auto mb-4"
        />

        <a
          href="mailto:Concierge@HandldHome.com"
          className="text-navy font-medium text-lg hover:opacity-70 transition"
        >
          Concierge@HandldHome.com
        </a>

        <div className="flex justify-center gap-6 mt-4">
          <Link
            href="/terms"
            className="text-navy/70 text-sm hover:text-navy transition"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/privacy"
            className="text-navy/70 text-sm hover:text-navy transition"
          >
            Privacy Policy
          </Link>
        </div>

        <p className="text-navy/60 text-sm mt-4">
          © {new Date().getFullYear()} Handld Home Services. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
