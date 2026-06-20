import type { Metadata } from 'next';
import { Manrope, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'MeetingWasteKiller',
  description: 'Dashboard per il monitoraggio dei meeting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthGuard>
          <AppShell>{children}</AppShell>
        </AuthGuard>
      </body>
    </html>
  );
}

