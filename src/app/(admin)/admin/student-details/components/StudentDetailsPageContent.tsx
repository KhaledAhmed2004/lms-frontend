"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBlockStudent,
  useStudent,
  useToggleSpecialStudent,
  useUnblockStudent,
} from "@/hooks/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import StudentDetailsActions from "./StudentDetailsActions";
import StudentDetailsHeader from "./StudentDetailsHeader";
import StudentDetailsInfoCard from "./StudentDetailsInfoCard";
import StudentDetailsStatsCard from "./StudentDetailsStatsCard";

const StudentDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";

  // Fetch student details
  const { data: student, isLoading, error } = useStudent(id);

  // Mutations
  const { mutate: blockStudent, isPending: isBlocking } = useBlockStudent();
  const { mutate: unblockStudent, isPending: isUnblocking } =
    useUnblockStudent();
  const { mutate: toggleSpecial, isPending: isTogglingSpecial } =
    useToggleSpecialStudent();

  const isActionPending = isBlocking || isUnblocking || isTogglingSpecial;

  // Handlers
  const handleBlock = () => {
    blockStudent(id, {
      onSuccess: () => {
        toast.success("Student blocked successfully");
      },
      onError: (error: any) => {
        toast.error(
          error?.getFullMessage?.() ||
            error?.message ||
            "Failed to block student",
        );
      },
    });
  };

  const handleUnblock = () => {
    unblockStudent(id, {
      onSuccess: () => {
        toast.success("Student unblocked successfully");
      },
      onError: (error: any) => {
        toast.error(
          error?.getFullMessage?.() ||
            error?.message ||
            "Failed to unblock student",
        );
      },
    });
  };

  const handleToggleSpecial = () => {
    toggleSpecial(id, {
      onSuccess: (data: any) => {
        toast.success(data?.message || "Special status updated");
      },
      onError: (error: any) => {
        toast.error(
          error?.getFullMessage?.() ||
            error?.message ||
            "Failed to update special status",
        );
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
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
  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">
          Student not found or error loading details.
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/student")}>
          <ArrowLeft className="mr-2" size={16} />
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentDetailsHeader
        status={student.status}
        isSpecialStudent={student.studentProfile?.isSpecialStudent}
        onBack={() => router.push("/admin/student")}
        onEdit={() => router.push(`/admin/edit-student?id=${id}`)}
      />

      <StudentDetailsInfoCard
        name={student.name}
        phone={student.phone}
        location={student.location}
        email={student.email}
        dateOfBirth={student.dateOfBirth}
        createdAt={student.createdAt}
        formatDate={formatDate}
      />

      <StudentDetailsStatsCard
        trialRequestsCount={student.studentProfile?.trialRequestsCount}
        sessionRequestsCount={student.studentProfile?.sessionRequestsCount}
        hasCompletedTrial={student.studentProfile?.hasCompletedTrial}
      />

      <StudentDetailsActions
        status={student.status}
        isSpecialStudent={student.studentProfile?.isSpecialStudent}
        isActionPending={isActionPending}
        isBlocking={isBlocking}
        isUnblocking={isUnblocking}
        isTogglingSpecial={isTogglingSpecial}
        onEdit={() => router.push(`/admin/edit-student?id=${id}`)}
        onToggleSpecial={handleToggleSpecial}
        onBlock={handleBlock}
        onUnblock={handleUnblock}
      />
    </div>
  );
};

export default function StudentDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <StudentDetailsContent />
    </Suspense>
  );
}
