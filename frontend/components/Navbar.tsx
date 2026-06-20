'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { logout } = useAuth();
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-base font-bold text-gray-800">MeetingWasteKiller</span>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/meetings" className="text-sm text-gray-600 hover:text-gray-900">
            Meeting
          </Link>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
