import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InterviewSlot } from "@/hooks/api";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";

type AvailableSlotCalendarCardProps = {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  weekDays: string[];
  startDayOfWeek: number;
  daysInMonth: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  dateHasSlots: (date: Date) => boolean;
  slotsForSelectedDate: InterviewSlot[];
  onOpenCreateForSelectedDate: () => void;
  formatSlotTime: (start: string, end: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
};

export default function AvailableSlotCalendarCard({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  weekDays,
  startDayOfWeek,
  daysInMonth,
  selectedDate,
  onSelectDate,
  dateHasSlots,
  slotsForSelectedDate,
  onOpenCreateForSelectedDate,
  formatSlotTime,
  getStatusBadge,
}: AvailableSlotCalendarCardProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onPrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button variant="ghost" size="icon" onClick={onNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="py-2" />
          ))}

          {daysInMonth.map((day) => {
            const isSelected =
              !!selectedDate &&
              day.toDateString() === selectedDate.toDateString();
            const hasSlots = dateHasSlots(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <button
                key={day.toISOString()}
                onClick={() => onSelectDate(day)}
                className={`
                  relative py-2 text-sm font-medium rounded-full transition-colors
                  ${isSelected ? "bg-[#0B31BD] text-white" : ""}
                  ${!isSelected && isToday ? "bg-gray-100" : ""}
                  ${!isSelected && !isToday ? "hover:bg-gray-50" : ""}
                `}
              >
                {format(day, "d")}
                {hasSlots && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#0B31BD] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {format(selectedDate, "EEEE, MMM d, yyyy")}
              </span>
              <Button
                size="sm"
                onClick={onOpenCreateForSelectedDate}
                className="bg-[#0B31BD] hover:bg-blue-800"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Slot
              </Button>
            </div>

            <div className="mt-3 space-y-2">
              {slotsForSelectedDate.map((slot) => (
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
              {slotsForSelectedDate.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">
                  No slots for this date
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
