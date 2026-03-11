import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/query-provider';
import SocketProvider from '@/providers/socket-provider';
import VideoCallProvider from '@/providers/video-call-provider';
import { VideoCallWrapper } from '@/components/video-call';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Online-Nachhilfe für alle Fächer | Schäfer Tutoring',
  description:
    'Finde jetzt den perfekten Nachhilfelehrer! Flexible Online-Nachhilfe in Mathe, Englisch & Co. Jetzt kostenlose Probestunde sichern.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <SocketProvider>
            <VideoCallProvider>
              {children}
              <VideoCallWrapper />
              <Toaster richColors />
            </VideoCallProvider>
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
