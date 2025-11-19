// app/page.tsx
import Hero from "../components/Hero";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import Bundld from "../components/Bundld";
import About from "../components/About";
import FinalCTA from "../components/FinalCTA";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <HowItWorks />
      <Bundld />
      <About />
      <FinalCTA />
    </main>
  );
}
