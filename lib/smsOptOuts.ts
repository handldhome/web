// Shared opt-out list (handld.sms_opt_outs) used before every outbound text.
//
// Twilio already blocks sends to numbers that replied STOP (error 21610), but
// we keep our own list so the block survives number changes and covers
// natural-language revocations recorded by the inbound webhook. Phones are
// E.164 (+1XXXXXXXXXX); callers pass the output of normalizeUsMobile.

import { getHandldDb } from '@/lib/supabase/handld';

/** Twilio error code: the recipient has unsubscribed from this number. */
export const TWILIO_UNSUBSCRIBED_CODE = 21610;

export async function isOptedOut(phoneE164: string): Promise<boolean> {
  const { data, error } = await getHandldDb()
    .from('sms_opt_outs')
    .select('phone')
    .eq('phone', phoneE164)
    .maybeSingle();
  if (error) {
    // Fail closed: if we cannot read the opt-out list, do not text.
    console.error('sms_opt_outs lookup error:', error);
    return true;
  }
  return !!data;
}

export async function recordTwilioOptOut(phoneE164: string): Promise<void> {
  const { error } = await getHandldDb()
    .from('sms_opt_outs')
    .upsert({ phone: phoneE164, source: 'twilio_21610', keyword: null }, { onConflict: 'phone' });
  if (error) console.error('sms_opt_outs upsert error:', error);
  else console.warn('Recorded Twilio 21610 opt-out for', phoneE164);
}

/** Reads Twilio's JSON error code out of a failed Messages.json response body. */
export function twilioErrorCode(responseText: string): number | null {
  try {
    const parsed = JSON.parse(responseText);
    return typeof parsed?.code === 'number' ? parsed.code : null;
  } catch {
    return null;
  }
}
