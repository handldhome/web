// Customer SMS consent copy for the quote form.
//
// The label is the exact wording from the shared Handld SMS compliance spec.
// It is rendered in the quote form (client), echoed as small print in the
// server-rendered HTML of / and /quote so a crawler or carrier reviewer sees
// it without JavaScript, and stored verbatim in handld.sms_consents.
// Bump SMS_CONSENT_VERSION whenever the wording changes.

export const SMS_CONSENT_VERSION = '2026-11-25';

/** The label split around its two links so the UI can render them as anchors. */
export const SMS_CONSENT_CUSTOMER_PARTS = {
  body:
    'I agree to receive text messages from Handld Home at this number about my quote, appointments and service, such as my quote link, confirmations and arrival updates. Message frequency varies. Msg & data rates may apply. Reply STOP to cancel or HELP for help. Consent is not a condition of purchase. See our ',
  smsTermsLabel: 'SMS Terms',
  smsTermsHref: '/sms-terms',
  between: ' and ',
  privacyLabel: 'Privacy Policy',
  privacyHref: '/privacy',
  end: '.',
} as const;

/** The full label as plain text. This is what gets stored as consent_text. */
export const SMS_CONSENT_TEXT_CUSTOMER =
  SMS_CONSENT_CUSTOMER_PARTS.body +
  SMS_CONSENT_CUSTOMER_PARTS.smsTermsLabel +
  SMS_CONSENT_CUSTOMER_PARTS.between +
  SMS_CONSENT_CUSTOMER_PARTS.privacyLabel +
  SMS_CONSENT_CUSTOMER_PARTS.end;
