import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Handld Home LLC",
  description: "Customer Terms and Conditions for Handld Home LLC Services",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-navy mb-8">
          Customer Terms and Conditions
        </h1>

        <div className="bg-cream border border-gray-200 rounded-lg p-6 mb-8">
          <p className="text-gray-700 leading-relaxed text-sm">
            BY CLICKING THE &quot;I ACCEPT&quot; BUTTON, OR OTHERWISE ACCEPTING THIS AGREEMENT THROUGH THE
            CUSTOMER QUOTE THAT INCORPORATES THESE TERMS (THE &quot;CUSTOMER QUOTE&quot;), CUSTOMER
            (HEREINAFTER &quot;YOU&quot; OR &quot;YOUR&quot;) AGREES TO BE BOUND BY AND TO COMPLY WITH THE TERMS AND
            CONDITIONS OF THIS CUSTOMER TERMS AND CONDITIONS AGREEMENT (THE &quot;AGREEMENT&quot;). IF YOU
            ARE ENTERING INTO THIS AGREEMENT ON BEHALF OF A COMPANY OR OTHER LEGAL ENTITY, YOU
            REPRESENT THAT YOU HAVE THE AUTHORITY TO BIND SUCH ENTITY TO THESE TERMS, IN WHICH CASE
            &quot;YOU&quot; OR &quot;YOUR&quot; SHALL REFER TO SUCH ENTITY. IF YOU DO NOT HAVE SUCH AUTHORITY, OR IF
            YOU DO NOT AGREE TO BE BOUND BY THESE TERMS, YOU MUST NOT ACCEPT THIS AGREEMENT AND MAY
            NOT USE THE SERVICES.
          </p>
        </div>

        <h2 className="font-serif text-2xl text-navy mt-10 mb-4">Recitals</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          WHEREAS, HANDLD HOME, LLC (&quot;HH&quot; or &quot;the Company&quot;), a California limited liability company
          (&quot;Company&quot;), provides a variety of home maintenance services;
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          WHEREAS, CUSTOMER desires to hire HH to perform home maintenance services; and
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          WHEREAS, the parties desire to enter into this Agreement under the terms and conditions set forth herein.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties
          agree as follows:
        </p>

        <h2 className="font-serif text-2xl text-navy mt-10 mb-4">Agreement</h2>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">1. Services</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Company provides home maintenance services, including but not limited to window washing, gutter
          cleaning, pressure washing, outdoor furniture cleaning, pest control, mobile car wash and detailing,
          and general handyman services (collectively, the &quot;Services&quot;).
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>1.1. Customer Quote.</strong> YOU will receive YOUR CUSTOMER QUOTE for the Service(s) YOU
          select. The CUSTOMER QUOTE will include, among other things, a general description of each Service
          and its current price. YOU should review YOUR CUSTOMER QUOTE closely before accepting your order.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>1.2. Customer Approval &amp; Scheduling.</strong> YOU must approve YOUR CUSTOMER QUOTE by
          clicking the &quot;BOOK&quot; button to order Services. Upon approval, HH will schedule YOUR Services and
          send YOU a text notification at the authorized number.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">2. Inclement Weather</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>2.1 Postponement or Cancellation.</strong> At HH&apos;s sole discretion, Services may be postponed
          or cancelled in the event of inclement weather. For purposes of this Agreement, &quot;inclement weather&quot;
          includes, but is not limited to, active rainfall, thunderstorms, lightning, hail, snow, or sustained
          wind gusts at or above fifty (50) miles per hour, or other conditions that HH reasonably determines
          would make performance of the Services unsafe, impractical, or likely to cause damage.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>2.2 Notice.</strong> In the event of a cancellation or postponement under this Section, HH
          will provide notice to YOU by text message at the contact number YOU provided in the CUSTOMER QUOTE.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>2.3 Reschedule.</strong> In the event of postponement or cancellation of Services under this
          section, HH will reschedule YOUR Services and send YOU a text notification at the authorized number.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">3. Service Area</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Services are currently available in Pasadena, South Pasadena, San Marino, La Cañada, and Glendale,
          California. Service areas are subject to change at the Company&apos;s sole discretion.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">4. Pricing</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>4.1 Obligation to Pay.</strong> YOU agree to pay HH the full order price for all Services ordered.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>4.2 Pricing.</strong> Prices for Services are determined at HH&apos;s sole discretion and may be
          changed at any time without prior notice. HH currently offers two pricing tiers: Standard and Member.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>4.3 Applicable Pricing.</strong> YOU will be charged the prices in effect at the time you
          agree to the CUSTOMER QUOTE.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">5. Membership Program</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>5.1. Benefits.</strong> The HH Membership Program (&quot;Membership&quot;) provides YOU with benefits,
          including access to Member Pricing and priority scheduling. Benefits may be modified, discontinued,
          or replaced at HH&apos;s sole discretion, with or without notice to YOU.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>5.2. Qualification &amp; Enrollment.</strong> To qualify for Membership, YOU must: (a) order,
          accept, and pay for three (3) distinct Services; and (b) pay the Membership Program fee then in effect
          at the time of enrollment, as set forth in YOUR CUSTOMER QUOTE.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>5.3. Membership Fee.</strong>
        </p>
        <ul className="list-none pl-6 text-gray-700 leading-relaxed mb-4 space-y-2">
          <li>
            <strong>5.3.1. Fee.</strong> The Membership Fee (the &quot;FEE&quot;) is determined by HH in its sole
            discretion and may change from time to time without notice. If YOU qualify for Membership, the FEE
            will be disclosed to YOU at the then-current rate prior to confirming YOUR CUSTOMER QUOTE.
          </li>
          <li>
            <strong>5.3.2. Customer Acceptance.</strong> If YOUR order qualifies, YOU will be offered Membership
            in YOUR CUSTOMER QUOTE. YOU must affirmatively agree to Membership at the time YOU book YOUR Services.
          </li>
          <li>
            <strong>5.3.3. Term &amp; Cancellation.</strong> YOUR Membership will remain in effect until YOU cancel.
            YOU may cancel at any time by following the Membership link provided by HH or by emailing{" "}
            <a href="mailto:Concierge@HandldHome.com" className="text-brandBlue underline hover:text-navy">
              Concierge@HandldHome.com
            </a>
          </li>
          <li>
            <strong>5.3.5. No Refunds.</strong> All Membership Fees are non-refundable once charged, regardless
            of whether YOU cancel, fail to use, or otherwise do not take advantage of Membership benefits.
          </li>
        </ul>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">6. Customer Cancellation, Rescheduling</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>6.1. Cancellation.</strong> YOU may cancel any Service(s) by clicking the link in YOUR text
          notification or by emailing{" "}
          <a href="mailto:Concierge@HandldHome.com" className="text-brandBlue underline hover:text-navy">
            Concierge@HandldHome.com
          </a>.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>6.2. No Cancellation Fee.</strong> YOU may cancel any Service(s) for any reason without cost
          to YOU up to 24 hours in advance of the scheduled Service delivery. Cancellation of any Service(s)
          within 24 hours of delivery shall be subject to HH&apos;s Cancellation Fee.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>6.3. Cancellation Fee.</strong> YOU agree to pay a Cancellation Fee equal to 50% of the
          Service Price if YOU cancel YOUR Services within 24 hours of delivery.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>6.4. Rescheduling.</strong> YOU will be solely responsible for rescheduling YOUR Service(s)
          by clicking the link in YOUR text notification or by emailing{" "}
          <a href="mailto:Concierge@HandldHome.com" className="text-brandBlue underline hover:text-navy">
            Concierge@HandldHome.com
          </a>.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">7. Payment Terms</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>7.1 Payment.</strong> Service fees shall be charged to the payment method on file at the
          time of completion.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>7.2 Non-Payment.</strong> Failure to pay the full amount due in accordance with the Payment
          Terms set forth herein for any reason whatsoever, including for insufficient funds, will result in
          suspension or cancellation of future Services until all outstanding amounts are paid in full. HH
          reserves the right to charge interest on overdue balances at the maximum rate permitted by law and
          to recover any costs of collection, including reasonable attorneys&apos; fees.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">8. Your Obligations</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>8.1 Access to Premises.</strong> YOU shall provide HH with adequate access to the premises
          and specific Service area. YOU shall provide, in advance, any special instructions necessary to gain access.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>8.2 Pets.</strong> YOU shall restrain all pets prior to and during delivery of Services.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>8.3 Utilities.</strong> YOU agree that YOU shall provide, at YOUR sole expense, necessary
          utilities, including water and electricity, required to perform Services. YOU further agree to
          ensure access to and availability of necessary utilities.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>8.4 Safety.</strong> YOU shall take all reasonable steps to ensure that the premises and
          Service area are free from dangerous conditions, debris, personal items, and other obstacles. YOU
          will ensure that driveways and surrounding work areas are clear and maintained in a safe condition
          for HH to perform Services.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>8.5 Failure to Secure.</strong> If YOU fail to comply with the obligations set forth in
          this Section, HH may, in its sole discretion, suspend, reschedule, or cancel Services, and may
          charge additional fees for any resulting delays or return visits.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>8.6. Indemnification.</strong> YOU agree to indemnify, defend, and hold harmless HH, its
          officers, employees, agents, and contractors from and against any and all claims, damages, losses,
          liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related
          to (a) YOUR failure to comply with the obligations set forth in this Section, (b) YOUR negligence,
          willful misconduct, or omission, or (c) any dangerous condition on the premises that YOU knew of or
          should have known of and failed to remedy or disclose.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>8.7 Additional Obligations.</strong> YOU agree to be bound by any additional obligations
          set forth in the CUSTOMER QUOTE.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">9. Image Use, Rights &amp; Release</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          YOU agree and consent to HH&apos;s right to take, use, and publish photographs or images as set forth
          in the Publicity Consent, Release &amp; Waiver (In Perpetuity) attached hereto and incorporated into
          this Agreement as Addendum A.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">10. Digital Communication</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          YOU agree and consent to the terms of the Consent to Receive Communication attached hereto and
          incorporated into this Agreement as Addendum B.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">11. Force Majeure</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          HH shall not be liable for any delay or failure in performing Services caused by events beyond its
          reasonable control, including, but not limited to, inclement weather, natural disasters, fire, flood,
          strikes or labor disputes, acts of God, pandemics, or government actions or regulations. In the event
          of such delays, HH may, in its sole discretion, reschedule Services without liability to YOU.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">12. Insurance</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          HH maintains insurance coverage, including (a) a $2,000,000 umbrella liability policy and (b) a
          $1,000,000 general liability policy. Such coverage is maintained for the benefit of HH and is not
          intended to cover or protect YOU or YOUR property.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">13. Entire Agreement</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          This Agreement, together with any Addendum and CUSTOMER QUOTE executed in connection herewith,
          constitutes the entire understanding between the parties with respect to the subject matter herein
          and supersedes all prior oral or written agreements, communications, or understandings between the
          parties. No amendment or modification of this Agreement shall be binding unless in writing and signed
          by an authorized representative of HH.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">14. Severability</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          If any provision of this Agreement is determined to be invalid, illegal, or unenforceable by a court
          of competent jurisdiction, the remaining provisions shall remain in full force and effect and shall
          be interpreted so as to give effect to the original intent of the parties to the fullest extent
          permitted by law.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">15. Choice of Law</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          This Agreement shall be governed by, interpreted, and construed in accordance with the laws of the
          State of California, without regard to its conflict of laws principles.
        </p>

        <h3 className="font-semibold text-lg text-navy mt-8 mb-3">16. Consent to Terms of Agreement</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          YOU acknowledge that YOU have read and understand this Agreement, including any Addenda and CUSTOMER
          QUOTE, and YOU agree to be bound by all of the terms and conditions herein.
        </p>

        <hr className="border-gray-200 my-8" />

        <p className="text-center text-gray-500 text-sm">
          TM &amp; © 2025 Handld Home LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
}
