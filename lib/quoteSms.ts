// Guards for the quote SMS sent by /api/submit-quote.
//
// The quote form is public, so anything a visitor types can end up in a text
// sent from Handld's Twilio number. These helpers make sure that text can only
// ever go to a valid US number and can only ever echo back a plain first name,
// never a link or other free text.

export const MAX_FIRST_NAME_LENGTH = 30;

// Letters (any alphabet), spaces, apostrophes (straight or curly) and hyphens.
// Built with RegExp() because the `u` flag needs ES2018 and tsconfig targets ES2017.
const NAME_CHARS = new RegExp("^[\\p{L}\\p{M}][\\p{L}\\p{M} '’-]*$", 'u');

// Belt and braces: the character allow-list already rules out dots and
// slashes, but reject anything that reads like a link outright.
const URL_LIKE = /https?|www|:\/\/|\/|\.[a-z]{2,}/i;

/**
 * Returns a first name that is safe to put in an SMS, or '' if the input
 * should not be echoed (the message then falls back to "Hi there").
 */
export function sanitizeFirstName(input: unknown): string {
  if (typeof input !== 'string') return '';
  const name = input.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!name || name.length > MAX_FIRST_NAME_LENGTH) return '';
  if (URL_LIKE.test(name)) return '';
  if (!NAME_CHARS.test(name)) return '';
  return name;
}

// NANP area codes that can't be a US mobile line.
const TOLL_FREE_AREA_CODES = new Set(['800', '833', '844', '855', '866', '877', '888']);

/**
 * Normalizes a visitor-typed phone number to E.164 (+1XXXXXXXXXX) if it is a
 * plausible US mobile number, otherwise returns null.
 *
 * Accepts the usual formatting characters (spaces, dots, dashes, parentheses,
 * a leading +) and an optional leading country code 1. Anything else
 * (letters, extensions, other country codes) is rejected.
 */
export function normalizeUsMobile(input: unknown): string | null {
  if (typeof input !== 'string' && typeof input !== 'number') return null;
  const raw = String(input).trim();
  if (!raw || raw.length > 25) return null;
  if (!/^\+?[\d\s().-]+$/.test(raw)) return null;

  let digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (digits.length !== 10) return null;

  // NXX-NXX-XXXX: area code and exchange can't start with 0 or 1.
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return null;

  const areaCode = digits.slice(0, 3);
  if (TOLL_FREE_AREA_CODES.has(areaCode)) return null;
  // N11 codes (211, 311, ... 911) are service codes, not area codes.
  if (areaCode[1] === '1' && areaCode[2] === '1') return null;

  return `+1${digits}`;
}

/** Name of the hidden form field that real visitors never fill in. */
export const HONEYPOT_FIELD = 'website';

export function isHoneypotFilled(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  if (value == null) return false;
  return String(value).trim() !== '';
}

/**
 * The quote text. Only the sanitized first name and our own quote link are
 * interpolated; it always names the business and carries the opt-out line.
 */
export function buildQuoteSms(firstName: string, quoteLink: string): string {
  const greeting = firstName ? `Hi ${firstName}` : 'Hi there';
  return `${greeting}, thanks for your Handld quote request. View your personalized quote here: ${quoteLink} Reply STOP to opt out.`;
}
