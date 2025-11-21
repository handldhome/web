import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import BundldSave from "@/components/BundldSave";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Page() {
  return (
    <main>
      <Hero />
      <Services />
      <HowItWorks />
      <BundldSave />
      <Testimonials />
      <FAQ />
    </main>
  );
}
