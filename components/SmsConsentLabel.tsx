import { SMS_CONSENT_CUSTOMER_PARTS as P } from '@/lib/smsConsent';

// The customer SMS consent label with its two links. Rendered next to the
// checkbox in the quote form and as small print on server-rendered pages.
// Plain <a> tags so it works in both server and client components.
export default function SmsConsentLabel({ linkClassName = 'underline' }: { linkClassName?: string }) {
  return (
    <>
      {P.body}
      <a href={P.smsTermsHref} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {P.smsTermsLabel}
      </a>
      {P.between}
      <a href={P.privacyHref} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {P.privacyLabel}
      </a>
      {P.end}
    </>
  );
}
