'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mwk-theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('mwk-theme', next ? 'dark' : 'light');
  }

  return (
    <nav className="border-b border-border bg-background transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-base font-bold text-foreground tracking-tight">
            ⚡ MeetingWasteKiller
          </span>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/meetings"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Meeting
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
