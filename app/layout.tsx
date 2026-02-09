import type { Metadata } from "next";
import "./globals.css";
import HeymarketWidget from "@/components/HeymarketWidget";

export const metadata: Metadata = {
  title: "Handld Home Services",
  description: "Professional home maintenance services in Pasadena and surrounding areas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <HeymarketWidget />
      </body>
    </html>
  );
}
