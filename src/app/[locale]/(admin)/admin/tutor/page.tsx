"use client";

import React, { useState } from "react";
import { Search, MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import { AdminStatsCard } from "@/components/admin/admin-stats-card";
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
import { useTutors, useBlockTutor, useUnblockTutor } from "@/hooks/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslations } from "next-intl";

type TutorStatus = "all" | "ACTIVE" | "RESTRICTED";

const TutorManagement = () => {
  const t = useTranslations("tutors");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TutorStatus>("all");
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

  // Fetch tutors
  const { data, isLoading, isFetching, error } = useTutors(filters);

  // Mutations
  const { mutate: blockTutor } = useBlockTutor();
  const { mutate: unblockTutor } = useUnblockTutor();

  const tutors = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        ? t("blockedSuccess")
        : t("unblockedSuccess");
    const failMsg = t("colAction"); // Generic or missing error key - I'll use successMsg for logic then replace with constant

    mutate(id, {
      onSuccess: () => toast.success(successMsg),
      onError: (error: any) => {
        toast.error(
          error?.getFullMessage?.() || error?.message || "Error performing action",
        );
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
      {/* Stats Card */}
      <div className="w-full sm:w-1/4">
        <AdminStatsCard
          icon={Users}
          label={t("totalTutors")}
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
                    <TableRow>
                      <TableHead>{t("colName")}</TableHead>
                      <TableHead>{t("colEmail")}</TableHead>
                      <TableHead>{t("colSubject")}</TableHead>
                      <TableHead>{t("colRegistration")}</TableHead>
                      <TableHead>{t("colSessions")}</TableHead>
                      <TableHead>{t("colAction")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <AdminTableSkeleton cols={6} />
                    ) : tutors.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-8 text-center text-muted-foreground"
                        >
                          {t("noTutors")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      tutors.map((tutor) => (
                        <TableRow
                          key={tutor._id}
                          className={isFetching ? "opacity-50" : ""}
                        >
                          <TableCell className="font-medium">
                            {tutor.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tutor.email}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tutor.tutorProfile?.subjects
                              ?.map((s) => s.name)
                              .join(", ") || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateShort(tutor.createdAt)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tutor.tutorProfile?.totalSessions || 0}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  disabled={mutatingId === tutor._id}
                                >
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link
                                  href={`/admin/tutor-details?id=${tutor._id}` as any}
                                >
                                  <DropdownMenuItem>
                                    {t("viewDetails")}
                                  </DropdownMenuItem>
                                </Link>
                                {tutor.status === "ACTIVE" ? (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      setConfirmAction({
                                        id: tutor._id,
                                        name: tutor.name,
                                        type: "block",
                                      })
                                    }
                                  >
                                    {t("blockTutor")}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() =>
                                      setConfirmAction({
                                        id: tutor._id,
                                        name: tutor.name,
                                        type: "unblock",
                                      })
                                    }
                                  >
                                    {t("unblockTutor")}
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

              {tutors.length > 0 && (
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
              {confirmAction?.type === "block" ? t("blockTutor") : t("unblockTutor")}
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
              {confirmAction?.type === "block" ? t("blockTutor") : t("unblockTutor")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TutorManagement;
