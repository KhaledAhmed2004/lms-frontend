"use client";

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  FileText,
  Clock,
  UserCheck,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { formatDateShort } from "@/lib/utils";
import {
  useAdminApplications,
  useSelectForInterview,
  useApproveApplication,
  useRejectApplication,
  type AdminApplicationStatus,
} from "@/hooks/api";
import { useApplicationStats } from "@/hooks/api/use-admin-stats";
import { useTranslations } from "next-intl";

const ApplicationManagement = () => {
  const t = useTranslations("applications");
  const ts = useTranslations("status");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | AdminApplicationStatus>(
    "all",
  );
  const itemsPerPage = 10;

  // Build filters based on active tab
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchTerm || undefined,
    status: activeTab === "all" ? undefined : activeTab,
  };

  // Fetch applications
  const { data, isLoading, isFetching, error } = useAdminApplications(filters);

  // Fetch application stats
  const { data: stats, isLoading: statsLoading } = useApplicationStats();

  // Mutations
  const { mutate: selectForInterview, isPending: isSelecting } =
    useSelectForInterview();
  const { mutate: approveApplication, isPending: isApproving } =
    useApproveApplication();
  const { mutate: rejectApplication, isPending: isRejecting } =
    useRejectApplication();

  const applications = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "all" | AdminApplicationStatus);
    setCurrentPage(1);
  };

  const handleSelectForInterview = (id: string) => {
    selectForInterview(
      { id },
      {
        onSuccess: () => toast.success(t("selectedSuccess")),
        onError: (error: any) => {
          toast.error(
            error?.getFullMessage?.() ||
            error?.message ||
            "Failed to select for interview",
          );
        },
      },
    );
  };

  const handleApprove = (id: string) => {
    approveApplication(
      { id },
      {
        onSuccess: () => toast.success(t("approvedSuccess")),
        onError: (error: any) => {
          toast.error(
            error?.getFullMessage?.() ||
            error?.message ||
            "Failed to approve application",
          );
        },
      },
    );
  };

  const handleReject = (id: string) => {
    const reason = prompt(t("enterRejectionReason"));
    if (!reason) return;

    rejectApplication(
      { id, rejectionReason: reason },
      {
        onSuccess: () => toast.success(t("rejectedSuccess")),
        onError: (error: any) => {
          toast.error(
            error?.getFullMessage?.() ||
            error?.message ||
            "Failed to reject application",
          );
        },
      },
    );
  };

  const getStatusColor = (status: AdminApplicationStatus) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-800";
      case "SELECTED_FOR_INTERVIEW":
        return "bg-blue-100 text-blue-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "REVISION":
        return "bg-orange-100 text-orange-800";
      case "RESUBMITTED":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: AdminApplicationStatus) => {
    switch (status) {
      case "SUBMITTED":
        return t("pending");
      case "SELECTED_FOR_INTERVIEW":
        return t("interview");
      case "APPROVED":
        return ts("accepted");
      case "REJECTED":
        return t("rejected");
      case "REVISION":
        return t("revision");
      case "RESUBMITTED":
        return t("resubmitted");
      default:
        return status;
    }
  };


  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">
          Error loading applications. Please try again.
        </p>
      </div>
    );
  }

  // Stats cards configuration
  const statsConfig = [
    {
      label: t("total"),
      data: stats?.total,
      icon: FileText,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: t("pending"),
      data: stats?.pending,
      icon: Clock,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      label: t("interview"),
      data: stats?.interview,
      icon: UserCheck,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      label: t("approved"),
      data: stats?.approved,
      icon: CheckCircle,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: t("rejected"),
      data: stats?.rejected,
      icon: XCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const tabTriggerClassName =
    "bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black whitespace-nowrap";

  const tabs = [
    { value: "all", label: "All" },
    { value: "SUBMITTED", label: t("pending") },
    { value: "SELECTED_FOR_INTERVIEW", label: t("interview") },
    { value: "APPROVED", label: t("approved") },
    { value: "REJECTED", label: t("rejected") },
    { value: "REVISION", label: t("revision") },
    { value: "RESUBMITTED", label: t("resubmitted") },
  ] as const;

  const canSelectForInterview = (status: AdminApplicationStatus) =>
    status === "SUBMITTED" || status === "REVISION" || status === "RESUBMITTED";

  const canApprove = (status: AdminApplicationStatus) =>
    status === "SELECTED_FOR_INTERVIEW";

  const canReject = (status: AdminApplicationStatus) =>
    status !== "APPROVED" && status !== "REJECTED";

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsLoading
          ? Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
          : statsConfig.map((stat, index) => (
            <Card
              key={index}
              className="border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div
                  className={`${stat.bgColor} p-2 rounded-full w-fit mb-2`}
                >
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.data?.count ?? 0}
                </p>
                {stat.data && (
                  <div
                    className={`flex items-center gap-1 text-xs ${stat.data.growthType === "increase"
                        ? "text-green-600"
                        : stat.data.growthType === "decrease"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                  >
                    {stat.data.growthType === "increase" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : stat.data.growthType === "decrease" ? (
                      <ArrowDown className="w-3 h-3" />
                    ) : null}
                    <span>
                      {stat.data.growthType === "no_change"
                        ? "No change"
                        : `${stat.data.growth > 0 ? "+" : ""}${stat.data.growth}%`}
                    </span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Search */}
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>

      {/* Table Section */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <Card>
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-7 bg-transparent p-0 h-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={tabTriggerClassName}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              {/* Table */}
              <div className="overflow-x-auto">
                <div className="border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t("colApplicantName")}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t("tutors.colSubject", { defaultValue: "Subject" })}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t("colApplicationDate")}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t("colPhoneNumber")}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t("tutors.colAction", { defaultValue: "Action" })}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <AdminTableSkeleton cols={6} />
                      ) : applications.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-gray-500"
                          >
                            {t("noApplications")}
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr
                            key={app._id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isFetching ? "opacity-50" : ""}`}
                          >
                            <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                              {app.name}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {app.subjects.map((s) => s.name).join(", ") ||
                                "-"}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {formatDateShort(app.submittedAt)}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {app.phoneNumber}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={`${getStatusColor(app.status)} border-0`}
                              >
                                {getStatusLabel(app.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={
                                      isSelecting || isApproving || isRejecting
                                    }
                                  >
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <Link
                                    href={`/admin/application-details?id=${app._id}`}
                                  >
                                    <DropdownMenuItem>
                                      {t("tutors.viewDetails", { defaultValue: "View Details" })}
                                    </DropdownMenuItem>
                                  </Link>

                                  {canSelectForInterview(app.status) && (
                                    <DropdownMenuItem
                                      className="text-blue-600"
                                      onClick={() =>
                                        handleSelectForInterview(app._id)
                                      }
                                    >
                                      {t("selectForInterview")}
                                    </DropdownMenuItem>
                                  )}

                                  {canApprove(app.status) && (
                                    <DropdownMenuItem
                                      className="text-green-600"
                                      onClick={() => handleApprove(app._id)}
                                    >
                                      {t("approve")}
                                    </DropdownMenuItem>
                                  )}

                                  {canReject(app.status) && (
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleReject(app._id)}
                                    >
                                      {t("reject")}
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {applications.length > 0 && (
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  total={pagination?.total || 0}
                  onPageChange={setCurrentPage}
                />
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default ApplicationManagement;
