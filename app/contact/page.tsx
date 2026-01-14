"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    optInOffersNews: false,
    optInCustomerUpdates: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build email body with form data and opt-in preferences
    const smsPreferences = [];
    if (formData.optInOffersNews) {
      smsPreferences.push("✓ Opted in to receive text messages for offers and news");
    }
    if (formData.optInCustomerUpdates) {
      smsPreferences.push("✓ Opted in to receive text messages for customer updates");
    }

    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}

Message:
${formData.message}

---
SMS Text Message Preferences:
${smsPreferences.length > 0 ? smsPreferences.join("\n") : "No SMS opt-ins selected"}

Submitted: ${new Date().toLocaleString()}
    `.trim();

    const mailtoLink = `mailto:Concierge@HandldHome.com?subject=${encodeURIComponent(
      `Contact Form: ${formData.name}`
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-navy mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="font-serif text-2xl text-navy mb-2">Almost There!</h2>
            <p className="text-gray-700">
              Your email client should have opened with your message. Please click send to complete your submission.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              If your email client didn&apos;t open, you can email us directly at{" "}
              <a href="mailto:Concierge@HandldHome.com" className="text-brandBlue hover:underline">
                Concierge@HandldHome.com
              </a>
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-brandBlue hover:text-navy underline"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-navy mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-transparent outline-none transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-navy mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-transparent outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-navy mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-transparent outline-none transition"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-navy mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-transparent outline-none transition resize-none"
                placeholder="How can we help you?"
              />
            </div>

            {/* SMS Consent Disclosure */}
            <p className="text-xs text-gray-600 leading-relaxed">
              By submitting this form and signing up for texts, you consent to receive
              informational text messages (e.g., appointment notifications) from Handld Home
              at the number provided. Consent is not a condition of purchase. Msg &amp; data
              rates may apply. Msg frequency varies. Unsubscribe anytime by replying STOP.
              Reply HELP for help.{" "}
              <Link href="/privacy" className="text-brandBlue hover:underline">
                Privacy Policy
              </Link>
              {" & "}
              <Link href="/terms" className="text-brandBlue hover:underline">
                Terms
              </Link>
            </p>

            {/* SMS Opt-In Checkboxes */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium text-navy">
                Text Message Preferences
              </h3>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="optInOffersNews"
                  checked={formData.optInOffersNews}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-brandBlue border-gray-300 rounded focus:ring-brandBlue cursor-pointer"
                />
                <span className="text-gray-700 text-sm leading-relaxed">
                  Yes, I would like to opt in to receive text messages from
                  Handld Home for offers and news.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="optInCustomerUpdates"
                  checked={formData.optInCustomerUpdates}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-brandBlue border-gray-300 rounded focus:ring-brandBlue cursor-pointer"
                />
                <span className="text-gray-700 text-sm leading-relaxed">
                  Yes, I would like to opt in to receive text messages from
                  Handld Home for customer updates.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-brandBlue text-white font-medium py-3 px-6 rounded-lg hover:bg-navy transition duration-200"
            >
              Send Message
            </button>

            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our{" "}
              <Link href="/privacy" className="text-brandBlue hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="text-brandBlue hover:underline">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
