import type { Metadata } from "next";
import "./globals.css";
import { dmSans, libreBaskerville } from "./fonts";

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
    <html lang="en" className={`${libreBaskerville.variable} ${dmSans.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
