"use client";

import { Badge } from "@/components/ui/badge";
import {
  INTERVIEW_SLOT_STATUS,
  InterviewSlot,
  useCancelInterviewSlot,
  useCompleteInterviewSlot,
  useCreateInterviewSlot,
  useDeleteInterviewSlot,
  useInterviewSlots,
} from "@/hooks/api";
import { ApiError } from "@/lib/api-client";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import AvailableSlotCalendarCard from "./AvailableSlotCalendarCard";
import AvailableSlotHeader from "./AvailableSlotHeader";
import AvailableSlotTableCard from "./AvailableSlotTableCard";
import CancelSlotDialog from "./CancelSlotDialog";
import CreateSlotDialog from "./CreateSlotDialog";
import DeleteSlotDialog from "./DeleteSlotDialog";

const AvailableSlots = () => {
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<InterviewSlot | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  // Create slot form state - selectedHours is an array of starting hours (0-23) for multi-select
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  // Generate 24 hourly time slots for dropdown
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const startHour = i;
    const endHour = (i + 1) % 24;
    const formatHour = (hour: number) => {
      if (hour === 0) return "12:00 AM";
      if (hour === 12) return "12:00 PM";
      if (hour < 12) return `${hour}:00 AM`;
      return `${hour - 12}:00 PM`;
    };
    return {
      value: String(i),
      label: `${formatHour(startHour)} - ${formatHour(endHour)}`,
    };
  });

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // API Hooks
  const {
    data: slotsData,
    isLoading,
    isFetching,
    refetch,
  } = useInterviewSlots({
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { mutate: createSlot, isPending: isCreating } =
    useCreateInterviewSlot();
  const { mutate: deleteSlot, isPending: isDeleting } =
    useDeleteInterviewSlot();
  const { mutate: completeSlot, isPending: isCompleting } =
    useCompleteInterviewSlot();
  const { mutate: cancelSlot, isPending: isCancelling } =
    useCancelInterviewSlot();

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday, 6 = Saturday)
  const startDayOfWeek = monthStart.getDay();

  // Week days starting from Sunday
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get slots for selected date
  const getSlotsForDate = (date: Date) => {
    if (!slotsData?.data) return [];
    return slotsData.data.filter((slot) => {
      const slotDate = new Date(slot.startTime);
      return isSameDay(slotDate, date);
    });
  };

  // Check if date has slots
  const dateHasSlots = (date: Date) => {
    return getSlotsForDate(date).length > 0;
  };

  // Toggle hour selection for multi-select
  const toggleHourSelection = (hour: string) => {
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour],
    );
  };

  // Handle create slot - creates multiple slots if multiple hours selected
  const handleCreateSlot = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (selectedHours.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    // Sort hours for consistent creation order
    const sortedHours = [...selectedHours].sort(
      (a, b) => parseInt(a) - parseInt(b),
    );

    let successCount = 0;
    let errorCount = 0;

    for (const hourStr of sortedHours) {
      const hour = parseInt(hourStr, 10);

      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(hour, 0, 0, 0);

      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(hour + 1, 0, 0, 0);

      await new Promise<void>((resolve) => {
        createSlot(
          {
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
          },
          {
            onSuccess: () => {
              successCount++;
              resolve();
            },
            onError: (error: unknown) => {
              errorCount++;
              const errorMessage =
                error instanceof ApiError
                  ? error.getFullMessage()
                  : "Failed to create slot";
              toast.error(
                `Failed to create slot at ${timeSlots[hour].label}: ${errorMessage}`,
              );
              resolve();
            },
          },
        );
      });
    }

    if (successCount > 0) {
      toast.success(
        `${successCount} interview slot${successCount > 1 ? "s" : ""} created successfully`,
      );
      setIsCreateModalOpen(false);
      resetForm();
      refetch();
    }
  };

  // Handle delete slot
  const handleDeleteSlot = () => {
    if (!slotToDelete) return;

    deleteSlot(slotToDelete._id, {
      onSuccess: () => {
        toast.success("Slot deleted successfully");
        setIsDeleteModalOpen(false);
        setSlotToDelete(null);
        refetch();
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof ApiError
            ? error.getFullMessage()
            : "Failed to delete slot";
        toast.error(errorMessage);
      },
    });
  };

  // Handle complete slot
  const handleCompleteSlot = (slotId: string) => {
    completeSlot(slotId, {
      onSuccess: () => {
        toast.success("Interview marked as completed");
        refetch();
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof ApiError
            ? error.getFullMessage()
            : "Failed to complete slot";
        toast.error(errorMessage);
      },
    });
  };

  // Handle cancel slot
  const handleCancelSlot = () => {
    if (!selectedSlot || !cancellationReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    cancelSlot(
      { id: selectedSlot._id, cancellationReason },
      {
        onSuccess: () => {
          toast.success("Slot cancelled successfully");
          setIsCancelModalOpen(false);
          setSelectedSlot(null);
          setCancellationReason("");
          refetch();
        },
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof ApiError
              ? error.getFullMessage()
              : "Failed to cancel slot";
          toast.error(errorMessage);
        },
      },
    );
  };

  // Reset form
  const resetForm = () => {
    setSelectedHours([]);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case INTERVIEW_SLOT_STATUS.AVAILABLE:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case INTERVIEW_SLOT_STATUS.BOOKED:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Booked
          </Badge>
        );
      case INTERVIEW_SLOT_STATUS.COMPLETED:
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Completed
          </Badge>
        );
      case INTERVIEW_SLOT_STATUS.CANCELLED:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  // Format time for display
  const formatSlotTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  return (
    <div className="space-y-6">
      <AvailableSlotHeader
        onCreateNew={() => {
          setSelectedDate(new Date());
          setIsCreateModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AvailableSlotCalendarCard
          currentMonth={currentMonth}
          onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
          onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
          weekDays={weekDays}
          startDayOfWeek={startDayOfWeek}
          daysInMonth={daysInMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          dateHasSlots={dateHasSlots}
          slotsForSelectedDate={
            selectedDate ? getSlotsForDate(selectedDate) : []
          }
          onOpenCreateForSelectedDate={() => setIsCreateModalOpen(true)}
          formatSlotTime={formatSlotTime}
          getStatusBadge={getStatusBadge}
        />
        <AvailableSlotTableCard
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          isLoading={isLoading}
          isFetching={isFetching}
          slots={slotsData?.data || []}
          pagination={slotsData?.pagination}
          page={page}
          onPageChange={setPage}
          onCompleteSlot={handleCompleteSlot}
          onOpenCancel={(slot) => {
            setSelectedSlot(slot);
            setIsCancelModalOpen(true);
          }}
          onOpenDelete={(slot) => {
            setSlotToDelete(slot);
            setIsDeleteModalOpen(true);
          }}
          isCompleting={isCompleting}
          isDeleting={isDeleting}
          formatSlotTime={formatSlotTime}
          getStatusBadge={getStatusBadge}
        />
      </div>

      <CreateSlotDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        timeSlots={timeSlots}
        selectedHours={selectedHours}
        onToggleHourSelection={toggleHourSelection}
        onResetForm={resetForm}
        onCreate={handleCreateSlot}
        isCreating={isCreating}
      />
      <CancelSlotDialog
        open={isCancelModalOpen}
        onOpenChange={(open) => {
          setIsCancelModalOpen(open);
          if (!open) {
            setSelectedSlot(null);
            setCancellationReason("");
          }
        }}
        selectedSlot={selectedSlot}
        cancellationReason={cancellationReason}
        onCancellationReasonChange={setCancellationReason}
        onCancelSlot={handleCancelSlot}
        isCancelling={isCancelling}
        formatSlotTime={formatSlotTime}
      />
      <DeleteSlotDialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setSlotToDelete(null);
        }}
        slotToDelete={slotToDelete}
        onDelete={handleDeleteSlot}
        isDeleting={isDeleting}
        formatSlotTime={formatSlotTime}
      />
    </div>
  );
};

export default AvailableSlots;
