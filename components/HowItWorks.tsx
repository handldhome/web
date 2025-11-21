import Image from "next/image";

export default function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="font-serif text-4xl text-navy mb-12">How It Works</h2>

      <div className="grid md:grid-cols-3 gap-12 relative">

        {/* Step 1 */}
        <div className="relative">
          <div className="text-3xl font-bold text-brandBlue mb-2">1</div>
          <p className="font-serif text-xl mb-2">Tell us about your home</p>
          <p className="text-navy/70 leading-relaxed">
            Answer a few quick questions so we can understand your home’s needs.
          </p>

          {/* Arrow 1 */}
          <svg
            className="hidden md:block absolute top-12 right-[-40px]"
            width="80"
            height="30"
            viewBox="0 0 80 30"
            fill="none"
          >
            <path
              d="M0 15 H70 L60 5 M70 15 L60 25"
              stroke="#2A54A1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Step 2 */}
        <div className="relative">
          <div className="text-3xl font-bold text-brandBlue mb-2">2</div>
          <p className="font-serif text-xl mb-2">Review & approve your quote</p>
          <p className="text-navy/70 leading-relaxed">
            Transparent pricing based on your home’s size and requirements.
          </p>

          {/* Arrow 2 */}
          <svg
            className="hidden md:block absolute top-12 right-[-40px]"
            width="80"
            height="30"
            viewBox="0 0 80 30"
            fill="none"
          >
            <path
              d="M0 15 H70 L60 5 M70 15 L60 25"
              stroke="#2A54A1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Step 3 */}
        <div className="relative">
          <div className="text-3xl font-bold text-brandBlue mb-2">3</div>
          <p className="font-serif text-xl mb-2">
            We schedule your year’s services
          </p>
          <p className="text-navy/70 leading-relaxed">
            We handle planning and reminders so upkeep is always on track.
          </p>
        </div>
      </div>

      {/* Handld logo as final "step" */}
      <div className="flex justify-center mt-16">
        <Image
          src="/logo.png"
          alt="Handld Logo"
          width={160}
          height={60}
          className="opacity-80"
        />
      </div>
    </div>
  );
}
