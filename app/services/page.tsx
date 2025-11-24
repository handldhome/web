import Image from "next/image";

const services = [
  {
    title: "Pressure Washing",
    price: "$130",
    desc: "Restore brightness to walkways, siding, and outdoor surfaces.",
    long:
      "Our professional pressure washing services remove dirt, mildew, and buildup from your home’s exterior. Safe for concrete, siding, outdoor furniture, stone, and more.",
    img: "/services/pressure.jpg",
  },
  {
    title: "Window Cleaning",
    price: "$95",
    desc: "Crystal clear windows, year-round.",
    long:
      "Enjoy streak-free, sparkling windows inside and out. Our team cleans screens, frames, and glass for a spotless finish.",
    img: "/services/window.jpg",
  },
  {
    title: "Gutter Cleaning",
    price: "$95",
    desc: "Prevent clogs and protect your home.",
    long:
      "We remove leaves, debris, and buildup to ensure your gutters flow smoothly. Includes downspout flushing for full drainage.",
    img: "/services/gutter.jpg",
  },
  {
    title: "Holiday Lights",
    price: "$385",
    desc: "Professional installation, takedown, and storage.",
    long:
      "We design, install, maintain, remove, and store beautiful holiday light displays so you don’t have to lift a finger.",
    img: "/services/holiday.JPG",
  },
  {
    title: "Outdoor Furniture Cleaning",
    price: "$95",
    desc: "Deep cleaning for patio sets, cushions, and more.",
    long:
      "Extend the life of your outdoor furniture with detailed washing and sanitizing designed for sun, weather, and outdoor wear.",
    img: "/services/furniture.jpg",
  },
  {
    title: "Handyman Services",
    price: "$95",
    desc: "Small fixes done right.",
    long:
      "From repairs to installations, our handyman team tackles everyday home tasks quickly and professionally.",
    img: "/services/handyman.jpg",
  },
  {
    title: "Trash Bin Cleaning",
    price: "$45",
    desc: "Odor-free, sanitized bins.",
    long:
      "We pressure wash, degrease, and sanitize household bins so they stay clean, odorless, and hygienic.",
    img: "/services/bin.jpg",
  },
];

export default function ServicesPage() {
  return (
    <main className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-4xl font-serif text-navy mb-10">Our Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-2 transform transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-navy">{service.title}</h2>
                <p className="text-sm text-gray-600 mt-1">Starting at {service.price}</p>

                <p className="mt-3 text-gray-700 leading-relaxed">{service.long}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
