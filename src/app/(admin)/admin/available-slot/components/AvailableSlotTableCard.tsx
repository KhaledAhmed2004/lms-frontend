import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { InterviewSlot } from "@/hooks/api";
import { INTERVIEW_SLOT_STATUS } from "@/hooks/api";
import { format } from "date-fns";
import { Check, ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type AvailableSlotTableCardProps = {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  slots: InterviewSlot[];
  pagination?: PaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
  onCompleteSlot: (slotId: string) => void;
  onOpenCancel: (slot: InterviewSlot) => void;
  onOpenDelete: (slot: InterviewSlot) => void;
  isCompleting: boolean;
  isDeleting: boolean;
  formatSlotTime: (start: string, end: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
};

export default function AvailableSlotTableCard({
  statusFilter,
  onStatusFilterChange,
  isLoading,
  isFetching,
  slots,
  pagination,
  page,
  onPageChange,
  onCompleteSlot,
  onOpenCancel,
  onOpenDelete,
  isCompleting,
  isDeleting,
  formatSlotTime,
  getStatusBadge,
}: AvailableSlotTableCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">All Interview Slots</CardTitle>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={INTERVIEW_SLOT_STATUS.AVAILABLE}>
                Available
              </SelectItem>
              <SelectItem value={INTERVIEW_SLOT_STATUS.BOOKED}>
                Booked
              </SelectItem>
              <SelectItem value={INTERVIEW_SLOT_STATUS.COMPLETED}>
                Completed
              </SelectItem>
              <SelectItem value={INTERVIEW_SLOT_STATUS.CANCELLED}>
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-4 py-3 border-b">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <div className="flex gap-1 ml-auto">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={isFetching ? "opacity-50 pointer-events-none" : ""}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <TableRow key={slot._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(new Date(slot.startTime), "MMM d, yyyy")}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatSlotTime(slot.startTime, slot.endTime)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {slot.applicantId ? (
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {slot.applicantId.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {slot.applicantId.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(slot.status)}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider delayDuration={100}>
                          <div className="flex items-center justify-end gap-1">
                            {slot.status === INTERVIEW_SLOT_STATUS.BOOKED && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onCompleteSlot(slot._id)}
                                    disabled={isCompleting}
                                    className="hover:bg-green-50"
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Mark as Completed</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {slot.status === INTERVIEW_SLOT_STATUS.BOOKED && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onOpenCancel(slot)}
                                    className="hover:bg-orange-50"
                                  >
                                    <X className="w-4 h-4 text-orange-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Cancel Slot</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {slot.status ===
                              INTERVIEW_SLOT_STATUS.AVAILABLE && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onOpenDelete(slot)}
                                    disabled={isDeleting}
                                    className="hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Delete Slot</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      No interview slots found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {pagination && pagination.totalPage > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} slots
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1 || isFetching}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const totalPages = pagination.totalPage;
                      const currentPage = page;
                      const pages: (number | string)[] = [];

                      if (totalPages <= 5) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else if (currentPage <= 3) {
                        pages.push(1, 2, 3, "...", totalPages);
                      } else if (currentPage >= totalPages - 2) {
                        pages.push(
                          1,
                          "...",
                          totalPages - 2,
                          totalPages - 1,
                          totalPages,
                        );
                      } else {
                        pages.push(1, "...", currentPage, "...", totalPages);
                      }

                      return pages.map((p, idx) =>
                        p === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 text-gray-400"
                          >
                            ...
                          </span>
                        ) : (
                          <Button
                            key={p}
                            variant={page === p ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(p as number)}
                            disabled={isFetching}
                            className={`px-3 min-w-9 ${page === p ? "bg-[#0B31BD] hover:bg-blue-800" : ""}`}
                          >
                            {p}
                          </Button>
                        ),
                      );
                    })()}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= pagination.totalPage || isFetching}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
