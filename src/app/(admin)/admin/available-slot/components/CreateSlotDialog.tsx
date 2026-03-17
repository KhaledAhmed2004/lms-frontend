import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Calendar, Loader2 } from "lucide-react";

type CreateSlotDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onSelectedDateChange: (value: Date) => void;
  timeSlots: Array<{ value: string; label: string }>;
  selectedHours: string[];
  onToggleHourSelection: (hour: string) => void;
  onResetForm: () => void;
  onCreate: () => void;
  isCreating: boolean;
};

function HourSection({
  title,
  dotClassName,
  slots,
  selectedHours,
  onToggleHourSelection,
}: {
  title: string;
  dotClassName: string;
  slots: Array<{ value: string; label: string }>;
  selectedHours: string[];
  onToggleHourSelection: (hour: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${dotClassName}`}></span>
        {title}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.value}
            type="button"
            onClick={() => onToggleHourSelection(slot.value)}
            className={`
              px-3 py-2.5 text-xs font-medium rounded-lg border transition-all
              ${
                selectedHours.includes(slot.value)
                  ? "bg-[#0B31BD] text-white border-[#0B31BD] shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#0B31BD] hover:bg-blue-50"
              }
            `}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CreateSlotDialog({
  open,
  onOpenChange,
  selectedDate,
  onSelectedDateChange,
  timeSlots,
  selectedHours,
  onToggleHourSelection,
  onResetForm,
  onCreate,
  isCreating,
}: CreateSlotDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0B31BD]" />
            Create Interview Slot
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Select Date
              </Label>
              <Input
                type="date"
                value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                onChange={(e) => onSelectedDateChange(new Date(e.target.value))}
                className="mt-1.5"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Select Time Slots (1 Hour Each)
                </Label>
                {selectedHours.length > 0 && (
                  <span className="text-xs text-[#0B31BD] font-medium">
                    {selectedHours.length} slot
                    {selectedHours.length > 1 ? "s" : ""} selected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 mb-3">
                Click to select multiple time slots
              </p>

              <HourSection
                title="Night / Early Morning (12 AM - 6 AM)"
                dotClassName="bg-indigo-400"
                slots={timeSlots.slice(0, 6)}
                selectedHours={selectedHours}
                onToggleHourSelection={onToggleHourSelection}
              />
              <HourSection
                title="Morning (6 AM - 12 PM)"
                dotClassName="bg-yellow-400"
                slots={timeSlots.slice(6, 12)}
                selectedHours={selectedHours}
                onToggleHourSelection={onToggleHourSelection}
              />
              <HourSection
                title="Afternoon (12 PM - 6 PM)"
                dotClassName="bg-orange-400"
                slots={timeSlots.slice(12, 18)}
                selectedHours={selectedHours}
                onToggleHourSelection={onToggleHourSelection}
              />
              <HourSection
                title="Evening (6 PM - 12 AM)"
                dotClassName="bg-purple-400"
                slots={timeSlots.slice(18, 24)}
                selectedHours={selectedHours}
                onToggleHourSelection={onToggleHourSelection}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onResetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onCreate}
            disabled={isCreating || selectedHours.length === 0}
            className="bg-[#0B31BD] hover:bg-blue-800"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              `Create ${selectedHours.length > 1 ? `${selectedHours.length} Slots` : "Slot"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
