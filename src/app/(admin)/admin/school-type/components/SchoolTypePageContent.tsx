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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  SchoolType,
  useAdminSchoolTypes,
  useCreateSchoolType,
  useDeleteSchoolType,
  useUpdateSchoolType,
} from "@/hooks/api";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SchoolTypeHeader from "./SchoolTypeHeader";
import SchoolTypeStatsActions from "./SchoolTypeStatsActions";
import SchoolTypeTableSection, {
  createSchoolTypeColumns,
} from "./SchoolTypeTableSection";

type SchoolTypeTab = "all" | "active" | "inactive";

const SchoolTypeManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<SchoolTypeTab>("all");
  const itemsPerPage = 10;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchoolType, setSelectedSchoolType] =
    useState<SchoolType | null>(null);

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

  // Fetch school types
  const { data, isLoading, isFetching, error } = useAdminSchoolTypes(filters);

  // Mutations
  const createSchoolType = useCreateSchoolType();
  const updateSchoolType = useUpdateSchoolType();
  const deleteSchoolType = useDeleteSchoolType();

  const schoolTypes = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as SchoolTypeTab);
    setCurrentPage(1);
  };

  // Create School Type
  const handleCreateSchoolType = async () => {
    if (!formData.name.trim()) {
      toast.error("School type name is required");
      return;
    }

    try {
      await createSchoolType.mutateAsync({
        name: formData.name.trim(),
        isActive: formData.isActive,
      });
      toast.success("School type created successfully");
      setIsCreateModalOpen(false);
      setFormData({ name: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || "Failed to create school type");
    }
  };

  // Edit School Type
  const handleEditSchoolType = async () => {
    if (!selectedSchoolType || !formData.name.trim()) {
      toast.error("School type name is required");
      return;
    }

    try {
      await updateSchoolType.mutateAsync({
        id: selectedSchoolType._id,
        name: formData.name.trim(),
        isActive: formData.isActive,
      });
      toast.success("School type updated successfully");
      setIsEditModalOpen(false);
      setSelectedSchoolType(null);
      setFormData({ name: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || "Failed to update school type");
    }
  };

  // Delete School Type
  const handleDeleteSchoolType = async () => {
    if (!selectedSchoolType) return;

    try {
      await deleteSchoolType.mutateAsync(selectedSchoolType._id);
      toast.success("School type deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedSchoolType(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete school type");
    }
  };

  // Toggle School Type Status
  const handleToggleStatus = async (schoolType: SchoolType) => {
    try {
      await updateSchoolType.mutateAsync({
        id: schoolType._id,
        isActive: !schoolType.isActive,
      });
      toast.success(
        `School type ${schoolType.isActive ? "deactivated" : "activated"} successfully`,
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to update school type status");
    }
  };

  const openEditModal = (schoolType: SchoolType) => {
    setSelectedSchoolType(schoolType);
    setFormData({
      name: schoolType.name,
      isActive: schoolType.isActive,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (schoolType: SchoolType) => {
    setSelectedSchoolType(schoolType);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const columns: ColumnDef<SchoolType>[] = useMemo(
    () =>
      createSchoolTypeColumns(
        openEditModal,
        handleToggleStatus,
        openDeleteDialog,
        formatDate,
      ),
    [openEditModal, handleToggleStatus, openDeleteDialog],
  );

  // TanStack Table instance with server-side pagination
  const table = useReactTable({
    data: schoolTypes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">
          Error loading school types. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SchoolTypeHeader />
      <SchoolTypeStatsActions
        total={pagination?.total || 0}
        onOpenCreate={() => {
          setFormData({ name: "", isActive: true });
          setIsCreateModalOpen(true);
        }}
      />
      <SchoolTypeTableSection
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        table={table}
        columns={columns}
        schoolTypesCount={schoolTypes.length}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        total={pagination?.total || 0}
        onPageChange={setCurrentPage}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={openDeleteDialog}
      />

      {/* Create School Type Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New School Type</DialogTitle>
            <DialogDescription>
              Create a new school type for categorization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">School Type Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Gymnasium, Realschule"
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
              onClick={handleCreateSchoolType}
              disabled={createSchoolType.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {createSchoolType.isPending && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              Create School Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit School Type Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit School Type</DialogTitle>
            <DialogDescription>
              Update the school type details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">School Type Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Gymnasium, Realschule"
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
              onClick={handleEditSchoolType}
              disabled={updateSchoolType.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {updateSchoolType.isPending && (
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
              This will delete the school type &quot;{selectedSchoolType?.name}
              &quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSchoolType}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteSchoolType.isPending}
            >
              {deleteSchoolType.isPending && (
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

export default SchoolTypeManagement;
