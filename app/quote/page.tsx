import { Suspense } from 'react';
import SmsConsentNotice from '@/components/SmsConsentNotice';
import QuoteRedirect from './QuoteRedirect';

// Server component so the SMS consent copy is in the raw HTML of /quote.
// The redirect to the home page (with the quote modal open) happens in the
// client component below.
export default function QuotePage() {
  return (
    <>
      <Suspense fallback={null}>
        <QuoteRedirect />
      </Suspense>
      <SmsConsentNotice />
    </>
  );
}
