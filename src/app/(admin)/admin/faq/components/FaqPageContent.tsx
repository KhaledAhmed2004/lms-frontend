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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FAQ,
  useAdminFAQs,
  useCreateFAQ,
  useDeleteFAQ,
  useUpdateFAQ,
} from "@/hooks/api";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import FaqToolbar from "./FaqToolbar";

type FAQTab = "all" | "active" | "inactive";

const FAQManagement = () => {
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as FAQTab);
    setCurrentPage(1);
  };

  // Create FAQ
  const handleCreateFAQ = async () => {
    if (!formData.question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!formData.answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    try {
      await createFAQ.mutateAsync({
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        isActive: formData.isActive,
      });
      toast.success("FAQ created successfully");
      setIsCreateModalOpen(false);
      setFormData({ question: "", answer: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || "Failed to create FAQ");
    }
  };

  // Edit FAQ
  const handleEditFAQ = async () => {
    if (!selectedFAQ || !formData.question.trim() || !formData.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    try {
      await updateFAQ.mutateAsync({
        id: selectedFAQ._id,
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        isActive: formData.isActive,
      });
      toast.success("FAQ updated successfully");
      setIsEditModalOpen(false);
      setSelectedFAQ(null);
      setFormData({ question: "", answer: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || "Failed to update FAQ");
    }
  };

  // Delete FAQ
  const handleDeleteFAQ = async () => {
    if (!selectedFAQ) return;

    try {
      await deleteFAQ.mutateAsync(selectedFAQ._id);
      toast.success("FAQ deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedFAQ(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete FAQ");
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
        `FAQ ${faq.isActive ? "deactivated" : "activated"} successfully`,
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to update FAQ status");
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
        header: "Question",
        cell: ({ row }) => (
          <span className="text-gray-900 font-medium text-sm line-clamp-1 max-w-[300px]">
            {row.getValue("question")}
          </span>
        ),
      },
      {
        accessorKey: "answer",
        header: "Answer",
        cell: ({ row }) => (
          <span className="text-gray-600 text-sm line-clamp-1 max-w-[300px]">
            {row.getValue("answer")}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
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
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <span className="text-gray-600 text-sm">
            {formatDate(row.getValue("createdAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Action",
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
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(faq)}>
                  {faq.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => openDeleteDialog(faq)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
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
        <p className="text-red-500">Error loading FAQs. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FaqToolbar
        total={pagination?.total || 0}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onAddClick={() => {
          setFormData({ question: "", answer: "", isActive: true });
          setIsCreateModalOpen(true);
        }}
      />

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
                All
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Inactive
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
                                  header.getContext(),
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
                                cell.getContext(),
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
                          No FAQs found
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
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      pagination?.total || 0,
                    )}{" "}
                    of {pagination?.total || 0} results
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
                        },
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1),
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
            <DialogDescription>
              Create a new frequently asked question for the support page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                placeholder="e.g., How do I schedule a tutoring session?"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                placeholder="Write the answer..."
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                className="min-h-[120px] resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.answer.length}/2000
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
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
              Cancel
            </Button>
            <Button
              onClick={handleCreateFAQ}
              disabled={createFAQ.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {createFAQ.isPending && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              Create FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>Update the FAQ details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question">Question *</Label>
              <Input
                id="edit-question"
                placeholder="e.g., How do I schedule a tutoring session?"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-answer">Answer *</Label>
              <Textarea
                id="edit-answer"
                placeholder="Write the answer..."
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                className="min-h-[120px] resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.answer.length}/2000
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-isActive">Active Status</Label>
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditFAQ}
              disabled={updateFAQ.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {updateFAQ.isPending && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the FAQ &quot;{selectedFAQ?.question}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFAQ}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteFAQ.isPending}
            >
              {deleteFAQ.isPending && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FAQManagement;
