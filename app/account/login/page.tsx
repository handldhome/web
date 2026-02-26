'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type LoginMethod = 'email' | 'phone';
type Step = 'input' | 'verify' | 'email-sent';

export default function LoginPage() {
  const [method, setMethod] = useState<LoginMethod>('phone');
  const [step, setStep] = useState<Step>('input');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format phone for display
  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    if (method === 'email') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setStep('email-sent');
      }
    } else {
      // Phone login - send OTP
      const formattedPhone = `+1${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        setError(error.message);
      } else {
        setStep('verify');
      }
    }

    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const formattedPhone = `+1${phone}`;

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otpCode,
      type: 'sms',
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Redirect to account page on success
      window.location.href = '/account';
    }
  };

  const resetForm = () => {
    setStep('input');
    setEmail('');
    setPhone('');
    setOtpCode('');
    setError(null);
  };

  // Email sent confirmation
  if (step === 'email-sent') {
    return (
      <div className="min-h-screen bg-[#FFFFF2] flex flex-col items-center justify-center px-4">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
          .font-display { font-family: 'Libre Baskerville', serif; }
          .font-body { font-family: 'DM Sans', sans-serif; }
          .shadow-retro { box-shadow: 8px 8px 0px rgba(42, 84, 161, 0.15); }
          .cta-button {
            background: linear-gradient(135deg, #2A54A1 0%, #1e3d7a 100%);
            box-shadow: 0 4px 15px rgba(42, 84, 161, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(42, 84, 161, 0.4);
          }
        `}</style>

        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Handld Home Services"
                width={160}
                height={80}
                className="mx-auto h-16 w-auto"
              />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="font-display text-2xl font-bold text-[#2A54A1] mb-3">Check your email</h1>
            <p className="font-body text-[#2A54A1]/80 mb-6">
              We sent a sign-in link to<br />
              <span className="font-medium text-[#2A54A1]">{email}</span>
            </p>
            <p className="font-body text-sm text-[#2A54A1]/60">
              Click the link in your email to access your account. The link expires in 1 hour.
            </p>

            <button
              onClick={resetForm}
              className="mt-6 font-body text-[#2A54A1] hover:underline text-sm"
            >
              Use a different method
            </button>
          </div>
        </div>
      </div>
    );
  }

  // OTP verification step for phone
  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-[#FFFFF2] flex flex-col items-center justify-center px-4">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
          .font-display { font-family: 'Libre Baskerville', serif; }
          .font-body { font-family: 'DM Sans', sans-serif; }
          .shadow-retro { box-shadow: 8px 8px 0px rgba(42, 84, 161, 0.15); }
          .cta-button {
            background: linear-gradient(135deg, #2A54A1 0%, #1e3d7a 100%);
            box-shadow: 0 4px 15px rgba(42, 84, 161, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(42, 84, 161, 0.4);
          }
        `}</style>

        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Handld Home Services"
                width={160}
                height={80}
                className="mx-auto h-16 w-auto"
              />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-8">
            <div className="w-16 h-16 bg-[#2A54A1]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#2A54A1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="font-display text-2xl font-bold text-[#2A54A1] text-center mb-2">
              Enter verification code
            </h1>
            <p className="font-body text-[#2A54A1]/80 text-center mb-6">
              We sent a 6-digit code to<br />
              <span className="font-medium text-[#2A54A1]">{formatPhoneDisplay(phone)}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="font-body w-full px-4 py-3 border-2 border-[#2A54A1]/20 rounded-xl focus:ring-2 focus:ring-[#2A54A1] focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl font-body text-sm border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="cta-button w-full text-white py-3 px-4 rounded-full font-body font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify & Sign In'
                )}
              </button>
            </form>

            <button
              onClick={resetForm}
              className="mt-6 font-body text-[#2A54A1] hover:underline text-sm w-full text-center"
            >
              Use a different number
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial input step
  return (
    <div className="min-h-screen bg-[#FFFFF2] flex flex-col items-center justify-center px-4">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
        .font-display { font-family: 'Libre Baskerville', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        .shadow-retro { box-shadow: 8px 8px 0px rgba(42, 84, 161, 0.15); }
        .cta-button {
          background: linear-gradient(135deg, #2A54A1 0%, #1e3d7a 100%);
          box-shadow: 0 4px 15px rgba(42, 84, 161, 0.3);
          transition: all 0.3s ease;
        }
        .cta-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(42, 84, 161, 0.4);
        }
      `}</style>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Handld Home Services"
              width={160}
              height={80}
              className="mx-auto h-16 w-auto"
            />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-8">
          <h1 className="font-display text-2xl font-bold text-[#2A54A1] text-center mb-2">
            Welcome back
          </h1>
          <p className="font-body text-[#2A54A1]/80 text-center mb-6">
            Sign in to access your account
          </p>

          {/* Method toggle */}
          <div className="flex bg-[#FBF9F0] rounded-xl p-1 mb-6 border border-[#2A54A1]/10">
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-body text-sm font-medium transition ${
                method === 'phone'
                  ? 'bg-white text-[#2A54A1] shadow-sm'
                  : 'text-[#2A54A1]/60 hover:text-[#2A54A1]'
              }`}
            >
              Phone
            </button>
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-body text-sm font-medium transition ${
                method === 'email'
                  ? 'bg-white text-[#2A54A1] shadow-sm'
                  : 'text-[#2A54A1]/60 hover:text-[#2A54A1]'
              }`}
            >
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {method === 'phone' ? (
              <div>
                <label htmlFor="phone" className="block font-body text-sm font-medium text-[#2A54A1] mb-2">
                  Phone number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-[#2A54A1]/60">+1</span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    value={formatPhoneDisplay(phone)}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    required
                    className="font-body w-full pl-12 pr-4 py-3 border-2 border-[#2A54A1]/20 rounded-xl focus:ring-2 focus:ring-[#2A54A1] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block font-body text-sm font-medium text-[#2A54A1] mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="font-body w-full px-4 py-3 border-2 border-[#2A54A1]/20 rounded-xl focus:ring-2 focus:ring-[#2A54A1] focus:border-transparent outline-none transition"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl font-body text-sm border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (method === 'phone' ? phone.length !== 10 : !email)}
              className="cta-button w-full text-white py-3 px-4 rounded-full font-body font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : method === 'phone' ? (
                'Send Code'
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>

          <p className="text-center font-body text-sm text-[#2A54A1]/60 mt-6">
            {method === 'phone' ? (
              <>We&apos;ll text you a 6-digit code to sign in.</>
            ) : (
              <>We&apos;ll email you a secure link to sign in.</>
            )}
            <br />
            No password needed.
          </p>
        </div>

        <p className="text-center font-body text-sm text-[#2A54A1]/60 mt-6">
          <Link href="/" className="text-[#2A54A1] hover:underline">
            &larr; Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
