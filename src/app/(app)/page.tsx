
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is a temporary redirect to the new dashboard location.
export default function OldDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null; 
}
