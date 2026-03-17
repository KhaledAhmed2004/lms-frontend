import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type EditTutorHeaderProps = {
  tutorName: string;
  onBack: () => void;
};

export default function EditTutorHeader({
  tutorName,
  onBack,
}: EditTutorHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft size={16} />
        Back
      </Button>
      <h1 className="text-xl font-bold text-gray-700">
        Edit Tutor: {tutorName}
      </h1>
    </div>
  );
}
