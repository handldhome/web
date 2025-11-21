import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Handld Home Services",
  description: "Your home’s personal concierge for year-round upkeep."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream text-navy">
        <Navbar />
        <main className="pt-24"> 
          {/* Padding to offset sticky navbar */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
