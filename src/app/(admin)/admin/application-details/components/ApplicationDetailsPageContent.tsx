"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminApplication,
  useApproveApplication,
  useRejectApplication,
  useSelectForInterview,
  useSendForRevision,
  type AdminApplication,
  type AdminApplicationStatus,
} from "@/hooks/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import ApplicationActionButtons from "./ApplicationActionButtons";
import ApplicationDetailsHeader from "./ApplicationDetailsHeader";
import ApplicationInfoSections from "./ApplicationInfoSections";
import RevisionRequestDialog from "./RevisionRequestDialog";

const ApplicationDetails = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";

  // Revision modal state
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  // Fetch application details
  const { data: application, isLoading, error } = useAdminApplication(id);

  // Mutations
  const { mutate: selectForInterview, isPending: isSelecting } =
    useSelectForInterview();
  const { mutate: approveApplication, isPending: isApproving } =
    useApproveApplication();
  const { mutate: rejectApplication, isPending: isRejecting } =
    useRejectApplication();
  const { mutate: sendForRevision, isPending: isSendingRevision } =
    useSendForRevision();

  const isActionPending =
    isSelecting || isApproving || isRejecting || isSendingRevision;

  // Handlers
  const handleSelectForInterview = () => {
    selectForInterview(
      { id },
      {
        onSuccess: () => {
          toast.success("Application selected for interview");
        },
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

  const handleApprove = () => {
    approveApplication(
      { id },
      {
        onSuccess: () => {
          toast.success("Application approved - User is now a Tutor");
          router.push("/admin/application");
        },
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

  const handleReject = () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    rejectApplication(
      { id, rejectionReason: reason },
      {
        onSuccess: () => {
          toast.success("Application rejected");
          router.push("/admin/application");
        },
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

  const handleOpenRevisionModal = () => {
    setRevisionNote("");
    setIsRevisionModalOpen(true);
  };

  const handleSubmitRevision = () => {
    if (revisionNote.trim().length < 10) {
      toast.error("Revision note must be at least 10 characters");
      return;
    }

    sendForRevision(
      { id, revisionNote: revisionNote.trim() },
      {
        onSuccess: () => {
          toast.success("Application sent for revision");
          setIsRevisionModalOpen(false);
          setRevisionNote("");
        },
        onError: (error: any) => {
          toast.error(
            error?.getFullMessage?.() ||
              error?.message ||
              "Failed to send for revision",
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: AdminApplicationStatus) => {
    switch (status) {
      case "SUBMITTED":
        return "Pending Review";
      case "SELECTED_FOR_INTERVIEW":
        return "Selected for Interview";
      case "APPROVED":
        return "Approved";
      case "REJECTED":
        return "Rejected";
      case "REVISION":
        return "Revision Required";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatAddress = (app: AdminApplication) => {
    const { street, houseNumber, zip, city } = app;
    return `${street} ${houseNumber}, ${zip} ${city}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card className="border-gray-200">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">
          Application not found or error loading details.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/application")}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApplicationDetailsHeader
        statusLabel={getStatusLabel(application.status)}
        statusClassName={getStatusColor(application.status)}
        onBack={() => router.push("/admin/application")}
      />
      <ApplicationInfoSections
        application={application}
        formatDate={formatDate}
        address={formatAddress(application)}
      />
      <ApplicationActionButtons
        status={application.status}
        isActionPending={isActionPending}
        isSelecting={isSelecting}
        isApproving={isApproving}
        isRejecting={isRejecting}
        onSelectForInterview={handleSelectForInterview}
        onApprove={handleApprove}
        onOpenRevisionModal={handleOpenRevisionModal}
        onReject={handleReject}
      />
      <RevisionRequestDialog
        open={isRevisionModalOpen}
        onOpenChange={setIsRevisionModalOpen}
        revisionNote={revisionNote}
        onRevisionNoteChange={setRevisionNote}
        isSendingRevision={isSendingRevision}
        onSubmit={handleSubmitRevision}
      />
    </div>
  );
};

export default function ApplicationDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ApplicationDetails />
    </Suspense>
  );
}
