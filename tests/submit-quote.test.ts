import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';

// Fake Supabase: records every table touched and answers each chain with
// canned rows. Nothing here talks to a real database.
const dbCalls: string[] = [];
// Every row handed to insert/upsert, so tests can inspect what was written.
const dbRows: { table: string; op: string; row: Record<string, unknown> }[] = [];
// Numbers the fake sms_opt_outs table says have opted out.
const optedOut = new Set<string>();

function fakeQuery(table: string) {
  let op = 'select';
  let eqValue: unknown;
  const result = () => {
    if (table === 'sms_opt_outs' && op === 'select') {
      return { data: optedOut.has(String(eqValue)) ? { phone: eqValue } : null, error: null };
    }
    if (table === 'customers') return { data: { id: 'cust-1' }, error: null };
    if (table === 'referral_codes') return { data: { id: 'ref-1', code: 'ABCDEFGH' }, error: null };
    if (table === 'quote_requests' && op === 'insert') {
      return { data: { id: 'qr-1', token: 'tok123' }, error: null };
    }
    if (table === 'quote_requests') return { data: [], error: null };
    return { data: null, error: null };
  };
  const builder: Record<string, unknown> = {};
  for (const m of ['select', 'like', 'order', 'limit', 'single', 'maybeSingle']) {
    builder[m] = () => builder;
  }
  builder.eq = (_col: string, value: unknown) => {
    eqValue = value;
    return builder;
  };
  for (const m of ['insert', 'upsert']) {
    builder[m] = (row: Record<string, unknown> | Record<string, unknown>[]) => {
      op = m;
      dbCalls.push(`${table}.${m}`);
      for (const r of Array.isArray(row) ? row : [row]) dbRows.push({ table, op: m, row: r });
      return builder;
    };
  }
  builder.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
    Promise.resolve(result()).then(resolve, reject);
  return builder;
}

vi.mock('@/lib/supabase/handld', () => ({
  getHandldDb: () => ({
    from: (table: string) => {
      dbCalls.push(table);
      return fakeQuery(table);
    },
  }),
}));

import handler, { ipLimiter, phoneLimiter } from '@/pages/api/submit-quote';
import { SMS_CONSENT_TEXT_CUSTOMER, SMS_CONSENT_VERSION } from '@/lib/smsConsent';

const fetchMock = vi.fn();

function makeReq(body: Record<string, unknown>, ip = '203.0.113.10') {
  return {
    method: 'POST',
    body,
    headers: { 'x-forwarded-for': `${ip}, 10.0.0.1`, 'user-agent': 'vitest/1.0' },
    socket: {},
  } as unknown as NextApiRequest;
}

function makeRes() {
  const res = {
    statusCode: 0,
    payload: undefined as unknown,
    setHeader: vi.fn(),
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.payload = payload;
      return res;
    },
  };
  return res;
}

async function submit(body: Record<string, unknown>, ip?: string) {
  const res = makeRes();
  await handler(makeReq(body, ip), res as unknown as NextApiResponse);
  return res;
}

function sentSms() {
  return fetchMock.mock.calls.map(([, init]) => {
    const params = new URLSearchParams(String((init as RequestInit).body));
    return { to: params.get('To'), body: params.get('Body') ?? '' };
  });
}

const validBody = {
  name: 'Brad Phillipi',
  email: 'test@example.com',
  phone: '(626) 298-7128',
  serviceType: 'Single Service',
  selectedServices: ['Gutter Cleaning'],
  website: '',
  smsConsent: true,
};

const CONSENT_ERROR = 'Please agree to receive text messages or remove your phone number';

function consentRows() {
  return dbRows.filter((r) => r.table === 'sms_consents').map((r) => r.row);
}

