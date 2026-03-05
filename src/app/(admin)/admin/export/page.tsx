"use client";

import React, { useState } from "react";
import {
  Users,
  FileText,
  Calendar,
  Receipt,
  Wallet,
  CreditCard,
  GraduationCap,
  Download,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useExportUsers,
  useExportApplications,
  useExportSessions,
  useExportBillings,
  useExportEarnings,
  useExportSubscriptions,
  useExportTrialRequests,
} from "@/hooks/api";

// ============ EXPORT CARD COMPONENT ============

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface ExportCardProps {
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  filters: FilterConfig[];
  onExport: (filterValues: Record<string, string>) => void;
  isPending: boolean;
}

function ExportCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  description,
  filters,
  onExport,
  isPending,
}: ExportCardProps) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
  };

  const handleExport = () => {
    const cleanParams: Record<string, string> = {};
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v) cleanParams[k] = v;
    });
    onExport(cleanParams);
  };

  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className={`${iconBgColor} p-2.5 rounded-full shrink-0`}>
            <Icon className={iconColor} size={22} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>

        {filters.length > 0 ? (
          <div className="space-y-2">
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={filterValues[filter.key] || "all"}
                onValueChange={(val) => handleFilterChange(filter.key, val)}
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        ) : null}

        <Button
          onClick={handleExport}
          disabled={isPending}
          className="w-full bg-[#002AC8] hover:bg-[#0022A0] text-white"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Downloading..." : "Download CSV"}
        </Button>
      </CardContent>
    </Card>
  );
}

// ============ MONTH OPTIONS ============

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(2000, i).toLocaleString("en-US", { month: "long" }),
  value: String(i + 1),
}));

// ============ MAIN PAGE ============

const ExportPage = () => {
  const exportUsers = useExportUsers();
  const exportApplications = useExportApplications();
  const exportSessions = useExportSessions();
  const exportBillings = useExportBillings();
  const exportEarnings = useExportEarnings();
  const exportSubscriptions = useExportSubscriptions();
  const exportTrialRequests = useExportTrialRequests();

  const handleExport = (
    mutation: { mutateAsync: (params: any) => Promise<void> },
    label: string,
  ) => {
    return async (params: Record<string, string>) => {
      try {
        await mutation.mutateAsync(params);
        toast.success(`${label} exported successfully`);
      } catch {
        toast.error(`Failed to export ${label.toLowerCase()}`);
      }
    };
  };

  const exportCards = [
    {
      icon: Users,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "Users",
      description: "Name, email, role, phone, join date",
      filters: [
        {
          key: "role",
          label: "Role",
          options: [
            { label: "Student", value: "STUDENT" },
            { label: "Tutor", value: "TUTOR" },
          ],
        },
      ],
      mutation: exportUsers,
      label: "Users",
    },
    {
      icon: FileText,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      title: "Applications",
      description: "Applicant info, status, subjects, dates",
      filters: [
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Submitted", value: "SUBMITTED" },
            { label: "Resubmitted", value: "RESUBMITTED" },
            { label: "Selected for Interview", value: "SELECTED_FOR_INTERVIEW" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
            { label: "Revision", value: "REVISION" },
          ],
        },
      ],
      mutation: exportApplications,
      label: "Applications",
    },
    {
      icon: Calendar,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600",
      title: "Sessions",
      description: "Student, tutor, subject, timing, pricing, status",
      filters: [
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Completed", value: "COMPLETED" },
            { label: "Scheduled", value: "SCHEDULED" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Cancelled", value: "CANCELLED" },
            { label: "No Show", value: "NO_SHOW" },
          ],
        },
      ],
      mutation: exportSessions,
      label: "Sessions",
    },
    {
      icon: Receipt,
      iconBgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      title: "Billings",
      description: "Invoice, billing period, hours, totals, payment status",
      filters: [
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Pending", value: "PENDING" },
            { label: "Paid", value: "PAID" },
            { label: "Failed", value: "FAILED" },
          ],
        },
        {
          key: "year",
          label: "Year",
          options: [
            { label: "2026", value: "2026" },
            { label: "2025", value: "2025" },
          ],
        },
        {
          key: "month",
          label: "Month",
          options: MONTH_OPTIONS,
        },
      ],
      mutation: exportBillings,
      label: "Billings",
    },
    {
      icon: Wallet,
      iconBgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      title: "Earnings",
      description: "Tutor payouts, gross/net earnings, commission",
      filters: [
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Pending", value: "PENDING" },
            { label: "Paid", value: "PAID" },
            { label: "Processing", value: "PROCESSING" },
          ],
        },
        {
          key: "year",
          label: "Year",
          options: [
            { label: "2026", value: "2026" },
            { label: "2025", value: "2025" },
          ],
        },
        {
          key: "month",
          label: "Month",
          options: MONTH_OPTIONS,
        },
      ],
      mutation: exportEarnings,
      label: "Earnings",
    },
    {
      icon: CreditCard,
      iconBgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      title: "Subscriptions",
      description: "Student plans, tier, pricing, dates",
      filters: [
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Active", value: "ACTIVE" },
            { label: "Cancelled", value: "CANCELLED" },
            { label: "Expired", value: "EXPIRED" },
          ],
        },
      ],
      mutation: exportSubscriptions,
      label: "Subscriptions",
    },
    {
      icon: GraduationCap,
      iconBgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      title: "Trial Requests",
      description: "Student, guardian, subject, grade, tutor, dates",
      filters: [
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Pending", value: "PENDING" },
            { label: "Accepted", value: "ACCEPTED" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Expired", value: "EXPIRED" },
          ],
        },
      ],
      mutation: exportTrialRequests,
      label: "Trial Requests",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
        <p className="text-sm text-gray-500 mt-1">
          Download CSV reports for all platform data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportCards.map((card) => (
          <ExportCard
            key={card.title}
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            iconColor={card.iconColor}
            title={card.title}
            description={card.description}
            filters={card.filters}
            onExport={handleExport(card.mutation, card.label)}
            isPending={card.mutation.isPending}
          />
        ))}
      </div>
    </div>
  );
};

export default ExportPage;
