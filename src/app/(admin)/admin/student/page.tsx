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
import { useBlockStudent, useStudents, useUnblockStudent } from "@/hooks/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { toast } from "sonner";
import StudentHeader from "./components/StudentHeader";
import StudentStats from "./components/StudentStats";
import StudentsTable, {
  type StudentConfirmAction,
  type StudentStatus,
} from "./components/StudentsTable";

const StudentManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<StudentStatus>("all");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] =
    useState<StudentConfirmAction | null>(null);
  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Build filters based on active tab
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: debouncedSearch || undefined,
    status: activeTab === "all" ? undefined : activeTab,
  };

  // Fetch students
  const { data, isLoading, isFetching, error } = useStudents(filters);

  // Mutations
  const { mutate: blockStudent } = useBlockStudent();
  const { mutate: unblockStudent } = useUnblockStudent();

  const students = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as StudentStatus);
    setCurrentPage(1);
  };

  const handleConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, type } = confirmAction;
    setMutatingId(id);

    const mutate = type === "block" ? blockStudent : unblockStudent;
    const successMsg =
      type === "block"
        ? "Student blocked successfully"
        : "Student unblocked successfully";
    const failMsg =
      type === "block"
        ? "Failed to block student"
        : "Failed to unblock student";

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
        <p className="text-red-500">
          Error loading students. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentHeader />
      <StudentStats totalStudents={pagination?.total || 0} />
      <StudentsTable
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        students={students}
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
              {confirmAction?.type === "block" ? "Block" : "Unblock"} Student
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

export default StudentManagement;
