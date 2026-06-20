'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { tokenStorage } from '@/lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/login' && !tokenStorage.get()) {
      router.push('/login');
    }
  }, [router, pathname]);

  return <>{children}</>;
}
