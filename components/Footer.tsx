export default function Footer() {
  return (
    <footer className="bg-cream text-navy border-t border-navy/10 mt-20 py-10 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm opacity-70">
          © {new Date().getFullYear()} Handld Home Services. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
