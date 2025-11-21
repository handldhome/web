import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Handld Home Services",
  description: "Your home’s personal concierge for year-round maintenance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
