const CTA_LINK = "https://handldhome.typeform.com/to/lEaYy0ka";
const HERO_VIDEO =
  "https://drive.google.com/uc?export=download&id=1taSkaMMNSEqmjLHPnk6k4a1LrBcEut4h";

type Service = {
  title: string;
  desc: string;
  why: string;
  freq: string;
};

type Pricing = {
  name: string;
  price: string;
  note: string;
};

const pricing: Pricing[] = [
  { name: "Gutter Cleaning", price: "$95", note: "Price varies by roofline and access." },
  { name: "Handyman", price: "$75", note: "Hourly rate; small fixes and installs." },
  { name: "Holiday Lights", price: "$385", note: "Install & takedown; roofline and complexity affect price." },
  { name: "Outdoor Furniture Cleaning", price: "$55", note: "Per piece; materials and size may vary." },
  { name: "Pressure Washing", price: "$135", note: "Driveways, patios, walkways." },
  { name: "Trash Bin", price: "$55", note: "Per visit; disinfected and deodorized." },
  { name: "Window Washing", price: "$130", note: "Interior / exterior; screens and tracks optional." },
];

const services: Service[] = [
  {
    title: "Window Washing",
    desc: "Crystal-clear glass, frames, and screens.",
    why: "Keeps natural light bright and prevents buildup that can etch or dull glass over time.",
    freq: "Twice a year — spring and fall.",
  },
  {
    title: "Gutter Cleaning",
    desc: "Debris removal and downspout flush.",
    why: "Prevents overflow, foundation damage, and roof leaks.",
    freq: "Twice a year — before and after rainy season.",
  },
  {
    title: "Holiday Light Install & Take Down",
    desc: "Professional, hassle-free holiday lighting.",
    why: "Skip the ladder and let us handle setup, safety, and clean takedown — so you can enjoy the holidays stress-free.",
    freq: "Once a year — install before the holidays, takedown in January.",
  },
  {
    title: "Outdoor Furniture Cleaning",
    desc: "Refresh cushions, chairs, loungers, and outdoor fabrics.",
    why: "Keeps outdoor spaces inviting and extends the life of your furniture.",
    freq: "Once or twice a year, or after heavy use or storms.",
  },
  {
    title: "Pressure Washing",
    desc: "Driveways, patios, walkways, and more.",
    why: "Restores curb appeal and removes algae and grime that can damage surfaces.",
    freq: "Once a year, or as needed for outdoor buildup.",
  },
  {
    title: "Trash Bin",
    desc: "Deep-cleaned, sanitized, and deodorized.",
    why: "Eliminates bacteria and odor that attract pests.",
    freq: "Every 3–6 months.",
  },
  {
    title: "Handyman Tasks",
    desc: "Small fixes, seasonal maintenance, and installations.",
    why: "Keeps your home running smoothly without waiting on multiple contractors.",
    freq: "As needed — or bundle routine tasks into one visit.",
  },
  {
    title: "Pest Control",
    desc: "Preventative perimeter treatments.",
    why: "Protects your home year-round from ants, spiders, and other seasonal pests.",
    freq: "Quarterly.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/60 to-slate-900/20" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 sm:py-28">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight text-white">
              Home maintenance,
              <br />
              handled for you.
            </h1>

            <p className="mt-4 text-lg text-slate-100/90">
              Your home's personal concierge — one place to plan, price, and
              schedule a year’s worth of upkeep in just a few minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={CTA_LINK}
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
              >
                Get My Custom Quote
              </a>
              <p className="text-sm text-slate-100/80">
                A custom plan in under 5 minutes — no pressure, no spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BUNDLD DISCOUNT */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <p className="font-semibold text-slate-900">
            Bundld discount — save 30% when you bundle.
          </p>
          <p className="text-slate-600">
            We offer a <span className="font-semibold">Bundld Discount of 30%</span>{" "}
            when you sign up for <span className="font-semibold">three or more services.</span>
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">
              Transparent Pricing
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Starting prices at a glance
            </h2>
            <p className="mt-3 text-slate-600">
              Combine <span className="font-semibold">3+ services</span> and save{" "}
              <span className="font-semibold">30% with Bundld</span>. Final pricing
              depends on home size and scope.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pricing.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    {item.name}
                  </h3>
                  <div className="text-sm font-bold text-slate-900">{item.price}</div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a
              href={CTA_LINK}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Get My Custom Quote
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">
              What We Do
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Exterior & home care, bundled
            </h2>
            <p className="mt-3 text-slate-600">
              Reliable maintenance from the same trusted team — with bundled
              savings when you combine three or more services.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-100 flex flex-col"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700 italic">{service.desc}</p>
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-semibold">Why it matters:</span> {service.why}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold">Recommended:</span> {service.freq}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a
              href={CTA_LINK}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Get My Custom Quote
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
