import type { Metadata } from "next";
import SmsTerms, { SMS_TERMS_EFFECTIVE_DATE } from "@/components/SmsTerms";

export const metadata: Metadata = {
  title: "Text Messaging Terms - Handld Home",
  description: "How Handld Home uses text messages, how you opt in, and how to opt out.",
};

export default function SmsTermsPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-navy mb-2">
          Handld Home Text Messaging Terms (SMS Terms)
        </h1>
        <p className="text-gray-500 mb-8">Effective {SMS_TERMS_EFFECTIVE_DATE}</p>

        <SmsTerms />

        <hr className="border-gray-200 my-8" />

        <p className="text-center text-gray-500 text-sm">
          These terms are also Addendum B of our{" "}
          <a href="/terms" className="text-brandBlue underline hover:text-navy">
            Customer Terms and Conditions
          </a>
          .
        </p>
      </div>
    </div>
  );
}
