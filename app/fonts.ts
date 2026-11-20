import { DM_Sans, Libre_Baskerville } from 'next/font/google';

// Self-hosted at build time by next/font, so no visitor request ever goes to
// fonts.googleapis.com or fonts.gstatic.com. Families and weights match the
// Google Fonts URL the pages used to @import.
export const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-libre-baskerville',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
});

// The customer account page also loaded DM Sans 600. Applied to that page's
// wrapper, it re-points --font-dm-sans at a face set that includes 600.
export const dmSansWithSemibold = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
});
