"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, MoreVertical, HelpCircle, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  useAdminFAQs,
  useCreateFAQ,
  useUpdateFAQ,
  useDeleteFAQ,
  FAQ,
} from "@/hooks/api";
import { useTranslations } from "next-intl";

type FAQTab = "all" | "active" | "inactive";

const FAQManagement = () => {
  const t = useTranslations("faqs");
  const tc = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FAQTab>("all");
  const itemsPerPage = 10;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    isActive: true,
  });

  // Build filters based on active tab
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchTerm || undefined,
    isActive: activeTab === "all" ? undefined : activeTab === "active",
  };

  // Fetch FAQs
  const { data, isLoading, isFetching, error } = useAdminFAQs(filters);

  // Mutations
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();
  const deleteFAQ = useDeleteFAQ();

  const faqs = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as FAQTab);
    setCurrentPage(1);
  };

  // Create FAQ
  const handleCreateFAQ = async () => {
    if (!formData.question.trim()) {
      toast.error(t("questionRequired"));
      return;
    }
    if (!formData.answer.trim()) {
      toast.error(t("answerRequired"));
      return;
    }

    try {
      await createFAQ.mutateAsync({
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        isActive: formData.isActive,
      });
      toast.success(t("createSuccess"));
      setIsCreateModalOpen(false);
      setFormData({ question: "", answer: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || t("createFailed"));
    }
  };

  // Edit FAQ
  const handleEditFAQ = async () => {
    if (!selectedFAQ || !formData.question.trim() || !formData.answer.trim()) {
      toast.error(t("questionAnswerRequired"));
      return;
    }

    try {
      await updateFAQ.mutateAsync({
        id: selectedFAQ._id,
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        isActive: formData.isActive,
      });
      toast.success(t("updateSuccess"));
      setIsEditModalOpen(false);
      setSelectedFAQ(null);
      setFormData({ question: "", answer: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || t("updateFailed"));
    }
  };

  // Delete FAQ
  const handleDeleteFAQ = async () => {
    if (!selectedFAQ) return;

    try {
      await deleteFAQ.mutateAsync(selectedFAQ._id);
      toast.success(t("deleteSuccess"));
      setIsDeleteDialogOpen(false);
      setSelectedFAQ(null);
    } catch (error: any) {
      toast.error(error?.message || t("deleteFailed"));
    }
  };

  // Toggle FAQ Status
  const handleToggleStatus = async (faq: FAQ) => {
    try {
      await updateFAQ.mutateAsync({
        id: faq._id,
        isActive: !faq.isActive,
      });
      toast.success(
        t(faq.isActive ? "deactivatedSuccess" : "activatedSuccess")
      );
    } catch (error: any) {
      toast.error(error?.message || t("updateStatusFailed"));
    }
  };

  const openEditModal = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // Column definitions
  const columns: ColumnDef<FAQ>[] = useMemo(
    () => [
      {
        accessorKey: "question",
        header: t("question"),
        cell: ({ row }) => (
          <span className="text-gray-900 font-medium text-sm line-clamp-1 max-w-[300px]">
            {row.getValue("question")}
          </span>
        ),
      },
      {
        accessorKey: "answer",
        header: t("answer"),
        cell: ({ row }) => (
          <span className="text-gray-600 text-sm line-clamp-1 max-w-[300px]">
            {row.getValue("answer")}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: t("status"),
        cell: ({ row }) => {
          const isActive = row.getValue("isActive") as boolean;
          return (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={
                isActive
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-100"
              }
            >
              {isActive ? t("active") : t("inactive")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: t("createdAt"),
        cell: ({ row }) => (
          <span className="text-gray-600 text-sm">
            {formatDate(row.getValue("createdAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        header: t("action"),
        cell: ({ row }) => {
          const faq = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditModal(faq)}>
                  {tc("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(faq)}>
                  {faq.isActive ? t("deactivate") : t("activate")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => openDeleteDialog(faq)}
                >
                  {tc("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, tc]
  );

  // TanStack Table instance
  const table = useReactTable({
    data: faqs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  // Skeleton rows
  const TableSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-8 w-8 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{t("errorLoading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats and Add Button */}
      <div className="flex items-center justify-between">
        {/* Stats Card */}
        <div className="w-1/4">
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="bg-blue-50 p-2 rounded-full w-fit mb-2">
                    <HelpCircle className="text-blue-600" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {t("totalFaqs")}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {pagination?.total || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add FAQ Button */}
        <Button
          onClick={() => {
            setFormData({ question: "", answer: "", isActive: true });
            setIsCreateModalOpen(true);
          }}
          className="bg-black hover:bg-gray-800"
        >
          <Plus size={18} className="mr-2" />
          {t("addFaq")}
        </Button>
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
            <TabsList className="grid w-1/3 grid-cols-3 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                {t("all")}
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                {t("active")}
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                {t("inactive")}
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              {/* Table */}
              <div className="border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="border-b border-gray-200"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="py-3 px-4 font-semibold text-gray-700 text-sm"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isLoading || isFetching ? (
                      <TableSkeleton />
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-3 px-4">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="py-8 text-center text-gray-500"
                        >
                          {t("noFaqs")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {faqs.length > 0 && (
                <div className="flex items-center justify-between pt-6">
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    {tc("showing")} {(currentPage - 1) * itemsPerPage + 1} {tc("to")}{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      pagination?.total || 0
                    )}{" "}
                    {tc("of")} {pagination?.total || 0} {tc("results")}
                  </p>
                  <Pagination className="justify-end mx-0">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={page === currentPage}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            (page === 2 && currentPage > 3) ||
                            (page === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Create FAQ Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("addNewTitle")}</DialogTitle>
            <DialogDescription>
              {t("addNewDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>{t("questionLabel")}</Label>
              <Input
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder={t("questionPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("answerLabel")}</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder={t("answerPlaceholder")}
                rows={5}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="create-is-active">
                {t("activeStatus")}
              </Label>
              <Switch
                id="create-is-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              {tc("cancel")}
            </Button>
            <Button
              onClick={handleCreateFAQ}
              disabled={createFAQ.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {createFAQ.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("createFaq")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("editFaq")}</DialogTitle>
            <DialogDescription>
              {t("editDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>{t("questionLabel")}</Label>
              <Input
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder={t("questionPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("answerLabel")}</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder={t("answerPlaceholder")}
                rows={5}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="edit-is-active">
                {t("activeStatus")}
              </Label>
              <Switch
                id="edit-is-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              {tc("cancel")}
            </Button>
            <Button
              onClick={handleEditFAQ}
              disabled={updateFAQ.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {updateFAQ.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tc("saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDesc", { question: selectedFAQ?.question || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFAQ(null)}>
              {tc("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFAQ}
              className="bg-red-600 hover:bg-red-700"
            >
              {tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FAQManagement;
