"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Calendar, Video, Loader2, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useScheduledMeetings, useGetInterviewMeetingToken } from "@/hooks/api";
import { useAgora } from "@/hooks/use-agora";
import { format } from "date-fns";
import { toast } from "sonner";

const MeetingList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [joiningMeetingId, setJoiningMeetingId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Fetch scheduled meetings
  const { data, isLoading, error } = useScheduledMeetings({
    page: currentPage,
    limit: itemsPerPage,
    sort: "-startTime",
  });

  // Meeting token mutation
  const getMeetingToken = useGetInterviewMeetingToken();

  // Agora hook for video call
  const agora = useAgora({
    onError: (error) => {
      toast.error(error.message || "Failed to join meeting");
      setJoiningMeetingId(null);
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Join meeting handler
  const handleJoinMeeting = async (meetingId: string) => {
    setJoiningMeetingId(meetingId);
    try {
      const tokenData = await getMeetingToken.mutateAsync(meetingId);
      await agora.join(tokenData.channelName, tokenData.token, tokenData.uid);
      toast.success("Joined meeting successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to join meeting");
    } finally {
      setJoiningMeetingId(null);
    }
  };

  // Leave meeting handler
  const handleLeaveMeeting = async () => {
    await agora.leave();
    toast.info("Left the meeting");
  };

  // Filter meetings by search query (client-side filtering for name/email)
  const filteredMeetings =
    data?.data?.filter((meeting) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        meeting.applicantName.toLowerCase().includes(searchLower) ||
        meeting.applicantEmail.toLowerCase().includes(searchLower)
      );
    }) || [];

  const totalPages = data?.pagination?.totalPage || 1;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="relative w-1/3">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-600">
              Failed to load scheduled meetings. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>

      {/* Table Section */}
      <Card>
        <CardContent className="pt-6">
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">
                No scheduled meetings found.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Meetings will appear here when applicants book interview slots.
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <div className="border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Applicant Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Subjects
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Scheduled Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Scheduled Time
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Meeting Link
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeetings.map((meeting) => {
                        const startTime = new Date(meeting.startTime);
                        const endTime = new Date(meeting.endTime);

                        return (
                          <tr
                            key={meeting._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                              {meeting.applicantName}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {meeting.applicantEmail}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {meeting.subjects?.length > 0
                                ? meeting.subjects.join(", ")
                                : "N/A"}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {format(startTime, "dd/MM/yyyy")}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              <div className="flex items-center gap-2">
                                {format(startTime, "h:mm a")} -{" "}
                                {format(endTime, "h:mm a")}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {agora.callState === "connected" ? (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={handleLeaveMeeting}
                                >
                                  Leave
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-[#0B31BD] hover:bg-[#0928a0] text-white"
                                  onClick={() => handleJoinMeeting(meeting._id)}
                                  disabled={joiningMeetingId === meeting._id || agora.callState === "connecting"}
                                >
                                  {joiningMeetingId === meeting._id || agora.callState === "connecting" ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                      Joining...
                                    </>
                                  ) : (
                                    <>
                                      <Video className="h-4 w-4 mr-1" />
                                      Join
                                    </>
                                  )}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end pt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={page === currentPage}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            (page === 2 && currentPage > 3) ||
                            (page === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Video Call UI */}
      {agora.callState === "connected" && (
        <InterviewVideoCall
          agora={agora}
          onLeave={handleLeaveMeeting}
        />
      )}
    </div>
  );
};

// Video Call Component
function InterviewVideoCall({
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
    if (agora.callState !== "connected") {
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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
              <p className="text-white/70">Waiting for participant...</p>
            </div>
          )}
        </div>

        {/* Local Video (PiP) */}
        <div
          ref={localVideoRef}
          className={`absolute bottom-24 right-4 w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden bg-gray-700 shadow-lg ${
            agora.isVideoMuted ? "hidden" : ""
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
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
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
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
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

export default MeetingList;
