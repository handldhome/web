'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuotePage() {
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
