import './globals.css';
import QueryProvider from '@/providers/query-provider';
import SocketProvider from '@/providers/socket-provider';
import VideoCallProvider from '@/providers/video-call-provider';
import { VideoCallWrapper } from '@/components/video-call';
import { Toaster } from '@/components/ui/sonner';

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
