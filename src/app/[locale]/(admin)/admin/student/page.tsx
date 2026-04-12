"use client";

import React, { useState } from "react";
import { Search, MoreVertical, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { formatDateShort } from "@/lib/utils";
import { useStudents, useBlockStudent, useUnblockStudent } from "@/hooks/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslations, useLocale } from "next-intl";

type StudentStatus = "all" | "ACTIVE" | "RESTRICTED";

const StudentManagement = () => {
  const t = useTranslations("students");
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<StudentStatus>("all");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    name: string;
    type: "block" | "unblock";
  } | null>(null);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        ? t("blockedSuccess")
        : t("unblockedSuccess");
    const failMsg = t("errorLoading");

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
          {t("errorLoading")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="w-full sm:w-1/4">
        <AdminStatsCard
          icon={Users}
          label={t("totalStudents")}
          value={pagination?.total || 0}
        />
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-1/3">
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
            <TabsList className="grid w-1/4 grid-cols-2 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black whitespace-nowrap"
              >
                {t("tabAll")}
              </TabsTrigger>
              <TabsTrigger
                value="RESTRICTED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black whitespace-nowrap"
              >
                {t("tabBlocked")}
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              {/* Table */}
              <div className="border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        {t("colName")}
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        {t("colEmail")}
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        {t("colRegistration")}
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        {t("colSessions")}
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        {t("colTrialStatus")}
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        {t("colAction")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <AdminTableSkeleton cols={6} />
                    ) : students.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-8 text-center text-gray-500"
                        >
                          {t("noStudents")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow
                          key={student._id}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${isFetching ? "opacity-50" : ""}`}
                        >
                          <TableCell className="py-3 px-4 text-gray-900 font-medium">
                            <span className="flex items-center gap-1.5">
                              {student.name}
                              {student.studentProfile?.isSpecialStudent && (
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" aria-label="Special student (€25/hr)" />
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-600">
                            {student.email}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-600">
                            {formatDateShort(student.createdAt)}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-600">
                            {student.studentProfile?.sessionRequestsCount || 0}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            {student.studentProfile?.hasCompletedTrial ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                {t("trialDone")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                {t("trialPending")}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  disabled={mutatingId === student._id}
                                >
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link
                                  href={`/admin/student-details?id=${student._id}` as any}
                                >
                                  <DropdownMenuItem>
                                    {t("viewDetails")}
                                  </DropdownMenuItem>
                                </Link>
                                {student.status === "ACTIVE" ? (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      setConfirmAction({
                                        id: student._id,
                                        name: student.name,
                                        type: "block",
                                      })
                                    }
                                  >
                                    {t("blockStudent")}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() =>
                                      setConfirmAction({
                                        id: student._id,
                                        name: student.name,
                                        type: "unblock",
                                      })
                                    }
                                  >
                                    {t("unblockStudent")}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {students.length > 0 && (
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

      {/* Block/Unblock Confirmation Dialog */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "block" ? t("blockStudent") : t("unblockStudent")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "block" ? "Are you sure you want to block" : "Are you sure you want to unblock"}{" "}
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
              {confirmAction?.type === "block" ? t("blockStudent") : t("unblockStudent")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentManagement;
