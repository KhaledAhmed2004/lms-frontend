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
import { useTranslations } from "next-intl";

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

  const t = useTranslations("export");

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
                  <SelectItem value="all">
                    {t("allFilter", { filter: filter.label })}
                  </SelectItem>
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
          {isPending ? t("downloading") : t("downloadCsv")}
        </Button>
      </CardContent>
    </Card>
  );
}

const ExportPage = () => {
  const t = useTranslations("export");
  const exportUsers = useExportUsers();
  const exportApplications = useExportApplications();
  const exportSessions = useExportSessions();
  const exportBillings = useExportBillings();
  const exportEarnings = useExportEarnings();
  const exportSubscriptions = useExportSubscriptions();
  const exportTrialRequests = useExportTrialRequests();

  const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    label: t(`months.${i + 1}`),
    value: String(i + 1),
  }));

  const handleExport = (
    mutation: { mutateAsync: (params: any) => Promise<void> },
    label: string,
  ) => {
    return async (params: Record<string, string>) => {
      try {
        await mutation.mutateAsync(params);
        toast.success(t("exportSuccess", { label }));
      } catch {
        toast.error(t("exportFailed", { label: label.toLowerCase() }));
      }
    };
  };

  const exportCards = [
    {
      icon: Users,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      title: t("users"),
      description: t("usersDesc"),
      filters: [
        {
          key: "role",
          label: t("role"),
          options: [
            { label: t("student"), value: "STUDENT" },
            { label: t("tutor"), value: "TUTOR" },
          ],
        },
      ],
      mutation: exportUsers,
      label: t("users"),
    },
    {
      icon: FileText,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      title: t("applications"),
      description: t("applicationsDesc"),
      filters: [
        {
          key: "status",
          label: t("status"),
          options: [
            { label: t("submitted"), value: "SUBMITTED" },
            { label: t("resubmitted"), value: "RESUBMITTED" },
            { label: t("selectedForInterview"), value: "SELECTED_FOR_INTERVIEW" },
            { label: t("approved"), value: "APPROVED" },
            { label: t("rejected"), value: "REJECTED" },
            { label: t("revision"), value: "REVISION" },
          ],
        },
      ],
      mutation: exportApplications,
      label: t("applications"),
    },
    {
      icon: Calendar,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600",
      title: t("sessions"),
      description: t("sessionsDesc"),
      filters: [
        {
          key: "status",
          label: t("status"),
          options: [
            { label: t("completed"), value: "COMPLETED" },
            { label: t("scheduled"), value: "SCHEDULED" },
            { label: t("inProgress"), value: "IN_PROGRESS" },
            { label: t("cancelled"), value: "CANCELLED" },
            { label: t("noShow"), value: "NO_SHOW" },
          ],
        },
      ],
      mutation: exportSessions,
      label: t("sessions"),
    },
    {
      icon: Receipt,
      iconBgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      title: t("billings"),
      description: t("billingsDesc"),
      filters: [
        {
          key: "status",
          label: t("status"),
          options: [
            { label: t("pending"), value: "PENDING" },
            { label: t("paid"), value: "PAID" },
            { label: t("failed"), value: "FAILED" },
          ],
        },
        {
          key: "year",
          label: t("year"),
          options: [
            { label: "2026", value: "2026" },
            { label: "2025", value: "2025" },
          ],
        },
        {
          key: "month",
          label: t("month"),
          options: MONTH_OPTIONS,
        },
      ],
      mutation: exportBillings,
      label: t("billings"),
    },
    {
      icon: Wallet,
      iconBgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      title: t("earnings"),
      description: t("earningsDesc"),
      filters: [
        {
          key: "status",
          label: t("status"),
          options: [
            { label: t("pending"), value: "PENDING" },
            { label: t("paid"), value: "PAID" },
            { label: t("processing"), value: "PROCESSING" },
          ],
        },
        {
          key: "year",
          label: t("year"),
          options: [
            { label: "2026", value: "2026" },
            { label: "2025", value: "2025" },
          ],
        },
        {
          key: "month",
          label: t("month"),
          options: MONTH_OPTIONS,
        },
      ],
      mutation: exportEarnings,
      label: t("earnings"),
    },
    {
      icon: CreditCard,
      iconBgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      title: t("subscriptions"),
      description: t("subscriptionsDesc"),
      filters: [
        {
          key: "status",
          label: t("status"),
          options: [
            { label: t("active"), value: "ACTIVE" },
            { label: t("cancelled"), value: "CANCELLED" },
            { label: t("expired"), value: "EXPIRED" },
          ],
        },
      ],
      mutation: exportSubscriptions,
      label: t("subscriptions"),
    },
    {
      icon: GraduationCap,
      iconBgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      title: t("trialRequests"),
      description: t("trialRequestsDesc"),
      filters: [
        {
          key: "status",
          label: t("status"),
          options: [
            { label: t("pending"), value: "PENDING" },
            { label: t("accepted"), value: "ACCEPTED" },
            { label: t("completed"), value: "COMPLETED" },
            { label: t("expired"), value: "EXPIRED" },
          ],
        },
      ],
      mutation: exportTrialRequests,
      label: t("trialRequests"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("subtitle")}
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
