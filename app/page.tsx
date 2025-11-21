import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import BundldSave from "@/components/BundldSave";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Page() {
  return (
    <>
      <Hero />

      {/* Services Section */}
      <section className="section-tight bg-offwhite" id="services">
        <Services />
      </section>

      {/* How it Works */}
      <section className="section bg-white" id="how">
        <HowItWorks />
      </section>

      {/* Bundld & Save */}
      <section className="section-tight bg-lightblue">
        <BundldSave />
      </section>

      {/* Testimonials */}
      <section className="section bg-offwhite">
        <Testimonials />
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <FAQ />
      </section>
    </>
  );
}
