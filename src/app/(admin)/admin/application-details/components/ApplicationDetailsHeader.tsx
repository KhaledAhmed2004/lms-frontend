import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ApplicationDetailsHeaderProps = {
  statusLabel: string;
  statusClassName: string;
  onBack: () => void;
};

export default function ApplicationDetailsHeader({
  statusLabel,
  statusClassName,
  onBack,
}: ApplicationDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft size={16} />
        Back
      </Button>
      <Badge className={`${statusClassName} border-0 text-sm px-3 py-1`}>
        {statusLabel}
      </Badge>
    </div>
  );
}
