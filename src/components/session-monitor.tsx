"use client";

import { useEffect, useState } from "react";
import { useUpcomingSessions } from "@/hooks/api/use-sessions";
import { useVideoCall } from "@/providers/video-call-provider";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

export function SessionStartNotifier() {
  const { data: sessions } = useUpcomingSessions();
  const { joinSessionCall, isInCall } = useVideoCall();
  const { user } = useAuthStore();
  
  // Keep track of which sessions we've already notified
  const [notifiedSessions, setNotifiedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!sessions || sessions.length === 0 || isInCall) return;

    const interval = setInterval(() => {
      const now = new Date();
      
      sessions.forEach((session) => {
        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);
        
        // If session is CURRENTLY active (now is between start and end)
        // OR session is about to start in the next 10 seconds
        const isStartingSoon = (startTime.getTime() - now.getTime()) <= 10000;
        const isCurrentlyActive = now >= startTime && now <= endTime;

        if ((isStartingSoon || isCurrentlyActive) && !notifiedSessions.has(session._id)) {
          // Show the notification
          showJoinNotification(session);
          
          // Mark as notified so we don't spam
          setNotifiedSessions((prev) => new Set(prev).add(session._id));
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [sessions, notifiedSessions, isInCall]);

  const showJoinNotification = (session: any) => {
    const isTutor = user?.role === "TUTOR";
    const otherUser = isTutor ? session.studentId : session.tutorId;
    
    if (!otherUser) return;

    toast.info("Join Meeting", {
      description: `Your scheduled ${session.duration} min session with ${otherUser.name} has started.`,
      icon: <Video className="w-4 h-4 text-primary" />,
      action: {
        label: "Join Now",
        onClick: () => {
          joinSessionCall(
            session._id,
            otherUser._id,
            otherUser.name,
            new Date(session.endTime)
          );
        },
      },
      duration: 60000, // Show for 1 minute
    });
  };

  return null;
}
