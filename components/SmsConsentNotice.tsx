import SmsConsentLabel from './SmsConsentLabel';

// Server-rendered small print that mirrors the consent checkbox in the quote
// form. The form itself only mounts in the browser, so without this the
// consent language would be missing from the raw HTML of / and /quote.
export default function SmsConsentNotice() {
  return (
    <section
      aria-label="Text messaging consent"
      className="bg-white border-t border-[#2A54A1]/10 px-4 md:px-6 py-4"
    >
      <p className="max-w-7xl mx-auto font-body text-xs text-[#2A54A1]/60 leading-relaxed text-center">
        <span className="font-medium">Text messaging consent on our quote form: </span>
        <SmsConsentLabel linkClassName="underline hover:text-[#2A54A1]" />
      </p>
    </section>
  );
}
