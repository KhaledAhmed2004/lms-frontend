"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBlockTutor, useTutors, useUnblockTutor } from "@/hooks/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { toast } from "sonner";
import TutorHeader from "./TutorHeader";
import TutorStats from "./TutorStats";
import TutorsTable, {
  type TutorConfirmAction,
  type TutorStatus,
} from "./TutorsTable";

const TutorManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TutorStatus>("all");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<TutorConfirmAction | null>(
    null,
  );
  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Build filters based on active tab
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: debouncedSearch || undefined,
    status: activeTab === "all" ? undefined : activeTab,
  };

  // Fetch tutors
  const { data, isLoading, isFetching, error } = useTutors(filters);

  // Mutations
  const { mutate: blockTutor } = useBlockTutor();
  const { mutate: unblockTutor } = useUnblockTutor();

  const tutors = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TutorStatus);
    setCurrentPage(1);
  };

  const handleConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, type } = confirmAction;
    setMutatingId(id);

    const mutate = type === "block" ? blockTutor : unblockTutor;
    const successMsg =
      type === "block"
        ? "Tutor blocked successfully"
        : "Tutor unblocked successfully";
    const failMsg =
      type === "block" ? "Failed to block tutor" : "Failed to unblock tutor";

    mutate(id, {
      onSuccess: () => toast.success(successMsg),
      onError: (error: any) => {
        toast.error(error?.getFullMessage?.() || error?.message || failMsg);
      },
      onSettled: () => setMutatingId(null),
    });
    setConfirmAction(null);
  };

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Error loading tutors. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TutorHeader />
      <TutorStats totalTutors={pagination?.total || 0} />
      <TutorsTable
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        tutors={tutors}
        mutatingId={mutatingId}
        onSetConfirmAction={setConfirmAction}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        total={pagination?.total || 0}
        onPageChange={setCurrentPage}
      />

      {/* Block/Unblock Confirmation Dialog */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "block" ? "Block" : "Unblock"} Tutor
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.type}{" "}
              <span className="font-medium text-gray-900">
                {confirmAction?.name}
              </span>
              ?
              {confirmAction?.type === "block" &&
                " They will not be able to access the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedAction}
              className={
                confirmAction?.type === "block"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {confirmAction?.type === "block" ? "Block" : "Unblock"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TutorManagement;
