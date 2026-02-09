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
        <Script id="heymarket-widget" strategy="lazyOnload">
          {`
            (function(_a,id,a,_) {
              function Modal(){
                var h = a.createElement('script'); h.type = 'text/javascript'; h.async = true;
                var e = id; h.src = e+(e.indexOf("?")>=0?"&":"?")+'ref='+_;
                var y = a.getElementsByTagName('script')[0]; y.parentNode.insertBefore(h, y);
                h.onload = h.onreadystatechange = function() {
                  var r = this.readyState; if (r && r != 'complete' && r != 'loaded') return;
                  try { HeymarketWidget.construct(_); } catch (e) {}
                };
              };
              (_a.attachEvent ? _a.attachEvent('onload', Modal) : _a.addEventListener('load', Modal, false));
            })(window,'https://widget.heymarket.com/heymk-widget.bundle.js',document,{
              CLIENT_ID: "1S6UdeduTkwjM0fVSKY3C1IuH-LvN4lBQ237lGPj"
            });
          `}
        </Script>
      </body>
    </html>
  );
}
