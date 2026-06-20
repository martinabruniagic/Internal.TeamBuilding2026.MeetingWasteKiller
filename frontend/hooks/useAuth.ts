'use client';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/api';

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = () => !!tokenStorage.get();
  const logout = () => {
    tokenStorage.clear();
    router.push('/login');
  };
  return { isAuthenticated, logout };
}
