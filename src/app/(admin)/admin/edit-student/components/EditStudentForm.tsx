import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type EditStudentFormProps = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onDateOfBirthChange: (value: string) => void;
  onLocationChange: (value: string) => void;
};

export default function EditStudentForm({
  fullName,
  email,
  phone,
  dateOfBirth,
  location,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onDateOfBirthChange,
  onLocationChange,
}: EditStudentFormProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Full Name
            </label>
            <Input
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Phone
            </label>
            <Input
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Date of Birth
            </label>
            <Input
              type="date"
              value={dateOfBirth ? dateOfBirth.split("T")[0] : ""}
              onChange={(e) => onDateOfBirthChange(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
