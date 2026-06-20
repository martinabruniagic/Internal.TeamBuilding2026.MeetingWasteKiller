'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

const mono = { fontFamily: 'var(--font-mono)' } as const;
const heading = { fontFamily: 'var(--font-heading)' } as const;

export default function Sidebar() {
  const pathname = usePathname();
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

  const isDash = pathname === '/';
  const isMeet = pathname.startsWith('/meetings');

  const navStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 14px', borderRadius: 12,
    fontSize: 14, fontWeight: active ? 600 : 500,
    color: active ? '#06281d' : '#9aa4b2',
    background: active ? 'linear-gradient(180deg,#6ee7b7,#34d399)' : 'transparent',
    boxShadow: active ? '0 10px 26px -10px rgba(52,211,153,0.75)' : 'none',
    transition: 'all .15s', textDecoration: 'none',
  });

  return (
    <div
      style={{
        width: 252, flexShrink: 0, height: '100vh',
        background: '#0c0e13',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 18px',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 8px 26px' }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(160deg, #6ee7b7, #34d399)',
            boxShadow: '0 8px 22px -8px rgba(52,211,153,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M5 15L15 5" stroke="#06281d" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="6.5" cy="6.5" r="2.2" stroke="#06281d" strokeWidth="2" />
          </svg>
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: '#eef2f6' }}>WasteKiller</div>
          <div style={{ ...mono, fontSize: 9.5, letterSpacing: '0.12em', color: '#5a6472', textTransform: 'uppercase' }}>
            PoC v1.1
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ ...mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4d5663', padding: '0 10px 10px' }}>
        Menu
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link href="/" style={navStyle(isDash)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" />
            <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" />
            <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" />
            <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" />
          </svg>
          Dashboard
        </Link>
        <Link href="/meetings" style={navStyle(isMeet)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 4.5H15.5" /><path d="M6 9H15.5" /><path d="M6 13.5H15.5" />
            <circle cx="2.5" cy="4.5" r="0.6" fill="currentColor" />
            <circle cx="2.5" cy="9" r="0.6" fill="currentColor" />
            <circle cx="2.5" cy="13.5" r="0.6" fill="currentColor" />
          </svg>
          Meeting
        </Link>
      </div>

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div
            style={{
              width: 36, height: 36, flexShrink: 0, borderRadius: '50%',
              background: 'rgba(52,211,153,0.14)', border: '1px solid rgba(52,211,153,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...heading, fontWeight: 600, fontSize: 13, color: '#6ee7b7',
            }}
          >
            MC
          </div>
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#eef2f6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Martina Conti
            </div>
            <div style={{ fontSize: 11, color: '#5a6472' }}>Manager</div>
          </div>
          <button
            onClick={logout}
            title="Esci"
            style={{ color: '#5a6472', background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'flex' }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 15.5H3.5V2.5H7" /><path d="M11 12.5L14.5 9L11 5.5" /><path d="M14.5 9H6.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
