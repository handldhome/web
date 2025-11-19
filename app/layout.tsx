// app/layout.tsx
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";

import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Handld Home Services",
  description: "Your personal home concierge for year-round upkeep.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
