import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthGuard from '@/components/AuthGuard';
import NavbarWrapper from '@/components/NavbarWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MeetingWasteKiller',
  description: 'Dashboard per il monitoraggio dei meeting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <AuthGuard>
          <NavbarWrapper />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </AuthGuard>
      </body>
    </html>
  );
}
