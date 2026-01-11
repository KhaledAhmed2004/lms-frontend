'use client';

import dynamic from 'next/dynamic';
import { useVideoCall } from '@/providers/video-call-provider';
import { Phone, PhoneOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamic import to avoid SSR issues with Agora
const VideoCall = dynamic(() => import('./video-call'), { ssr: false });

export function VideoCallWrapper() {
  const { isInCall, callState } = useVideoCall();

  if (!isInCall && callState !== 'connecting') {
    return null;
  }

  return <VideoCall />;
}

export function IncomingCallModal() {
  const { isReceivingCall, incomingCall, acceptCall, rejectCall } = useVideoCall();

  if (!isReceivingCall || !incomingCall) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-semibold text-gray-600">
              {incomingCall.caller.name?.[0] || '?'}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {incomingCall.caller.name || 'Unknown'}
          </h3>
          <p className="text-gray-500 mb-6">
            Incoming {incomingCall.callType} call...
          </p>

          <div className="flex justify-center gap-4">
            <Button
              onClick={rejectCall}
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
            <Button
              onClick={acceptCall}
              size="lg"
              className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600"
            >
              <Phone className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { default as VideoCall } from './video-call';
