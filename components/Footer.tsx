export default function Footer() {
  return (
    <footer className="bg-navy text-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="font-serif text-lg mb-2">Handld Home Services</p>
        <p className="text-white/70 mb-4">
          Pasadena • San Marino • La Cañada • Surrounding Areas
        </p>

        <a
          href="https://handldhome.typeform.com/to/lEaYy0ka"
          className="inline-block bg-sky px-5 py-3 rounded-full font-medium"
        >
          Get My Custom Quote
        </a>

        <p className="text-white/40 text-sm mt-6">
          © {new Date().getFullYear()} Handld Home Services. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
