import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import SmsTermsPage, { metadata as smsTermsMetadata } from '@/app/sms-terms/page';
import TermsPage from '@/app/terms/page';
import SmsConsentNotice from '@/components/SmsConsentNotice';
import { SMS_CONSENT_TEXT_CUSTOMER } from '@/lib/smsConsent';

// Server-rendered pages: render them to static HTML the way a crawler or a
// carrier reviewer fetching the page would see them.
function html(component: () => JSX.Element) {
  return renderToStaticMarkup(createElement(component));
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('/sms-terms', () => {
  it('has the SMS Terms title', () => {
    expect(smsTermsMetadata.title).toBe('Text Messaging Terms - Handld Home');
    expect(html(SmsTermsPage)).toContain('Handld Home Text Messaging Terms (SMS Terms)');
  });

  it('renders the STOP and HELP lines, the sending number and the no-sharing sentence', () => {
    const page = html(SmsTermsPage);
    expect(page).toContain('Reply STOP to any message to stop receiving texts from that number');
    expect(page).toContain('Reply START to resubscribe');
    expect(page).toContain('Reply HELP, call (626) 298-7128');
    expect(page).toContain('from (626) 298-7167');
    expect(page).toContain(
      'Mobile information and text messaging opt-in data and consent will not be sold or shared with third parties or affiliates for their marketing or promotional purposes.'
    );
    expect(page).toContain('Effective 2026-11-25');
    // The voice line is never offered as a number to text.
    expect(page).not.toMatch(/text us at \(626\) 298-7128/i);
  });

  it('renders the postal address only when COMPANY_POSTAL_ADDRESS is set', () => {
    vi.stubEnv('COMPANY_POSTAL_ADDRESS', '');
    const without = html(SmsTermsPage);
    expect(without).toContain('Handld Home LLC ·');
    expect(without).not.toContain('Pasadena, CA 91101');
    expect(without).not.toMatch(/placeholder|TODO|\[address\]/i);

    vi.stubEnv('COMPANY_POSTAL_ADDRESS', '123 Example St, Pasadena, CA 91101');
    expect(html(SmsTermsPage)).toContain('123 Example St, Pasadena, CA 91101');
  });
});

describe('/terms Addendum B', () => {
  it('contains the SMS Terms as Addendum B', () => {
    const page = html(TermsPage);
    expect(page).toContain('Addendum B — Consent to Receive Communication');
    expect(page).toContain('Reply STOP to any message to stop receiving texts from that number');
    expect(page).toContain('Reply HELP, call (626) 298-7128');
  });
});

describe('server-rendered consent notice', () => {
  it('contains the full consent label text with links to /sms-terms and /privacy', () => {
    const notice = html(SmsConsentNotice);
    // Strip tags and decode the one entity the label uses, then compare to the stored text.
    const text = notice.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
    expect(text).toContain(SMS_CONSENT_TEXT_CUSTOMER);
    expect(notice).toContain('href="/sms-terms"');
    expect(notice).toContain('href="/privacy"');
  });
});
