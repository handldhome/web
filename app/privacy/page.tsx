import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Handld Home LLC",
  description: "What Handld Home collects, why, who processes it, and your choices.",
};

const EFFECTIVE_DATE = "2026-11-25";

const h2 = "font-serif text-2xl text-navy mt-10 mb-4";
const p = "text-gray-700 leading-relaxed mb-4";
const ul = "list-disc pl-6 text-gray-700 leading-relaxed mb-4 space-y-2";
const link = "text-brandBlue underline hover:text-navy";

function Email() {
  return (
    <a href="mailto:Concierge@HandldHome.com" className={link}>
      Concierge@HandldHome.com
    </a>
  );
}

export default function PrivacyPage() {
  // Only a real address is ever rendered; never a placeholder.
  const postalAddress = process.env.COMPANY_POSTAL_ADDRESS?.trim();

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-navy mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Effective {EFFECTIVE_DATE}</p>

        <p className={p}>
          This policy explains what Handld Home LLC collects when you use handldhome.com, request a quote,
          book a service or work with us as a technician, why we collect it, who processes it for us, and
          the choices you have. We have kept it short and specific to what we actually do.
        </p>

        <h2 className={h2}>Who we are</h2>
        <p className={p}>
          Handld Home LLC (&quot;Handld&quot;, &quot;we&quot;, &quot;us&quot;) is a California limited liability company that
          provides home maintenance services in and around Pasadena, California. You can reach us at{" "}
          <Email /> or (626) 298-7128.
        </p>

        <h2 className={h2}>What we collect</h2>
        <p className={p}>We collect only what we need to quote, schedule and deliver the service you asked for.</p>
        <ul className={ul}>
          <li>
            <strong>Contact details.</strong> Your name, email address and, if you choose to give it, your
            mobile number.
          </li>
          <li>
            <strong>Property details.</strong> The service address and facts about the home that affect
            pricing, such as square footage, number of stories and lot size. When you enter an address on our
            quote form we look it up with RentCast, a property data service, to fill these in; you can correct
            or enter them yourself instead.
          </li>
          <li>
            <strong>Quote and job records.</strong> The services you selected, your preferred dates and
            times, notes you give us about the work (for example a handyman project or a plumbing issue),
            the quotes we send you, appointments, job status and any referral code you used or shared.
          </li>
          <li>
            <strong>Photos.</strong> Photos our technicians take of the work area before and after a job, and
            photos taken during a home tune-up inspection, so you can see what was done and what we found.
          </li>
          <li>
            <strong>Messages.</strong> Text messages and emails exchanged with us, including your replies.
          </li>
          <li>
            <strong>Payment status.</strong> Invoice amounts and whether they have been paid. Our payment
            processor handles card numbers; we never see or store full card details.
          </li>
          <li>
            <strong>Text messaging consent.</strong> If you agree to receive texts, we record the wording you
            agreed to, the date and time, your IP address and browser, so we can show that you opted in.
          </li>
          <li>
            <strong>Technical data.</strong> Our hosting provider keeps standard server logs, including IP
            addresses and request times, for security and troubleshooting. Our quote form also uses your IP
            address, briefly and in memory only, to limit abuse.
          </li>
          <li>
            <strong>Technicians.</strong> If you work with us as a technician we also collect your onboarding
            information, availability, the jobs assigned to you and the tax forms required to pay you.
          </li>
        </ul>
        <h2 className={h2}>Why we use it</h2>
        <ul className={ul}>
          <li>To prepare and send your quote and to answer your questions about it.</li>
          <li>To schedule, confirm, reschedule and perform the services you book.</li>
          <li>To send service texts and emails such as your quote link, appointment confirmations, technician on-the-way and job-complete updates.</li>
          <li>To invoice you and keep track of payment.</li>
          <li>To run your customer account and referral program if you use them.</li>
          <li>To keep our site and systems secure and to prevent abuse.</li>
          <li>To meet our legal, tax and insurance obligations.</li>
        </ul>
        <p className={p}>
          We do not use your information for advertising, and we do not build profiles of you for marketing.
        </p>

        <h2 className={h2}>Text messages</h2>
        <p className={p}>
          We only text you if you have agreed to it, for example by ticking the consent box on our quote form,
          by replying YES to a consent request, or by texting us first. Texts are about your quote,
          appointments and service. We do not send marketing texts unless you separately agree to receive
          offers. Message frequency varies and message and data rates may apply. Reply STOP to any message
          to stop, or HELP for help. Our full texting terms are at{" "}
          <a href="/sms-terms" className={link}>
            handldhome.com/sms-terms
          </a>
          .
        </p>
        <p className={p}>
          Mobile information and text messaging opt-in data and consent will not be sold or shared with third
          parties or affiliates for their marketing or promotional purposes.
        </p>

        <h2 className={h2}>Who processes it for us</h2>
        <p className={p}>
          We do not sell your personal information and we do not share it with anyone for advertising. We
          share it only with service providers who process it on our behalf and under our instructions, and
          with the technician assigned to your job so they can do the work. Those providers are:
        </p>
        <ul className={ul}>
          <li><strong>Vercel</strong> hosts this website and keeps server logs.</li>
          <li><strong>Supabase</strong> hosts our database and the sign-in system for customer accounts.</li>
          <li><strong>Twilio</strong> delivers our text messages.</li>
          <li><strong>Resend</strong> delivers our emails.</li>
          <li><strong>RentCast</strong> looks up property details from the address you give us.</li>
          <li><strong>Cloudinary</strong> stores job and inspection photos.</li>
          <li><strong>Stripe</strong> and <strong>QuickBooks</strong> handle payments and invoicing where used.</li>
          <li><strong>Anthropic</strong> tidies the wording of technician notes in home tune-up reports. Only the note text is sent, not your contact details.</li>
        </ul>
        <p className={p}>
          We may also disclose information if the law requires it, to protect our rights or safety, or as
          part of a sale or merger of our business, in which case this policy would continue to apply.
        </p>

        <h2 className={h2}>Cookies and tracking</h2>
        <p className={p}>
          We do not use advertising pixels, analytics trackers or social media tracking on this site. The
          only cookies we set are the sign-in cookies for the customer account area, which keep you logged in.
          Fonts are served from our own site, not from a third party.
        </p>
        <p className={p}>
          Our home page shows our Yelp rating using a small script loaded from Yelp. When that script loads,
          Yelp receives your IP address and browser details and may set its own cookies under Yelp&apos;s
          privacy policy. Nothing else on our site talks to a third party from your browser.
        </p>

        <h2 className={h2}>How long we keep it</h2>
        <p className={p}>
          We keep quote, job, invoice and message records for as long as you are a customer and afterwards
          for as long as we need them for tax, accounting, insurance and legal purposes, which is generally up
          to seven years. Text messaging consent and opt-out records are kept for as long as we might text
          you plus four years, so we can show you opted in or out. Photos are kept with the job record. If
          you ask us to delete your information we will do so unless we have to keep it for one of these
          reasons.
        </p>

        <h2 className={h2}>Your choices</h2>
        <ul className={ul}>
          <li>Reply STOP to any text to stop receiving texts from us. Reply START to resubscribe.</li>
          <li>
            Email <Email /> to see, correct or delete the information we hold about you, or to ask a
            question about this policy. We will reply within 30 days.
          </li>
          <li>You can request a quote without giving us a phone number; we will show you the quote link on screen and email you instead.</li>
          <li>You can sign out of your customer account at any time to remove the sign-in cookie.</li>
        </ul>
        <p className={p}>We will not treat you differently for exercising any of these choices.</p>

        <h2 className={h2}>California residents</h2>
        <p className={p}>
          This notice is provided under the California Online Privacy Protection Act and the California
          Consumer Privacy Act.
        </p>
        <ul className={ul}>
          <li>
            <strong>Categories collected.</strong> Identifiers (name, email, phone, IP address), customer
            records (service address, property details, quotes, jobs, invoices), communications with us, and
            photos of the work area. For technicians, also professional and employment information and tax
            forms.
          </li>
          <li>
            <strong>Third parties.</strong> We disclose personal information only to the service providers
            listed above, for the business purposes described above. We do not sell personal information and
            we do not share it for cross-context behavioural advertising, and have not done so in the past 12
            months.
          </li>
          <li>
            <strong>Your rights.</strong> You may ask what personal information we hold about you, ask us to
            correct or delete it, and you will not be discriminated against for doing so. Email <Email />.
            We will verify your request using the email address or phone number on your account. You may
            use an authorised agent; we will ask for proof that you gave them permission.
          </li>
          <li>
            <strong>Do Not Track.</strong> Our site does not respond to Do Not Track browser signals, because
            we do not track visitors across other sites in the first place.
          </li>
        </ul>

        <h2 className={h2}>Children</h2>
        <p className={p}>
          Our services are for homeowners and adults authorised to act for them. The site is not directed to
          anyone under 18 and we do not knowingly collect information from anyone under 18. If you believe a
          minor has given us information, email <Email /> and we will delete it.
        </p>

        <h2 className={h2}>Security</h2>
        <p className={p}>
          Data is encrypted in transit and at rest with our providers. Access to customer records is limited
          to the people who need it to serve you. No system is perfectly secure, so if we learn of a breach
          that affects you we will tell you as the law requires.
        </p>

        <h2 className={h2}>Changes</h2>
        <p className={p}>
          If we change this policy we will post the new version here with a new effective date. If a change
          is significant we will also tell you by email or text.
        </p>

        <h2 className={h2}>Contact</h2>
        <p className={p}>
          Handld Home LLC
          <br />
          <Email />
          <br />
          (626) 298-7128
          {postalAddress ? (
            <>
              <br />
              {postalAddress}
            </>
          ) : null}
        </p>

        <hr className="border-gray-200 my-8" />

        <p className="text-center text-gray-500 text-sm">
          TM &amp; &copy; 2026 Handld Home LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
}
