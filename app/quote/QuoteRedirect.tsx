'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Client half of /quote: forwards to the home page with the modal open.
export default function QuoteRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Forward all query params to the home page with quote=true
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('quote', 'true');
    router.replace(`/?${params.toString()}`);
  }, [searchParams, router]);

  return null;
}
