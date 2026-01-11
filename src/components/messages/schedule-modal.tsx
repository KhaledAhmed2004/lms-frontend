/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (selectedDate: Date, time: string) => void;
}

// ============================================
// 🧪 TEST MODE CONFIGURATION
// ============================================
// Set to true for testing - shows 5 minute intervals
// Set to false for production - shows hourly intervals
const TEST_MODE = true;
// ============================================

// Generate time options based on mode
const generateTimeOptions = () => {
  const options: string[] = [];
  const interval = TEST_MODE ? 5 : 60; // 5 min or 1 hour

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour < 12 ? 'AM' : 'PM';
      const hourStr = hour12.toString().padStart(2, '0');
      const minStr = minute.toString().padStart(2, '0');
      options.push(`${hourStr}:${minStr} ${period}`);
    }
  }
  return options;
};

export default function ScheduleModal({
  isOpen,
  onClose,
  onSchedule,
}: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeOptions = generateTimeOptions();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
  };

  const handleSchedule = () => {
    if (selectedDate) {
      onSchedule(selectedDate, selectedTime);
      onClose();
    }
  };

  if (!isOpen) return null;

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null);
  const nextMonthDays = Array.from(
    {
      length:
        (emptyDays.length + daysInMonth) % 7 === 0
          ? 0
          : 7 - ((emptyDays.length + daysInMonth) % 7),
    },
    (_, i) => i + 1
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-lg w-full max-w-md p-6 border border-border">
        {/* Select Date */}
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Select Date
        </h3>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-background rounded"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h4 className="text-sm font-semibold text-foreground">{monthName}</h4>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-background rounded"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
          {emptyDays.map((_, i) => (
            <div
              key={`empty-${i}`}
              className="text-center text-xs text-muted-foreground py-2"
            >
              {/* Empty cells for days before month starts */}
            </div>
          ))}
          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`text-center text-sm py-2 rounded font-medium transition-colors ${
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentMonth.getMonth()
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-background"
              }`}
            >
              {day}
            </button>
          ))}
          {nextMonthDays.map((day) => (
            <div
              key={`next-${day}`}
              className="text-center text-xs text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Select Time */}
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Select Time
        </h3>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent mb-4"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        {/* Selected Schedule Summary */}
        {selectedDate && (
          <div className="bg-background rounded-lg p-3 mb-4 border border-border">
            <p className="text-xs text-muted-foreground">
              Selected Schedule: {selectedDate.toLocaleDateString("en-DE")}
            </p>
            <p className="text-sm font-medium text-foreground">
              {selectedTime}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}
