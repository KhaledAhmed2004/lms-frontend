import { Button } from "@/components/ui/button";
import { Edit, Loader2, Star } from "lucide-react";

type StudentDetailsActionsProps = {
  status: string;
  isSpecialStudent?: boolean;
  isActionPending: boolean;
  isBlocking: boolean;
  isUnblocking: boolean;
  isTogglingSpecial: boolean;
  onEdit: () => void;
  onToggleSpecial: () => void;
  onBlock: () => void;
  onUnblock: () => void;
};

export default function StudentDetailsActions({
  status,
  isSpecialStudent,
  isActionPending,
  isBlocking,
  isUnblocking,
  isTogglingSpecial,
  onEdit,
  onToggleSpecial,
  onBlock,
  onUnblock,
}: StudentDetailsActionsProps) {
  return (
    <div className="flex justify-center gap-4">
      <Button
        variant="outline"
        onClick={onEdit}
        className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>
      <Button
        onClick={onToggleSpecial}
        disabled={isActionPending}
        variant="outline"
        className={
          isSpecialStudent
            ? "border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-8"
            : "border-yellow-400 text-yellow-600 hover:bg-yellow-50 px-8"
        }
      >
        {isTogglingSpecial ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Star
            className={`mr-2 h-4 w-4 ${isSpecialStudent ? "fill-yellow-500 text-yellow-500" : ""}`}
          />
        )}
        {isSpecialStudent ? "Remove Special" : "Mark as Special"}
      </Button>
      {status === "ACTIVE" ? (
        <Button
          onClick={onBlock}
          disabled={isActionPending}
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-50 px-8"
        >
          {isBlocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Block Student
        </Button>
      ) : (
        <Button
          onClick={onUnblock}
          disabled={isActionPending}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isUnblocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Unblock Student
        </Button>
      )}
    </div>
  );
}
