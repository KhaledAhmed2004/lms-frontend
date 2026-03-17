"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetInterviewMeetingToken, useScheduledMeetings } from "@/hooks/api";
import { useAgora } from "@/hooks/use-agora";
import { format } from "date-fns";
import { Calendar, Loader2, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import InterviewVideoCall from "./InterviewVideoCall";
import MeetingSearch from "./MeetingSearch";

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
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
      <MeetingSearch value={searchQuery} onChange={handleSearch} />

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
                                  disabled={
                                    joiningMeetingId === meeting._id ||
                                    agora.callState === "connecting"
                                  }
                                >
                                  {joiningMeetingId === meeting._id ||
                                  agora.callState === "connecting" ? (
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
                        },
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1),
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
        <InterviewVideoCall agora={agora} onLeave={handleLeaveMeeting} />
      )}
    </div>
  );
};

export default MeetingList;
