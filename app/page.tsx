import { Suspense } from 'react';
import HomePage from '@/components/HomePage';
import SmsConsentNotice from '@/components/SmsConsentNotice';

// Server component wrapper so the SMS consent copy for the quote form is in
// the raw HTML of / (the form itself only mounts in the browser).
export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <HomePage />
      </Suspense>
      <SmsConsentNotice />
    </>
  );
}
