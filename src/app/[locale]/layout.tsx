import type { Metadata } from 'next';
import '../globals.css';
import QueryProvider from '@/providers/query-provider';
import SocketProvider from '@/providers/socket-provider';
import VideoCallProvider from '@/providers/video-call-provider';
import { VideoCallWrapper } from '@/components/video-call';
import { Toaster } from '@/components/ui/sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Online-Nachhilfe für alle Fächer | Schäfer Tutoring',
  description:
    'Finde jetzt den perfekten Nachhilfelehrer! Flexible Online-Nachhilfe in Mathe, Englisch & Co. Jetzt kostenlose Probestunde sichern.',
};

import { SessionStartNotifier } from '@/components/session-monitor';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <SocketProvider>
              <VideoCallProvider>
                {children}
                <VideoCallWrapper />
                <SessionStartNotifier />
                <Toaster richColors />
              </VideoCallProvider>
            </SocketProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
