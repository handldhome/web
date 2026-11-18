import { describe, expect, it } from 'vitest';
import { createRateLimiter, getClientIp } from '@/lib/rateLimit';

describe('createRateLimiter', () => {
  it('allows up to the limit, then blocks, per key', () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => t });
    expect(limiter.hit('a')).toBe(true);
    expect(limiter.hit('a')).toBe(true);
    expect(limiter.hit('a')).toBe(true);
    expect(limiter.hit('a')).toBe(false);
    expect(limiter.hit('b')).toBe(true);
  });

  it('frees up as hits slide out of the window', () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(limiter.hit('a')).toBe(true); // t=0
    t = 500;
    expect(limiter.hit('a')).toBe(true); // t=500
    expect(limiter.hit('a')).toBe(false);
    t = 1000; // the t=0 hit has expired
    expect(limiter.hit('a')).toBe(true);
    expect(limiter.hit('a')).toBe(false);
  });

  it('blocked attempts do not extend the window', () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    expect(limiter.hit('a')).toBe(true);
    t = 900;
    expect(limiter.hit('a')).toBe(false);
    t = 1000;
    expect(limiter.hit('a')).toBe(true);
  });

  it('caps the number of tracked keys', () => {
    const t = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2, now: () => t });
    expect(limiter.hit('a')).toBe(true);
    expect(limiter.hit('b')).toBe(true);
    expect(limiter.hit('c')).toBe(true); // evicts 'a', the oldest
    expect(limiter.hit('a')).toBe(true);
    expect(limiter.hit('c')).toBe(false);
  });

  it('reset clears every key', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    limiter.hit('a');
    limiter.reset();
    expect(limiter.hit('a')).toBe(true);
  });
});

describe('getClientIp', () => {
  it('uses the first x-forwarded-for address', () => {
    expect(getClientIp({ headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' } })).toBe('203.0.113.7');
  });

  it('falls back to x-real-ip, then the socket', () => {
    expect(getClientIp({ headers: { 'x-real-ip': '203.0.113.8' } })).toBe('203.0.113.8');
    expect(getClientIp({ headers: {}, socket: { remoteAddress: '127.0.0.1' } })).toBe('127.0.0.1');
    expect(getClientIp({ headers: {} })).toBe('unknown');
  });
});
