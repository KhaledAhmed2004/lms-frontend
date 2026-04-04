import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useActiveSubjects,
  useActiveGrades,
  useActiveSchoolTypes,
} from "@/hooks/api";

const FormSelect = ({
  label,
  placeholder,
  emptyMessage,
  isLoading,
  items,
  value,
  onValueChange,
  getItemValue,
}: {
  label: string;
  placeholder: string;
  emptyMessage: string;
  isLoading: boolean;
  items: { _id: string; name: string }[];
  value: string;
  onValueChange: (value: string) => void;
  getItemValue?: (item: { _id: string; name: string }) => string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-10 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          items.map((item) => (
            <SelectItem
              key={item._id}
              value={getItemValue ? getItemValue(item) : item._id}
            >
              {item.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SubjectInfoStep = ({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) => {
  const { data: subjects = [], isLoading: subjectsLoading } =
    useActiveSubjects();
  const { data: grades = [], isLoading: gradesLoading } = useActiveGrades();
  const { data: schoolTypes = [], isLoading: schoolTypesLoading } =
    useActiveSchoolTypes();

  return (
    <div className="space-y-6">
      <FormSelect
        label="Subject"
        placeholder="Select your Subject"
        emptyMessage="No subjects available"
        isLoading={subjectsLoading}
        items={subjects}
        value={formData.subject}
        onValueChange={(value) => setFormData({ ...formData, subject: value })}
      />
      <FormSelect
        label="Grade"
        placeholder="Select your Grade"
        emptyMessage="No grades available"
        isLoading={gradesLoading}
        items={grades}
        value={formData.grade}
        onValueChange={(value) => setFormData({ ...formData, grade: value })}
        getItemValue={(item) => item.name}
      />
      <FormSelect
        label="School Type"
        placeholder="Select your School Type"
        emptyMessage="No school types available"
        isLoading={schoolTypesLoading}
        items={schoolTypes}
        value={formData.schoolType}
        onValueChange={(value) =>
          setFormData({ ...formData, schoolType: value })
        }
        getItemValue={(item) => item.name}
      />
    </div>
  );
};
