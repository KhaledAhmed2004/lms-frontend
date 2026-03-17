"use client";

import {
  useExportApplications,
  useExportBillings,
  useExportEarnings,
  useExportSessions,
  useExportSubscriptions,
  useExportTrialRequests,
  useExportUsers,
} from "@/hooks/api";
import {
  Calendar,
  CreditCard,
  FileText,
  GraduationCap,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import ExportCard from "./ExportCard";
import ExportHeader from "./ExportHeader";

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
            {
              label: "Selected for Interview",
              value: "SELECTED_FOR_INTERVIEW",
            },
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
      <ExportHeader />

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
