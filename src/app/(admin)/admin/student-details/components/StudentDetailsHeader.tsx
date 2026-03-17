import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Star } from "lucide-react";

type StudentDetailsHeaderProps = {
  status: string;
  isSpecialStudent?: boolean;
  onBack: () => void;
  onEdit: () => void;
};

const getStatusColor = (status: string) => {
  return status === "ACTIVE"
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
};

const getStatusLabel = (status: string) => {
  return status === "ACTIVE" ? "Active" : "Blocked";
};

export default function StudentDetailsHeader({
  status,
  isSpecialStudent,
  onBack,
  onEdit,
}: StudentDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft size={16} />
        Back
      </Button>
      <div className="flex items-center gap-3">
        <Badge
          className={`${getStatusColor(status)} border-0 text-sm px-3 py-1`}
        >
          {getStatusLabel(status)}
        </Badge>
        {isSpecialStudent && (
          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm px-3 py-1">
            <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
            Special (€25/hr)
          </Badge>
        )}
        <Button variant="outline" onClick={onEdit} className="gap-2">
          <Edit size={16} />
          Edit
        </Button>
      </div>
    </div>
  );
}
