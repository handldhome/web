import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
