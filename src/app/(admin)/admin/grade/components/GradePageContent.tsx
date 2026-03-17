"use client";

import { AdminPagination } from "@/components/admin/admin-pagination";
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
import { Label } from "@/components/ui/label";
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
import {
  Grade,
  useAdminGrades,
  useCreateGrade,
  useDeleteGrade,
  useUpdateGrade,
} from "@/hooks/api";
import { formatDateShort } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import GradeToolbar from "./GradeToolbar";
import { Input } from "@/components/ui/input";

type GradeTab = "all" | "active" | "inactive";

const GradeManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<GradeTab>("all");
  const itemsPerPage = 10;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
  });

  // Build filters based on active tab
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchTerm || undefined,
    isActive: activeTab === "all" ? undefined : activeTab === "active",
  };

  // Fetch grades
  const { data, isLoading, isFetching, error } = useAdminGrades(filters);

  // Mutations
  const createGrade = useCreateGrade();
  const updateGrade = useUpdateGrade();
  const deleteGrade = useDeleteGrade();

  const grades = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as GradeTab);
    setCurrentPage(1);
  };

  // Create Grade
  const handleCreateGrade = async () => {
    if (!formData.name.trim()) {
      toast.error("Grade name is required");
      return;
    }

    try {
      await createGrade.mutateAsync({
        name: formData.name.trim(),
        isActive: formData.isActive,
      });
      toast.success("Grade created successfully");
      setIsCreateModalOpen(false);
      setFormData({ name: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || "Failed to create grade");
    }
  };

  // Edit Grade
  const handleEditGrade = async () => {
    if (!selectedGrade || !formData.name.trim()) {
      toast.error("Grade name is required");
      return;
    }

    try {
      await updateGrade.mutateAsync({
        id: selectedGrade._id,
        name: formData.name.trim(),
        isActive: formData.isActive,
      });
      toast.success("Grade updated successfully");
      setIsEditModalOpen(false);
      setSelectedGrade(null);
      setFormData({ name: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || "Failed to update grade");
    }
  };

  // Delete Grade
  const handleDeleteGrade = async () => {
    if (!selectedGrade) return;

    try {
      await deleteGrade.mutateAsync(selectedGrade._id);
      toast.success("Grade deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedGrade(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete grade");
    }
  };

  // Toggle Grade Status
  const handleToggleStatus = async (grade: Grade) => {
    try {
      await updateGrade.mutateAsync({
        id: grade._id,
        isActive: !grade.isActive,
      });
      toast.success(
        `Grade ${grade.isActive ? "deactivated" : "activated"} successfully`,
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to update grade status");
    }
  };

  const openEditModal = (grade: Grade) => {
    setSelectedGrade(grade);
    setFormData({
      name: grade.name,
      isActive: grade.isActive,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsDeleteDialogOpen(true);
  };

  // Column definitions for TanStack Table
  const columns: ColumnDef<Grade>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Grade Name",
        cell: ({ row }) => (
          <span className="text-gray-900 font-medium text-sm">
            {row.getValue("name")}
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
            {formatDateShort(row.getValue("createdAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const grade = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditModal(grade)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(grade)}>
                  {grade.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => openDeleteDialog(grade)}
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

  // TanStack Table instance with server-side pagination
  const table = useReactTable({
    data: grades,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  // Skeleton rows for table loading
  const TableSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-4 w-32" />
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

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Error loading grades. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GradeToolbar
        total={pagination?.total || 0}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onAddClick={() => {
          setFormData({ name: "", isActive: true });
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
                          No grades found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {grades.length > 0 && (
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

      {/* Create Grade Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Grade</DialogTitle>
            <DialogDescription>
              Create a new grade level for students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Grade Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Grade 1, Grade 2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
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
              onClick={handleCreateGrade}
              disabled={createGrade.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {createGrade.isPending && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              Create Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Grade Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Grade</DialogTitle>
            <DialogDescription>Update the grade details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Grade Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Grade 1, Grade 2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
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
              onClick={handleEditGrade}
              disabled={updateGrade.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {updateGrade.isPending && (
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
              This will delete the grade &quot;{selectedGrade?.name}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGrade}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteGrade.isPending}
            >
              {deleteGrade.isPending && (
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

export default GradeManagement;
