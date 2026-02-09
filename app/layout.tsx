import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
        {children}
        <Script
          src="https://widget.heymarket.com/heymk-widget.bundle.js"
          strategy="afterInteractive"
          onLoad={() => {
            // @ts-expect-error - HeymarketWidget is loaded by the external script
            if (window.HeymarketWidget) {
              // @ts-expect-error - HeymarketWidget is loaded by the external script
              window.HeymarketWidget.construct({
                CLIENT_ID: "1S6UdeduTkwjM0fVSKY3C1IuH-LvN4lBQ237lGPj"
              });
            }
          }}
        />
      </body>
    </html>
  );
}
