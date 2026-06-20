'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') return <>{children}</>;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a0c10' }}>
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto relative"
        style={{
          background:
            'radial-gradient(90% 60% at 80% -5%, rgba(52,211,153,0.06) 0%, rgba(10,12,16,0) 60%)',
        }}
      >
        {children}
      </main>
    </div>
  );
}
