'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ServicesPage() {
  useEffect(() => {
    window.location.href = '/#services';
  }, []);

  return null;
}
