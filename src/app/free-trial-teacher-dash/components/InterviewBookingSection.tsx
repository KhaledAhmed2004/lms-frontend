'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Clock, Loader2, CheckCircle, AlertCircle, Calendar as CalendarIcon, Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  useAvailableInterviewSlots,
  useBookInterviewSlot,
  useMyBookedInterview,
  useCancelMyInterview,
  useGetInterviewMeetingToken,
  InterviewSlot,
} from '@/hooks/api';
import { useAgora } from '@/hooks/use-agora';
import { format, isSameDay, differenceInHours } from 'date-fns';

interface InterviewBookingSectionProps {
  applicationId: string;
}

export function InterviewBookingSection({ applicationId }: InterviewBookingSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Fetch available slots
  const { data: slots, isLoading: slotsLoading, error: slotsError } = useAvailableInterviewSlots();

  // Check if user already has a booked interview
  const { data: bookedInterview, isLoading: bookedLoading } = useMyBookedInterview();

  // Book slot mutation
  const bookSlot = useBookInterviewSlot();

  // Cancel interview mutation
  const cancelInterview = useCancelMyInterview();

  // Meeting token mutation
  const getMeetingToken = useGetInterviewMeetingToken();

  // Agora hook for video call
  const agora = useAgora({
    onError: (error) => {
      toast.error(error.message || 'Failed to join meeting');
    },
  });

  // Join meeting handler
  const handleJoinMeeting = async () => {
    if (!bookedInterview) return;

    try {
      const tokenData = await getMeetingToken.mutateAsync(bookedInterview._id);
      await agora.join(tokenData.channelName, tokenData.token, tokenData.uid);
      toast.success('Joined meeting successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to join meeting');
    }
  };

  // Leave meeting handler
  const handleLeaveMeeting = async () => {
    await agora.leave();
    toast.info('Left the meeting');
  };

  // Get unique dates that have available slots
  const availableDates = useMemo(() => {
    if (!slots?.data) return [];
    const dates = slots.data.map((slot) => new Date(slot.startTime));
    // Remove duplicates by comparing date strings
    return dates.filter(
      (date, index, self) =>
        index === self.findIndex((d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    );
  }, [slots?.data]);

  // Get time slots for selected date
  const timeSlotsForDate = useMemo(() => {
    if (!selectedDate || !slots?.data) return [];
    return slots.data.filter((slot) => isSameDay(new Date(slot.startTime), selectedDate));
  }, [selectedDate, slots?.data]);

  // Check if interview can be cancelled/rescheduled (1 hour before)
  const canModifyInterview = useMemo(() => {
    if (!bookedInterview) return false;
    const interviewTime = new Date(bookedInterview.startTime);
    const hoursUntilInterview = differenceInHours(interviewTime, new Date());
    return hoursUntilInterview >= 1;
  }, [bookedInterview]);

  const handleBookSlot = async () => {
    if (!selectedSlotId) return;

    try {
      await bookSlot.mutateAsync({
        id: selectedSlotId,
        applicationId,
      });
      toast.success('Interview slot booked successfully!');
      setSelectedSlotId(null);
      setSelectedDate(undefined);
      setIsRescheduling(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to book interview slot');
    }
  };

  const handleCancelInterview = async () => {
    if (!bookedInterview) return;

    try {
      await cancelInterview.mutateAsync(bookedInterview._id);
      toast.success('Interview cancelled successfully');
      setShowCancelDialog(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to cancel interview');
    }
  };

  const handleReschedule = () => {
    setIsRescheduling(true);
  };

  const formatSlotTime = (slot: InterviewSlot) => {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    return {
      date: format(start, 'EEEE, dd.MM.yyyy'),
      time: `${format(start, 'h:mma').toLowerCase()} - ${format(end, 'h:mma').toLowerCase()}`,
    };
  };

  // Show loading state
  if (slotsLoading || bookedLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-72 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-32 mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (slotsError) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="py-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-600">Failed to load interview slots. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  // Show completed interview UI
  if (bookedInterview && bookedInterview.status === 'COMPLETED') {
    const { date, time } = formatSlotTime(bookedInterview);
    return (
      <div className="space-y-4">
        {/* Completed Interview Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Interview Completed</h2>

            {/* Date */}
            <div className="flex items-start gap-3 mb-4">
              <CalendarIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{date}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3 mb-4">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">{time}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Completed
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <div className="border border-[#0B31BD] bg-[#E2E6F5] rounded-xl p-4">
          <p className="text-[#0B31BD] text-sm">
            The admin will review your interview and update your application status. You will be notified once a decision is made.
          </p>
        </div>
      </div>
    );
  }

  // Show booked interview if exists (and not rescheduling)
  if (bookedInterview && bookedInterview.status === 'BOOKED' && !isRescheduling) {
    const { date, time } = formatSlotTime(bookedInterview);
    return (
      <>
        <div className="space-y-4">
          {/* Scheduled Interview Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Scheduled Interview</h2>

              {/* Date */}
              <div className="flex items-start gap-3 mb-4">
                <CalendarIcon className="h-5 w-5 text-[#0B31BD] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{date}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3 mb-6">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{time}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {agora.callState === 'connected' ? (
                  <Button
                    onClick={handleLeaveMeeting}
                    variant="destructive"
                  >
                    Leave Meeting
                  </Button>
                ) : (
                  <Button
                    onClick={handleJoinMeeting}
                    disabled={getMeetingToken.isPending || agora.callState === 'connecting'}
                    className="bg-[#0B31BD] hover:bg-[#0928a0] text-white"
                  >
                    {getMeetingToken.isPending || agora.callState === 'connecting' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      'Join Meeting'
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleReschedule}
                  disabled={!canModifyInterview}
                  className="border-gray-300"
                >
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={!canModifyInterview}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Banner */}
          <div className="border border-[#FFB800] bg-[#FFFBF0] rounded-xl p-4">
            <p className="text-gray-700 text-sm">
              You can cancel or reschedule your interview up to{' '}
              <span className="text-[#FFB800] font-medium">1 hour beforehand</span>.
            </p>
          </div>

          {/* Video Call UI */}
          {agora.callState === 'connected' && (
            <ApplicantVideoCall agora={agora} onLeave={handleLeaveMeeting} />
          )}
        </div>

        {/* Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cancel Interview</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your interview?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Interview
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelInterview}
                disabled={cancelInterview.isPending}
              >
                {cancelInterview.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Interview'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // No slots available
  if (!slots || !slots.data || slots.data.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="py-12 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">No interview slots available at the moment.</p>
          <p className="text-sm text-gray-500 mt-2">Please check back later.</p>
        </CardContent>
      </Card>
    );
  }

  // Main UI - Calendar + Time Slots layout (for booking or rescheduling)
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isRescheduling ? 'Reschedule Interview' : 'Schedule Interview'}
          </h2>
          {isRescheduling && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRescheduling(false)}
              className="text-gray-500"
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Calendar */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Date</p>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedSlotId(null);
              }}
              disabled={(date) => {
                // Disable dates that don't have available slots
                return !availableDates.some((d) => isSameDay(d, date));
              }}
              modifiers={{
                available: availableDates,
              }}
              modifiersClassNames={{
                available: 'bg-blue-50 text-blue-700 font-medium',
              }}
              className="rounded-md border border-gray-200"
            />
          </div>

          {/* Right side - Time Slots */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Available Time Slots</p>

            {!selectedDate ? (
              <div className="flex items-center justify-center h-48 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-sm">Select a date to see available slots</p>
              </div>
            ) : timeSlotsForDate.length === 0 ? (
              <div className="flex items-center justify-center h-48 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-sm">No slots available for this date</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {timeSlotsForDate.map((slot) => {
                  const start = new Date(slot.startTime);
                  const end = new Date(slot.endTime);
                  const timeString = `${format(start, 'h:mma').toLowerCase()} - ${format(end, 'h:mma').toLowerCase()}`;
                  const isSelected = selectedSlotId === slot._id;

                  return (
                    <button
                      key={slot._id}
                      onClick={() => setSelectedSlotId(isSelected ? null : slot._id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-[#0B31BD] bg-blue-50 ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#0B31BD]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0B31BD]" />
                        )}
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-[#0B31BD] font-medium' : 'text-gray-700'}`}>
                        {timeString}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Schedule Button */}
        <div className="mt-8">
          <Button
            onClick={handleBookSlot}
            disabled={!selectedSlotId || bookSlot.isPending}
            className="w-full bg-[#0B31BD] hover:bg-[#0928a0] text-white py-6 text-base font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookSlot.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isRescheduling ? 'Rescheduling...' : 'Scheduling...'}
              </>
            ) : (
              isRescheduling ? 'Reschedule' : 'Schedule'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Video Call Component for Applicant
function ApplicantVideoCall({
  agora,
  onLeave,
}: {
  agora: ReturnType<typeof useAgora>;
  onLeave: () => void;
}) {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Play local video
  useEffect(() => {
    if (agora.localVideoTrack && localVideoRef.current) {
      agora.localVideoTrack.play(localVideoRef.current);
    }
  }, [agora.localVideoTrack]);

  // Play remote video
  useEffect(() => {
    if (agora.remoteUsers.length > 0 && remoteVideoRef.current) {
      const remoteUser = agora.remoteUsers[0];
      if (remoteUser.videoTrack) {
        remoteUser.videoTrack.play(remoteVideoRef.current);
      }
    }
  }, [agora.remoteUsers]);

  // Call duration timer
  useEffect(() => {
    if (agora.callState !== 'connected') {
      setCallDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [agora.callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-medium">Interview Meeting</h3>
              <p className="text-white/70 text-sm">{formatDuration(callDuration)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div
          ref={remoteVideoRef}
          className="absolute inset-0 bg-gray-800 flex items-center justify-center"
        >
          {agora.remoteUsers.length === 0 && (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-white/50" />
              </div>
              <p className="text-white/70">Waiting for interviewer...</p>
            </div>
          )}
        </div>

        {/* Local Video (PiP) */}
        <div
          ref={localVideoRef}
          className={`absolute bottom-24 right-4 w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden bg-gray-700 shadow-lg ${
            agora.isVideoMuted ? 'hidden' : ''
          }`}
        />
        {agora.isVideoMuted && (
          <div className="absolute bottom-24 right-4 w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden bg-gray-700 shadow-lg flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-white/50" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-4">
          {/* Mute Audio */}
          <button
            onClick={agora.toggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              agora.isAudioMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {agora.isAudioMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Toggle Video */}
          <button
            onClick={agora.toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              agora.isVideoMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {agora.isVideoMuted ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={onLeave}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewBookingSection;