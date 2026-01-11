import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useActiveSubjects, useActiveGrades, useActiveSchoolTypes } from "@/hooks/api";

interface Step1Props {
  formData: any;
  setFormData: (data: any) => void;
}

export const Step1SubjectInfo = ({ formData, setFormData }: Step1Props) => {
  // Fetch data from backend API
  const { data: subjects = [], isLoading: subjectsLoading } = useActiveSubjects();
  const { data: grades = [], isLoading: gradesLoading } = useActiveGrades();
  const { data: schoolTypes = [], isLoading: schoolTypesLoading } = useActiveSchoolTypes();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.subject}
          onValueChange={(value) =>
            setFormData({ ...formData, subject: value })
          }
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Select your Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjectsLoading ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                Loading...
              </div>
            ) : subjects.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                No subjects available
              </div>
            ) : (
              subjects.map((subject) => (
                <SelectItem key={subject._id} value={subject._id}>
                  {subject.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grade <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.grade}
          onValueChange={(value) => setFormData({ ...formData, grade: value })}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Select your Grade" />
          </SelectTrigger>
          <SelectContent>
            {gradesLoading ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                Loading...
              </div>
            ) : grades.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                No grades available
              </div>
            ) : (
              grades.map((grade) => (
                <SelectItem key={grade._id} value={grade.name}>
                  {grade.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School Type <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.schoolType}
          onValueChange={(value) =>
            setFormData({ ...formData, schoolType: value })
          }
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Select your School Type" />
          </SelectTrigger>
          <SelectContent>
            {schoolTypesLoading ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                Loading...
              </div>
            ) : schoolTypes.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                No school types available
              </div>
            ) : (
              schoolTypes.map((schoolType) => (
                <SelectItem key={schoolType._id} value={schoolType.name}>
                  {schoolType.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
