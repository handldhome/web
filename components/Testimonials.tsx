export default function Testimonials() {
  return (
    <section className="bg-cream py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl text-navy mb-10">What Our Customers Say</h2>

        <div className="grid md:grid-cols-2 gap-10">
          <blockquote className="bg-white shadow p-6 rounded-xl text-navy/90 leading-relaxed">
            “Handld makes taking care of our house unbelievably easy.  
            They remind us, schedule everything, and the team is amazing.”
            <br /><br />
            <span className="font-semibold text-navy">— Sarah M.</span>
          </blockquote>

          <blockquote className="bg-white shadow p-6 rounded-xl text-navy/90 leading-relaxed">
            “The pricing is clear, the service is great, and our home has never looked better.”
            <br /><br />
            <span className="font-semibold text-navy">— David R.</span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

