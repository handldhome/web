import { describe, expect, it } from 'vitest';
import {
  buildQuoteSms,
  isHoneypotFilled,
  normalizeUsMobile,
  sanitizeFirstName,
} from '@/lib/quoteSms';

describe('sanitizeFirstName', () => {
  it.each([
    ['Brad', 'Brad'],
    ['  Brad  ', 'Brad'],
    ["O'Brien", "O'Brien"],
    ['O’Brien', 'O’Brien'],
    ['Mary-Jane', 'Mary-Jane'],
    ['Mary   Jane', 'Mary Jane'],
    ['José', 'José'],
    ['José', 'José'], // decomposed accent is normalized
    ['Zoë', 'Zoë'],
  ])('keeps %j as %j', (input, expected) => {
    expect(sanitizeFirstName(input)).toBe(expected);
  });

  it.each([
    'http://evil.example',
    'https://bit.ly/x',
    'httpfoo',
    'www.evil.com',
    'wwwevil',
    'evil.com',
    'bit.ly',
    'a/b',
    'Brad!',
    'Brad2',
    '<script>',
    'Call 555-1234',
    "'Brad",
    '-Brad',
    'A'.repeat(31),
    '',
    '   ',
  ])('rejects %j', (input) => {
    expect(sanitizeFirstName(input)).toBe('');
  });

  it('accepts exactly 30 characters', () => {
    expect(sanitizeFirstName('A'.repeat(30))).toBe('A'.repeat(30));
  });

  it('rejects non-strings', () => {
    expect(sanitizeFirstName(undefined)).toBe('');
    expect(sanitizeFirstName(null)).toBe('');
    expect(sanitizeFirstName(42)).toBe('');
    expect(sanitizeFirstName({ name: 'Brad' })).toBe('');
  });
});

describe('normalizeUsMobile', () => {
  it.each([
    ['6262987128', '+16262987128'],
    ['(626) 298-7128', '+16262987128'],
    ['626.298.7128', '+16262987128'],
    ['626-298-7128', '+16262987128'],
    ['1 626 298 7128', '+16262987128'],
    ['+1 (626) 298-7128', '+16262987128'],
    ['+16262987128', '+16262987128'],
  ])('normalizes %j to %j', (input, expected) => {
    expect(normalizeUsMobile(input)).toBe(expected);
  });

  it.each([
    '',
    '12345',
    '626298712', // 9 digits
    '62629871281', // 11 digits not starting with 1
    '+44 20 7946 0958', // UK
    '+52 55 1234 5678', // Mexico, 12 digits
    '0262987128', // area code starts with 0
    '1262987128', // area code starts with 1
    '6261987128', // exchange starts with 1
    '8005551234', // toll free
    '8885551234', // toll free
    '9115551234', // N11
    '626-298-7128 x12', // extension
    '626 298 7128 http://evil.example',
    'call me',
  ])('rejects %j', (input) => {
    expect(normalizeUsMobile(input)).toBeNull();
  });

  it('rejects non-string input', () => {
    expect(normalizeUsMobile(undefined)).toBeNull();
    expect(normalizeUsMobile(null)).toBeNull();
    expect(normalizeUsMobile(['6262987128'])).toBeNull();
  });
});

describe('isHoneypotFilled', () => {
  it('is false when the field is missing or blank', () => {
    expect(isHoneypotFilled({})).toBe(false);
    expect(isHoneypotFilled({ website: '' })).toBe(false);
    expect(isHoneypotFilled({ website: '   ' })).toBe(false);
    expect(isHoneypotFilled(undefined)).toBe(false);
    expect(isHoneypotFilled('website=x')).toBe(false);
  });

  it('is true when the field has anything in it', () => {
    expect(isHoneypotFilled({ website: 'http://spam.example' })).toBe(true);
    expect(isHoneypotFilled({ website: 'x' })).toBe(true);
  });
});

describe('buildQuoteSms', () => {
  const link = 'https://handldhome.com/quote/abc123';

  it('greets by name and carries the business name and opt-out', () => {
    expect(buildQuoteSms('Brad', link)).toBe(
      'Hi Brad, thanks for your Handld quote request. View your personalized quote here: https://handldhome.com/quote/abc123 Reply STOP to opt out.'
    );
  });

  it('falls back to "Hi there" without a name', () => {
    const sms = buildQuoteSms('', link);
    expect(sms.startsWith('Hi there, ')).toBe(true);
    expect(sms).toContain('Handld');
    expect(sms).toContain('Reply STOP to opt out');
  });
});
