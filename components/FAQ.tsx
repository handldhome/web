const faqs = [
  {
    q: "What is Handld?",
    a: "Handld is your home’s personal concierge—managing maintenance, scheduling, and upkeep with a year-round plan tailored to your home.",
  },
  {
    q: "How does pricing work?",
    a: "We price services based on the size and complexity of your home. Quotes are transparent and created instantly through our online questionnaire.",
  },
  {
    q: "Do I have to be home for service?",
    a: "Not always! Many exterior services can be performed without you being present. We notify you 1 week before and again on the day of service.",
  },
  {
    q: "What areas do you serve?",
    a: "We currently serve Pasadena, San Marino, La Cañada, and surrounding neighborhoods.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white py-20" id="faq">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl text-navy mb-10">FAQ</h2>

        <div className="space-y-8">
          {faqs.map((f) => (
            <div key={f.q}>
              <p className="font-serif text-xl text-navy mb-2">{f.q}</p>
              <p className="text-navy/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

