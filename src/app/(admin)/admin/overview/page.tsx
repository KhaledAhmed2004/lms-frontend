"use client";

import {
  useOverviewStats,
  useRecentActivity,
  useRevenueByMonth,
  useUserDistribution,
} from "@/hooks/api/use-admin-stats";
import { BarChart3, DollarSign, Users } from "lucide-react";
import { useEffect, useState } from "react";
import OverviewStats from "./components/OverviewStats";
import RecentActivityCard from "./components/RecentActivityCard";
import RevenueTrendCard from "./components/RevenueTrendCard";
import UserDistributionCard from "./components/UserDistributionCard";

const Overview = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [isMounted, setIsMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  // Ensure component is mounted before rendering charts (prevents SSR hydration mismatch)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Fetch real data from API
  const { data: overviewStats, isLoading: statsLoading } =
    useOverviewStats("month");
  const { data: revenueByMonth, isLoading: revenueLoading } =
    useRevenueByMonth(currentYear);
  const { data: userDistributionData, isLoading: distributionLoading } =
    useUserDistribution("role");
  const { data: activityData, isLoading: activityLoading } = useRecentActivity({
    limit: 5,
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Month names for chart
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Transform revenue data for chart
  const revenueData =
    revenueByMonth?.map((item) => ({
      month: monthNames[item.month - 1] || `M${item.month}`,
      revenue: item.totalRevenue || 0,
    })) || [];

  // Transform user distribution for pie chart
  const userDistribution = userDistributionData?.byRole
    ?.map((item) => ({
      name:
        item.role === "STUDENT"
          ? "Students"
          : item.role === "TUTOR"
            ? "Tutors"
            : item.role,
      value: item.count,
      color: item.role === "STUDENT" ? "#002AC8" : "#e5e7eb",
    }))
    .filter((item) => item.name === "Students" || item.name === "Tutors") || [
    { name: "Students", value: 0, color: "#002AC8" },
    { name: "Tutors", value: 0, color: "#e5e7eb" },
  ];

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get activities from API
  const activities = activityData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "warning":
        return "bg-orange-100 text-orange-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Stats cards config
  const statsConfig = [
    {
      label: "Total Revenue",
      value: overviewStats?.revenue?.total ?? 0,
      growth: overviewStats?.revenue?.growth ?? 0,
      growthType: overviewStats?.revenue?.growthType ?? "no_change",
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      isCurrency: true,
    },
    {
      label: "Total Students",
      value: overviewStats?.students?.total ?? 0,
      growth: overviewStats?.students?.growth ?? 0,
      growthType: overviewStats?.students?.growthType ?? "no_change",
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      isCurrency: false,
    },
    {
      label: "Total Tutors",
      value: overviewStats?.tutors?.total ?? 0,
      growth: overviewStats?.tutors?.growth ?? 0,
      growthType: overviewStats?.tutors?.growthType ?? "no_change",
      icon: BarChart3,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      isCurrency: false,
    },
  ];

  return (
    <div className="space-y-6">
      <OverviewStats
        statsLoading={statsLoading}
        statsConfig={statsConfig}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
      />

      {/* Charts Section */}
      <div className="space-y-6">
        <RevenueTrendCard
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isMounted={isMounted}
          revenueLoading={revenueLoading}
          revenueData={revenueData}
        />

        <div className="flex gap-6">
          {/* Left Section - Recent Activity & User Distribution (2/3 width) */}
          <div className="w-2/3">
            <div className="grid gap-6">
              <RecentActivityCard
                activityLoading={activityLoading}
                activities={activities}
                getStatusColor={getStatusColor}
                formatRelativeTime={formatRelativeTime}
              />
            </div>
          </div>

          <UserDistributionCard
            isMounted={isMounted}
            distributionLoading={distributionLoading}
            userDistribution={userDistribution}
            formatNumber={formatNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
