"use client";

import type { UnifiedSession } from "@/hooks/api";
import {
  SESSION_STATUS,
  useSessionStats,
  useUnifiedSessions,
} from "@/hooks/api";
import React, { useState } from "react";
import SessionDetailsDialog from "./SessionDetailsDialog";
import SessionHeader from "./SessionHeader";
import SessionStats from "./SessionStats";
import SessionsTableSection from "./SessionsTableSection";

type TabFilter = "all" | "COMPLETED" | "CANCELLED" | "SCHEDULED";

const SessionManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [selectedSession, setSelectedSession] = useState<UnifiedSession | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Build filters based on active tab
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    status: activeTab === "all" ? undefined : activeTab,
  };

  // Fetch unified sessions (sessions + trial requests)
  const {
    data: sessionsData,
    isLoading,
    isFetching,
  } = useUnifiedSessions(filters);

  // Fetch stats
  const { data: statsData } = useSessionStats();

  const sessions = sessionsData?.data || [];
  const pagination = sessionsData?.meta;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabFilter);
    setCurrentPage(1);
  };

  const handleViewDetails = (session: UnifiedSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatScheduledTime = (startTime?: string, endTime?: string) => {
    if (!startTime) return "Not scheduled yet";
    const start = new Date(startTime);
    const dateStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const startTimeStr = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    if (!endTime) return `${dateStr} - ${startTimeStr}`;
    const end = new Date(endTime);
    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} - ${startTimeStr} - ${endTimeStr}`;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "FREE_TRIAL":
        return "bg-purple-100 text-purple-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
      case "REFUNDED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLessonStatusColor = (status: string) => {
    switch (status) {
      case SESSION_STATUS.COMPLETED:
        return "bg-green-100 text-green-800";
      case SESSION_STATUS.SCHEDULED:
      case SESSION_STATUS.STARTING_SOON:
      case SESSION_STATUS.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case SESSION_STATUS.CANCELLED:
      case SESSION_STATUS.EXPIRED:
      case SESSION_STATUS.NO_SHOW:
        return "bg-red-100 text-red-800";
      case SESSION_STATUS.AWAITING_RESPONSE:
      case SESSION_STATUS.RESCHEDULE_REQUESTED:
      case "PENDING":
      case "ACCEPTED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatusLabel = (status: string) => {
    if (status === "FREE_TRIAL") return "Free Trial";
    return status
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="space-y-6">
      <SessionHeader />
      <SessionStats
        totalSessions={statsData?.totalSessions?.toLocaleString() || "0"}
        pendingSessions={statsData?.pendingSessions?.toLocaleString() || "0"}
        completedSessions={
          statsData?.completedSessions?.toLocaleString() || "0"
        }
      />
      <SessionsTableSection
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        isLoading={isLoading}
        isFetching={isFetching}
        sessions={sessions}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        total={pagination?.total || 0}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        getPaymentStatusColor={getPaymentStatusColor}
        getLessonStatusColor={getLessonStatusColor}
        formatStatusLabel={formatStatusLabel}
      />
      <SessionDetailsDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedSession={selectedSession}
        formatDateTime={formatDateTime}
        formatScheduledTime={formatScheduledTime}
        getPaymentStatusColor={getPaymentStatusColor}
        getLessonStatusColor={getLessonStatusColor}
        formatStatusLabel={formatStatusLabel}
      />
    </div>
  );
};

export default SessionManagement;