beforeEach(() => {
  dbCalls.length = 0;
  dbRows.length = 0;
  optedOut.clear();
  ipLimiter.reset();
  phoneLimiter.reset();
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true, status: 201, text: async () => '' });
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('TWILIO_ACCOUNT_SID', 'ACtest');
  vi.stubEnv('TWILIO_AUTH_TOKEN', 'test-token');
  vi.stubEnv('TWILIO_PHONE_NUMBER', '+15005550006');
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/submit-quote', () => {
  it('texts a valid US mobile with the first name, business name and opt-out', async () => {
    const res = await submit(validBody);
    expect(res.statusCode).toBe(200);
    expect(sentSms()).toEqual([
      {
        to: '+16262987128',
        body: 'Hi Brad, thanks for your Handld quote request. View your personalized quote here: https://handldhome.com/quote/tok123 Reply STOP to opt out.',
      },
    ]);
  });

  it('saves the quote but texts "Hi there" when the name looks like a link', async () => {
    const res = await submit({ ...validBody, name: 'http://evil.example/win Smith' });
    expect(res.statusCode).toBe(200);
    expect(dbCalls).toContain('quote_requests.insert');
    const [sms] = sentSms();
    expect(sms.body).toMatch(/^Hi there, thanks for your Handld quote request\./);
    expect(sms.body).not.toContain('evil');
  });

  it.each(['bit.ly/free', 'WWW', 'Brad<script>', 'A'.repeat(31)])(
    'never echoes the name %j',
    async (name) => {
      await submit({ ...validBody, name });
      const [sms] = sentSms();
      expect(sms.body.startsWith('Hi there, ')).toBe(true);
    }
  );

  it('rejects a phone that is not a US mobile and sends nothing', async () => {
    for (const phone of ['+44 20 7946 0958', '800-555-1234', '626-298-7128 http://x.co']) {
      const res = await submit({ ...validBody, phone });
      expect(res.statusCode).toBe(400);
    }
    expect(fetchMock).not.toHaveBeenCalled();
    expect(dbCalls).toEqual([]);
  });

  it('accepts a filled honeypot silently and saves and sends nothing', async () => {
    const res = await submit({ ...validBody, website: 'http://spam.example' });
    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual({ success: true, serviceType: 'Single Service' });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(dbCalls).toEqual([]);
  });

  it('texts one number at most 3 times a day, but still saves the quote', async () => {
    for (let i = 0; i < 4; i++) {
      const res = await submit(validBody, `198.51.100.${i}`);
      expect(res.statusCode).toBe(200);
    }
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(dbCalls.filter((c) => c === 'quote_requests.insert')).toHaveLength(4);
  });

  it('returns 429 after 10 submissions from one IP in an hour', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await submit({ ...validBody, phone: `626-298-${String(7100 + i)}` });
      expect(res.statusCode).toBe(200);
    }
    const blocked = await submit({ ...validBody, phone: '626-298-7199' });
    expect(blocked.statusCode).toBe(429);
    expect(fetchMock).toHaveBeenCalledTimes(10);
  });

  it('does not text for the free home health check', async () => {
    const res = await submit({ ...validBody, serviceType: 'Free Home Health Check' });
    expect(res.statusCode).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(res.payload).toMatchObject({ smsSent: false, smsSkipped: 'health_check' });
  });

  it('returns the quote link alongside a successful text', async () => {
    const res = await submit(validBody);
    expect(res.payload).toEqual({
      success: true,
      serviceType: 'Single Service',
      quoteUrl: 'https://handldhome.com/quote/tok123',
      smsSent: true,
    });
  });

  describe('SMS consent', () => {
    it.each([undefined, false, 'true', 1])(
      'rejects a phone number when smsConsent is %j, before touching the database',
      async (smsConsent) => {
        const res = await submit({ ...validBody, smsConsent });
        expect(res.statusCode).toBe(400);
        expect(res.payload).toEqual({ error: CONSENT_ERROR });
        expect(fetchMock).not.toHaveBeenCalled();
        expect(dbCalls).toEqual([]);
      }
    );

    it('accepts a submission with no phone and no consent, returns the link and sends nothing', async () => {
      const res = await submit({ ...validBody, phone: '', smsConsent: false });
      expect(res.statusCode).toBe(200);
      expect(res.payload).toMatchObject({
        success: true,
        quoteUrl: 'https://handldhome.com/quote/tok123',
        smsSent: false,
        smsSkipped: 'no_phone',
      });
      expect(fetchMock).not.toHaveBeenCalled();
      expect(dbCalls).toContain('quote_requests.insert');
      expect(consentRows()).toEqual([]);
    });

    it('records the consent against the quote request with the exact label text', async () => {
      await submit(validBody);
      expect(consentRows()).toEqual([
        {
          phone: '+16262987128',
          party: 'customer',
          purpose: 'transactional',
          source: 'web_quote_form',
          consent_text: SMS_CONSENT_TEXT_CUSTOMER,
          consent_version: SMS_CONSENT_VERSION,
          ip: '203.0.113.10',
          user_agent: 'vitest/1.0',
          reference_id: 'qr-1',
        },
      ]);
      expect(SMS_CONSENT_VERSION).toBe('2026-11-25');
      expect(SMS_CONSENT_TEXT_CUSTOMER).toContain('Reply STOP to cancel or HELP for help');
      expect(SMS_CONSENT_TEXT_CUSTOMER).toContain('Consent is not a condition of purchase');
    });

    it('records consent for the free home health check even though no quote text is sent', async () => {
      await submit({ ...validBody, serviceType: 'Free Home Health Check' });
      expect(consentRows()).toHaveLength(1);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('passes a null ip when the forwarded address is not an IP', async () => {
      await submit(validBody, 'unknown host');
      expect(consentRows()[0].ip).toBeNull();
    });
  });

  describe('opt-outs', () => {
    it('skips the text for a number in handld.sms_opt_outs but still saves the quote', async () => {
      optedOut.add('+16262987128');
      const res = await submit(validBody);
      expect(res.statusCode).toBe(200);
      expect(res.payload).toMatchObject({
        success: true,
        quoteUrl: 'https://handldhome.com/quote/tok123',
        smsSent: false,
        smsSkipped: 'opt_out',
      });
      expect(fetchMock).not.toHaveBeenCalled();
      expect(dbCalls).toContain('quote_requests.insert');
      expect(dbCalls).toContain('sms_opt_outs');
      // An opt-out does not consume the per-phone text allowance.
      expect(phoneLimiter.hit('+16262987128')).toBe(true);
    });

    it('records a Twilio 21610 (unsubscribed) response in handld.sms_opt_outs', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () =>
          JSON.stringify({ code: 21610, message: 'Attempt to send to unsubscribed recipient', status: 400 }),
      });
      const res = await submit(validBody);
      expect(res.statusCode).toBe(200);
      expect(res.payload).toMatchObject({ smsSent: false, smsSkipped: 'send_failed' });
      expect(dbRows.filter((r) => r.table === 'sms_opt_outs' && r.op === 'upsert').map((r) => r.row)).toEqual([
        { phone: '+16262987128', source: 'twilio_21610', keyword: null },
      ]);
    });

    it('does not record an opt-out for other Twilio errors', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ code: 21211, message: 'Invalid To number', status: 400 }),
      });
      const res = await submit(validBody);
      expect(res.statusCode).toBe(200);
      expect(res.payload).toMatchObject({ smsSent: false, smsSkipped: 'send_failed' });
      expect(dbCalls).not.toContain('sms_opt_outs.upsert');
    });
  });
});
