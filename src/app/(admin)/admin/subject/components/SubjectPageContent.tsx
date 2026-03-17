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
  Subject,
  useAdminSubjects,
  useCreateSubject,
  useDeleteSubject,
  useUpdateSubject,
} from "@/hooks/api";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SubjectHeader from "./SubjectHeader";
import SubjectStatsActions from "./SubjectStatsActions";
import SubjectTableSection, {
  createSubjectColumns,
} from "./SubjectTableSection";

type SubjectTab = "all" | "active" | "inactive";

const SubjectManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<SubjectTab>("all");
  const itemsPerPage = 10;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

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

  // Fetch subjects
  const { data, isLoading, isFetching, error } = useAdminSubjects(filters);

  // Mutations
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();

  const subjects = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as SubjectTab);
    setCurrentPage(1);
  };

  // Create Subject
  const handleCreateSubject = async () => {
    if (!formData.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      await createSubject.mutateAsync({
        name: formData.name.trim(),
        isActive: formData.isActive,
      });
      toast.success("Subject created successfully");
      setIsCreateModalOpen(false);
      setFormData({ name: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || "Failed to create subject");
    }
  };

  // Edit Subject
  const handleEditSubject = async () => {
    if (!selectedSubject || !formData.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      await updateSubject.mutateAsync({
        id: selectedSubject._id,
        name: formData.name.trim(),
        isActive: formData.isActive,
      });
      toast.success("Subject updated successfully");
      setIsEditModalOpen(false);
      setSelectedSubject(null);
      setFormData({ name: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.message || "Failed to update subject");
    }
  };

  // Delete Subject
  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;

    try {
      await deleteSubject.mutateAsync(selectedSubject._id);
      toast.success("Subject deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedSubject(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete subject");
    }
  };

  // Toggle Subject Status
  const handleToggleStatus = async (subject: Subject) => {
    try {
      await updateSubject.mutateAsync({
        id: subject._id,
        isActive: !subject.isActive,
      });
      toast.success(
        `Subject ${subject.isActive ? "deactivated" : "activated"} successfully`,
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to update subject status");
    }
  };

  const openEditModal = (subject: Subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      isActive: subject.isActive,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnDef<Subject>[] = useMemo(
    () =>
      createSubjectColumns(openEditModal, handleToggleStatus, openDeleteDialog),
    [openEditModal, handleToggleStatus, openDeleteDialog],
  );

  // TanStack Table instance with server-side pagination
  const table = useReactTable({
    data: subjects,
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
          Error loading subjects. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubjectHeader />
      <SubjectStatsActions
        total={pagination?.total || 0}
        onOpenCreate={() => {
          setFormData({ name: "", isActive: true });
          setIsCreateModalOpen(true);
        }}
      />
      <SubjectTableSection
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        table={table}
        columns={columns}
        subjectsCount={subjects.length}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        total={pagination?.total || 0}
        onPageChange={setCurrentPage}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={openDeleteDialog}
      />

      {/* Create Subject Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Create a new subject for tutoring sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Mathematics, Physics"
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
              onClick={handleCreateSubject}
              disabled={createSubject.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {createSubject.isPending && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              Create Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>Update the subject details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Subject Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Mathematics, Physics"
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
              onClick={handleEditSubject}
              disabled={updateSubject.isPending}
              className="bg-black hover:bg-gray-800"
            >
              {updateSubject.isPending && (
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
              This will delete the subject &quot;{selectedSubject?.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubject}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteSubject.isPending}
            >
              {deleteSubject.isPending && (
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

export default SubjectManagement;
