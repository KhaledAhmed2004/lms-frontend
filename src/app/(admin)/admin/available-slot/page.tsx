'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, X, Calendar, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  useInterviewSlots,
  useCreateInterviewSlot,
  useDeleteInterviewSlot,
  useCompleteInterviewSlot,
  useCancelInterviewSlot,
  INTERVIEW_SLOT_STATUS,
  InterviewSlot,
} from '@/hooks/api';
import { ApiError } from '@/lib/api-client';

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
  const [cancellationReason, setCancellationReason] = useState('');

  // Create slot form state - selectedHours is an array of starting hours (0-23) for multi-select
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  // Generate 24 hourly time slots for dropdown
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const startHour = i;
    const endHour = (i + 1) % 24;
    const formatHour = (hour: number) => {
      if (hour === 0) return '12:00 AM';
      if (hour === 12) return '12:00 PM';
      if (hour < 12) return `${hour}:00 AM`;
      return `${hour - 12}:00 PM`;
    };
    return {
      value: String(i),
      label: `${formatHour(startHour)} - ${formatHour(endHour)}`,
    };
  });

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // API Hooks
  const { data: slotsData, isLoading, isFetching, refetch } = useInterviewSlots({
    page,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const { mutate: createSlot, isPending: isCreating } = useCreateInterviewSlot();
  const { mutate: deleteSlot, isPending: isDeleting } = useDeleteInterviewSlot();
  const { mutate: completeSlot, isPending: isCompleting } = useCompleteInterviewSlot();
  const { mutate: cancelSlot, isPending: isCancelling } = useCancelInterviewSlot();

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday, 6 = Saturday)
  const startDayOfWeek = monthStart.getDay();

  // Week days starting from Sunday
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour]
    );
  };

  // Handle create slot - creates multiple slots if multiple hours selected
  const handleCreateSlot = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (selectedHours.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }

    // Sort hours for consistent creation order
    const sortedHours = [...selectedHours].sort((a, b) => parseInt(a) - parseInt(b));

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
              const errorMessage = error instanceof ApiError
                ? error.getFullMessage()
                : 'Failed to create slot';
              toast.error(`Failed to create slot at ${timeSlots[hour].label}: ${errorMessage}`);
              resolve();
            },
          }
        );
      });
    }

    if (successCount > 0) {
      toast.success(`${successCount} interview slot${successCount > 1 ? 's' : ''} created successfully`);
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
        toast.success('Slot deleted successfully');
        setIsDeleteModalOpen(false);
        setSlotToDelete(null);
        refetch();
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof ApiError
          ? error.getFullMessage()
          : 'Failed to delete slot';
        toast.error(errorMessage);
      },
    });
  };

  // Handle complete slot
  const handleCompleteSlot = (slotId: string) => {
    completeSlot(slotId, {
      onSuccess: () => {
        toast.success('Interview marked as completed');
        refetch();
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof ApiError
          ? error.getFullMessage()
          : 'Failed to complete slot';
        toast.error(errorMessage);
      },
    });
  };

  // Handle cancel slot
  const handleCancelSlot = () => {
    if (!selectedSlot || !cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    cancelSlot(
      { id: selectedSlot._id, cancellationReason },
      {
        onSuccess: () => {
          toast.success('Slot cancelled successfully');
          setIsCancelModalOpen(false);
          setSelectedSlot(null);
          setCancellationReason('');
          refetch();
        },
        onError: (error: unknown) => {
          const errorMessage = error instanceof ApiError
            ? error.getFullMessage()
            : 'Failed to cancel slot';
          toast.error(errorMessage);
        },
      }
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
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case INTERVIEW_SLOT_STATUS.BOOKED:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Booked</Badge>;
      case INTERVIEW_SLOT_STATUS.COMPLETED:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Completed</Badge>;
      case INTERVIEW_SLOT_STATUS.CANCELLED:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  // Format time for display
  const formatSlotTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Slots</h1>
          <p className="text-sm text-gray-500">Manage available interview slots for tutor applications</p>
        </div>
        <Button
          onClick={() => {
            setSelectedDate(new Date());
            setIsCreateModalOpen(true);
          }}
          className="bg-[#0B31BD] hover:bg-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month start */}
              {Array.from({ length: startDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="py-2" />
              ))}

              {/* Days of month */}
              {daysInMonth.map((day) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const hasSlots = dateHasSlots(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative py-2 text-sm font-medium rounded-full transition-colors
                      ${isSelected ? 'bg-[#0B31BD] text-white' : ''}
                      ${!isSelected && isToday ? 'bg-gray-100' : ''}
                      ${!isSelected && !isToday ? 'hover:bg-gray-50' : ''}
                    `}
                  >
                    {format(day, 'd')}
                    {hasSlots && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#0B31BD] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick create for selected date */}
            {selectedDate && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {format(selectedDate, 'EEEE, MMM d, yyyy')}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#0B31BD] hover:bg-blue-800"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Slot
                  </Button>
                </div>

                {/* Slots for selected date */}
                <div className="mt-3 space-y-2">
                  {getSlotsForDate(selectedDate).map((slot) => (
                    <div
                      key={slot._id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{formatSlotTime(slot.startTime, slot.endTime)}</span>
                      </div>
                      {getStatusBadge(slot.status)}
                    </div>
                  ))}
                  {getSlotsForDate(selectedDate).length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">
                      No slots for this date
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slots Table Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">All Interview Slots</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={INTERVIEW_SLOT_STATUS.AVAILABLE}>Available</SelectItem>
                  <SelectItem value={INTERVIEW_SLOT_STATUS.BOOKED}>Booked</SelectItem>
                  <SelectItem value={INTERVIEW_SLOT_STATUS.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={INTERVIEW_SLOT_STATUS.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Skeleton loader for table
              <div className="space-y-3">
                {/* Table header skeleton */}
                <div className="flex items-center gap-4 py-3 border-b">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                </div>
                {/* Table rows skeleton */}
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
              <div className={isFetching ? 'opacity-50 pointer-events-none' : ''}>
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
                    {slotsData?.data && slotsData.data.length > 0 ? (
                      slotsData.data.map((slot) => (
                        <TableRow key={slot._id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {format(new Date(slot.startTime), 'MMM d, yyyy')}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatSlotTime(slot.startTime, slot.endTime)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {slot.applicantId ? (
                              <div className="flex flex-col">
                                <span className="font-medium">{slot.applicantId.name}</span>
                                <span className="text-sm text-gray-500">{slot.applicantId.email}</span>
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
                                        onClick={() => handleCompleteSlot(slot._id)}
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
                                        onClick={() => {
                                          setSelectedSlot(slot);
                                          setIsCancelModalOpen(true);
                                        }}
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
                                {slot.status === INTERVIEW_SLOT_STATUS.AVAILABLE && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                          setSlotToDelete(slot);
                                          setIsDeleteModalOpen(true);
                                        }}
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
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No interview slots found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {slotsData?.meta && slotsData.meta.totalPage > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      Showing {((slotsData.meta.page - 1) * slotsData.meta.limit) + 1} - {Math.min(slotsData.meta.page * slotsData.meta.limit, slotsData.meta.total)} of {slotsData.meta.total} slots
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || isFetching}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {(() => {
                          const totalPages = slotsData.meta.totalPage;
                          const currentPage = page;
                          const pages: (number | string)[] = [];

                          if (totalPages <= 5) {
                            for (let i = 1; i <= totalPages; i++) pages.push(i);
                          } else {
                            if (currentPage <= 3) {
                              pages.push(1, 2, 3, '...', totalPages);
                            } else if (currentPage >= totalPages - 2) {
                              pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                            } else {
                              pages.push(1, '...', currentPage, '...', totalPages);
                            }
                          }

                          return pages.map((p, idx) => (
                            p === '...' ? (
                              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                            ) : (
                              <Button
                                key={p}
                                variant={page === p ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPage(p as number)}
                                disabled={isFetching}
                                className={`px-3 min-w-[36px] ${page === p ? 'bg-[#0B31BD] hover:bg-blue-800' : ''}`}
                              >
                                {p}
                              </Button>
                            )
                          ));
                        })()}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= slotsData.meta.totalPage || isFetching}
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
      </div>

      {/* Create Slot Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0B31BD]" />
              Create Interview Slot
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-5">
              {/* Date Display */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Select Date</Label>
                <Input
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="mt-1.5"
                />
              </div>

              {/* Time Slot Selection - Grid Layout (Multi-Select) */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Select Time Slots (1 Hour Each)</Label>
                  {selectedHours.length > 0 && (
                    <span className="text-xs text-[#0B31BD] font-medium">
                      {selectedHours.length} slot{selectedHours.length > 1 ? 's' : ''} selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 mb-3">Click to select multiple time slots</p>

                {/* Night/Early Morning Slots (12 AM - 6 AM) */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Night / Early Morning (12 AM - 6 AM)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.slice(0, 6).map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => toggleHourSelection(slot.value)}
                        className={`
                          px-3 py-2.5 text-xs font-medium rounded-lg border transition-all
                          ${selectedHours.includes(slot.value)
                            ? 'bg-[#0B31BD] text-white border-[#0B31BD] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#0B31BD] hover:bg-blue-50'
                          }
                        `}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Morning Slots (6 AM - 12 PM) */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    Morning (6 AM - 12 PM)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.slice(6, 12).map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => toggleHourSelection(slot.value)}
                        className={`
                          px-3 py-2.5 text-xs font-medium rounded-lg border transition-all
                          ${selectedHours.includes(slot.value)
                            ? 'bg-[#0B31BD] text-white border-[#0B31BD] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#0B31BD] hover:bg-blue-50'
                          }
                        `}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon Slots (12 PM - 6 PM) */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    Afternoon (12 PM - 6 PM)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.slice(12, 18).map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => toggleHourSelection(slot.value)}
                        className={`
                          px-3 py-2.5 text-xs font-medium rounded-lg border transition-all
                          ${selectedHours.includes(slot.value)
                            ? 'bg-[#0B31BD] text-white border-[#0B31BD] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#0B31BD] hover:bg-blue-50'
                          }
                        `}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Evening Slots (6 PM - 12 AM) */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    Evening (6 PM - 12 AM)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.slice(18, 24).map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => toggleHourSelection(slot.value)}
                        className={`
                          px-3 py-2.5 text-xs font-medium rounded-lg border transition-all
                          ${selectedHours.includes(slot.value)
                            ? 'bg-[#0B31BD] text-white border-[#0B31BD] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#0B31BD] hover:bg-blue-50'
                          }
                        `}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSlot}
              disabled={isCreating || selectedHours.length === 0}
              className="bg-[#0B31BD] hover:bg-blue-800"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                `Create ${selectedHours.length > 1 ? `${selectedHours.length} Slots` : 'Slot'}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Slot Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Interview Slot</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel this interview slot? This action cannot be undone.
            </p>

            {selectedSlot && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {format(new Date(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500">
                  {formatSlotTime(selectedSlot.startTime, selectedSlot.endTime)}
                </p>
                {selectedSlot.applicantId && (
                  <p className="text-sm text-gray-500 mt-1">
                    Booked by: {selectedSlot.applicantId.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label>Cancellation Reason</Label>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelModalOpen(false);
                setSelectedSlot(null);
                setCancellationReason('');
              }}
            >
              Keep Slot
            </Button>
            <Button
              onClick={handleCancelSlot}
              disabled={isCancelling || !cancellationReason.trim()}
              variant="destructive"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Slot'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Slot Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview Slot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this interview slot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {slotToDelete && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">
                {format(new Date(slotToDelete.startTime), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-500">
                {formatSlotTime(slotToDelete.startTime, slotToDelete.endTime)}
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSlotToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSlot}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Slot'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AvailableSlots;