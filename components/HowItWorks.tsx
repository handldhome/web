import Image from "next/image";

export default function HowItWorks() {
  return (
    <section id="how" className="bg-blue-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl text-navy mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-12 text-navy">
          <div>
            <div className="text-3xl font-bold text-sky mb-2">1</div>
            <p className="font-serif text-xl mb-2">Tell us about your home</p>
            <p className="text-navy/70 leading-relaxed">
              Start with a quick questionnaire so we can understand your space.
            </p>
          </div>

          <div>
            <div className="text-3xl font-bold text-sky mb-2">2</div>
            <p className="font-serif text-xl mb-2">Review & approve your quote</p>
            <p className="text-navy/70 leading-relaxed">
              Transparent pricing tailored to your home’s size and needs.
            </p>
          </div>

          <div>
            <div className="text-3xl font-bold text-sky mb-2">3</div>
            <p className="font-serif text-xl mb-2">
              We’ll schedule your year’s services
            </p>
            <p className="text-navy/70 leading-relaxed">
              We handle planning & reminders—so upkeep is always on track.
            </p>
          </div>
        </div>

        {/* Handld Icon + Flow Arrow */}
        <div className="flex justify-center mt-16">
          <Image
            src="/logo.png"
            width={160}
            height={80}
            alt="Handld Logo"
            className="opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
