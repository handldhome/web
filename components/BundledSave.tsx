export default function BundldSave() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="font-serif text-4xl text-navy mb-8">Bundld & Save</h2>

      <p className="text-navy/80 mb-10 max-w-2xl">
        Save <span className="font-semibold text-brandBlue">30%</span> on all
        services when you choose{" "}
        <span className="font-semibold">3 or more unique services</span>.
        Mix-and-match what your home needs—everything doesn’t need to be done at
        once.
      </p>

      <div className="grid md:grid-cols-3 gap-10">
        
        {/* Point 1 */}
        <div className="card p-6">
          <h3 className="font-serif text-xl text-navy mb-2">
            1. Unique Services = Savings
          </h3>
          <p className="text-navy/70 leading-relaxed">
            Gutters + windows + handyman = discount. Three gutter cleanings = no
            discount. It’s that simple.
          </p>
        </div>

        {/* Point 2 */}
        <div className="card p-6">
          <h3 className="font-serif text-xl text-navy mb-2">
            2. Flat Pricing by Home Size
          </h3>
          <p className="text-navy/70 leading-relaxed">
            Transparent quotes based on your home’s square footage—no surprises.
          </p>
        </div>

        {/* Point 3 */}
        <div className="card p-6">
          <h3 className="font-serif text-xl text-navy mb-2">
            3. Spread Across 12 Months
          </h3>
          <p className="text-navy/70 leading-relaxed">
            Your bundled services can be spread throughout the year based on
            seasonality and priority.
          </p>
        </div>

      </div>
    </div>
  );
}
