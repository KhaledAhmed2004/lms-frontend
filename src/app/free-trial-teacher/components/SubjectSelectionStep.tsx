import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useActiveSubjects } from "@/hooks/api";
import { cn } from "@/lib/utils";

interface SelectedSubject {
  id: string;
  name: string;
}

export const SubjectSelectionStep = ({
  selectedSubjects,
  setSelectedSubjects,
  stepComplete,
  onNext,
}: {
  selectedSubjects: SelectedSubject[];
  setSelectedSubjects: React.Dispatch<React.SetStateAction<SelectedSubject[]>>;
  stepComplete: boolean;
  onNext: () => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: availableSubjects = [], isLoading: subjectsLoading } =
    useActiveSubjects();

  const filteredSubjects = availableSubjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isSelected = (subjectId: string) =>
    selectedSubjects.some((s) => s.id === subjectId);

  const handleToggle = (subjectId: string, subjectName: string) => {
    setSelectedSubjects((prev) => {
      const exists = prev.find((s) => s.id === subjectId);
      if (exists) return prev.filter((s) => s.id !== subjectId);
      return [...prev, { id: subjectId, name: subjectName }];
    });
  };

  const handleRemove = (subjectId: string) => {
    setSelectedSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-base font-semibold text-[#0B31BD] mb-2">
          What subjects you wanna teach?
        </label>

        {/* Selected Subjects Display */}
        <div
          className="flex h-auto min-h-[40px] w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer flex-wrap"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedSubjects.length === 0 ? (
            <span className="text-gray-400">Select subjects</span>
          ) : (
            selectedSubjects.map((subject) => (
              <span
                key={subject.id}
                className="inline-flex items-center gap-1 bg-[#0B31BD] text-white px-2 py-1 rounded text-sm"
              >
                {subject.name}
                <X
                  size={14}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(subject.id);
                  }}
                />
              </span>
            ))
          )}
          <svg
            className="ml-auto"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="mt-2 border border-gray-300 rounded-md bg-white shadow-lg max-h-64 overflow-y-auto">
            <div className="p-2">
              {subjectsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No subjects found
                </div>
              ) : (
                filteredSubjects.map((subject) => (
                  <div
                    key={subject._id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 cursor-pointer rounded transition-colors",
                      isSelected(subject._id)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50",
                    )}
                    onClick={() =>
                      handleToggle(subject._id, subject.name)
                    }
                  >
                    <span
                      className={cn(
                        "text-sm transition-colors",
                        isSelected(subject._id)
                          ? "text-[#0B31BD] font-semibold"
                          : "text-gray-700",
                      )}
                    >
                      {subject.name}
                    </span>
                    <Checkbox
                      checked={isSelected(subject._id)}
                      onCheckedChange={() =>
                        handleToggle(subject._id, subject.name)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "size-5 rounded border-2 transition-all",
                        isSelected(subject._id)
                          ? "border-[#0B31BD] bg-[#0B31BD] text-white shadow-md"
                          : "border-gray-300",
                      )}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onNext}
          disabled={!stepComplete}
          className={`w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
            stepComplete
              ? "bg-[#0B31BD] text-white hover:bg-[#062183]"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
