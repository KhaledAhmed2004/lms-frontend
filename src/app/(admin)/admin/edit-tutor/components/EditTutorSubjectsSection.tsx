import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export type SubjectItem = {
  _id: string;
  name: string;
};

type EditTutorSubjectsSectionProps = {
  selectedSubjects: SubjectItem[];
  unselectedSubjects: SubjectItem[];
  selectedSubjectId: string;
  onSelectSubject: (value: string) => void;
  onAddSubject: () => void;
  onRemoveSubject: (subjectId: string) => void;
};

export default function EditTutorSubjectsSection({
  selectedSubjects,
  unselectedSubjects,
  selectedSubjectId,
  onSelectSubject,
  onAddSubject,
  onRemoveSubject,
}: EditTutorSubjectsSectionProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Teaching Preferences</CardTitle>
        <CardDescription>Subjects the tutor teaches</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.map((subject) => (
            <Badge
              key={subject._id}
              className="bg-blue-100 text-blue-800 border-0 font-medium flex items-center gap-2 px-3 py-1"
            >
              {subject.name}
              <button
                onClick={() => onRemoveSubject(subject._id)}
                className="ml-1 hover:opacity-70"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
          {selectedSubjects.length === 0 && (
            <p className="text-gray-500 text-sm">No subjects selected</p>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={selectedSubjectId} onValueChange={onSelectSubject}>
            <SelectTrigger className="w-[300px] bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select a subject to add" />
            </SelectTrigger>
            <SelectContent>
              {unselectedSubjects.map((subject) => (
                <SelectItem key={subject._id} value={subject._id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={onAddSubject}
            disabled={!selectedSubjectId}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
