// Handld Home Text Messaging Terms. Rendered on /sms-terms and as Addendum B
// of /terms. Wording follows the shared SMS compliance spec; edit there first.

export const SMS_TERMS_EFFECTIVE_DATE = '2026-11-25';

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Program',
    body: (
      <>
        Handld Home LLC (&quot;Handld&quot;) sends text messages to customers and technicians who opt in, from
        (626) 298-7167. Customer messages are about your quote, appointments and service: quote links,
        booking and appointment confirmations, reschedules, technician on-the-way and job-complete updates,
        and replies to your questions. Technician messages are about jobs, schedules and availability. We do
        not send marketing texts unless you separately agree to receive offers.
      </>
    ),
  },
  {
    title: 'How you opt in',
    body: (
      <>
        By ticking the SMS consent box on our quote form or technician onboarding form, by replying YES to a
        consent request, or by texting us first.
      </>
    ),
  },
  {
    title: 'Frequency',
    body: <>Message frequency varies with your quote and appointment activity.</>,
  },
  {
    title: 'Cost',
    body: <>Message and data rates may apply. Check with your carrier.</>,
  },
  {
    title: 'Opt out',
    body: (
      <>
        Reply STOP to any message to stop receiving texts from that number. You will get one confirmation
        text. You can also email{' '}
        <a href="mailto:Concierge@HandldHome.com" className="text-brandBlue underline hover:text-navy">
          Concierge@HandldHome.com
        </a>{' '}
        or call (626) 298-7128 and we will honour the request within 10 business days, usually immediately.
        Reply START to resubscribe.
      </>
    ),
  },
  {
    title: 'Help',
    body: (
      <>
        Reply HELP, call (626) 298-7128 or email{' '}
        <a href="mailto:Concierge@HandldHome.com" className="text-brandBlue underline hover:text-navy">
          Concierge@HandldHome.com
        </a>
        .
      </>
    ),
  },
  {
    title: 'Carriers',
    body: <>Carriers are not liable for delayed or undelivered messages.</>,
  },
  {
    title: 'Privacy',
    body: (
      <>
        Mobile information and text messaging opt-in data and consent will not be sold or shared with third
        parties or affiliates for their marketing or promotional purposes. Our full Privacy Policy is at{' '}
        <a href="/privacy" className="text-brandBlue underline hover:text-navy">
          /privacy
        </a>
        .
      </>
    ),
  },
  {
    title: 'Changes',
    body: (
      <>
        We may update these terms; the current version is always at handldhome.com/sms-terms. Effective{' '}
        {SMS_TERMS_EFFECTIVE_DATE}.
      </>
    ),
  },
];

export default function SmsTerms() {
  // Only a real address is ever rendered; never a placeholder.
  const postalAddress = process.env.COMPANY_POSTAL_ADDRESS?.trim();

  return (
    <div>
      <ol className="list-decimal pl-6 text-gray-700 leading-relaxed space-y-4">
        {SECTIONS.map((s) => (
          <li key={s.title}>
            <strong>{s.title}.</strong> {s.body}
          </li>
        ))}
      </ol>

      <p className="text-gray-700 leading-relaxed mt-8">
        Handld Home LLC &middot;{' '}
        <a href="mailto:Concierge@HandldHome.com" className="text-brandBlue underline hover:text-navy">
          Concierge@HandldHome.com
        </a>{' '}
        &middot; (626) 298-7128
        {postalAddress ? <> &middot; {postalAddress}</> : null}
      </p>
    </div>
  );
}
