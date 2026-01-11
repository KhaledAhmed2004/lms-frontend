"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import {
  useOverviewStats,
  useRevenueByMonth,
  useUserDistribution,
  useRecentActivity,
  type ActivityLogItem,
} from "@/hooks/api/use-admin-stats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Overview = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [isMounted, setIsMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  // Ensure component is mounted before rendering charts (prevents SSR hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch real data from API
  const { data: overviewStats, isLoading: statsLoading } = useOverviewStats('month');
  const { data: revenueByMonth, isLoading: revenueLoading } = useRevenueByMonth(currentYear);
  const { data: userDistributionData, isLoading: distributionLoading } = useUserDistribution('role');
  const { data: activityData, isLoading: activityLoading } = useRecentActivity({ limit: 5 });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Month names for chart
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // Transform revenue data for chart
  const revenueData = revenueByMonth?.map((item) => ({
    month: monthNames[item.month - 1] || `M${item.month}`,
    revenue: item.totalRevenue || 0,
  })) || [];

  // Transform user distribution for pie chart
  const userDistribution = userDistributionData?.byRole?.map((item) => ({
    name: item.role === 'STUDENT' ? 'Students' : item.role === 'TUTOR' ? 'Tutors' : item.role,
    value: item.count,
    color: item.role === 'STUDENT' ? '#002AC8' : '#e5e7eb',
  })).filter(item => item.name === 'Students' || item.name === 'Tutors') || [
    { name: "Students", value: 0, color: "#002AC8" },
    { name: "Tutors", value: 0, color: "#e5e7eb" },
  ];

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      growthType: overviewStats?.revenue?.growthType ?? 'neutral',
      icon: <DollarSign className="text-green-600" size={24} />,
      bgColor: "bg-green-50",
      isCurrency: true,
    },
    {
      label: "Total Students",
      value: overviewStats?.students?.total ?? 0,
      growth: overviewStats?.students?.growth ?? 0,
      growthType: overviewStats?.students?.growthType ?? 'neutral',
      icon: <Users className="text-blue-600" size={24} />,
      bgColor: "bg-blue-50",
      isCurrency: false,
    },
    {
      label: "Total Tutors",
      value: overviewStats?.tutors?.total ?? 0,
      growth: overviewStats?.tutors?.growth ?? 0,
      growthType: overviewStats?.tutors?.growthType ?? 'neutral',
      icon: <BarChart3 className="text-purple-600" size={24} />,
      bgColor: "bg-purple-50",
      isCurrency: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statsConfig.map((stat, index) => (
            <Card
              key={index}
              className="border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div
                      className={`${stat.bgColor} p-2 rounded-full w-fit mb-2`}
                    >
                      {stat.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.isCurrency ? formatCurrency(stat.value) : formatNumber(stat.value)}
                    </p>
                    {stat.growth !== 0 && (
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.growthType === 'increase' ? 'text-green-600' :
                        stat.growthType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stat.growthType === 'increase' ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : stat.growthType === 'decrease' ? (
                          <ArrowDown className="w-4 h-4" />
                        ) : null}
                        <span>{stat.growth > 0 ? '+' : ''}{stat.growth.toFixed(1)}%</span>
                        <span className="text-gray-500">vs last month</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Revenue Area Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {!isMounted || revenueLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#002AC8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#002AC8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `$${value}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#002AC8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-6">
          {/* Left Section - Recent Activity & User Distribution (2/3 width) */}
          <div className="w-2/3">
            <div className="grid gap-6">
              {/* Recent Activity */}
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Latest platform activities
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity: ActivityLogItem) => (
                        <div
                          key={activity._id}
                          className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {activity.title}
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStatusColor(
                                activity.status
                              )}`}
                            >
                              {activity.status.charAt(0).toUpperCase() +
                                activity.status.slice(1)}
                            </Badge>
                            <span className="text-gray-500 text-xs whitespace-nowrap">
                              {formatRelativeTime(activity.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      No recent activities
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Section - Users Distribution (1/3 width) */}
          <Card className="border-gray-200 w-1/3">
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Platform users breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {!isMounted || distributionLoading ? (
                <div className="flex items-center justify-center h-[250px]">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : userDistribution.some(u => u.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-gray-500">
                  No user data available
                </div>
              )}

              <div className="mt-6 space-y-3 w-full">
                {distributionLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-[#002AC8] rounded-full"></span>
                        Students
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatNumber(userDistribution.find(u => u.name === 'Students')?.value || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                        Tutors
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatNumber(userDistribution.find(u => u.name === 'Tutors')?.value || 0)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;
