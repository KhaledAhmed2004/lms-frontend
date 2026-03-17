import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type EditTutorPersonalFormProps = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onAddressChange: (value: string) => void;
};

export default function EditTutorPersonalForm({
  fullName,
  email,
  phone,
  birthDate,
  address,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onBirthDateChange,
  onAddressChange,
}: EditTutorPersonalFormProps) {
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
              Birth Date
            </label>
            <Input
              type="date"
              value={birthDate ? birthDate.split("T")[0] : ""}
              onChange={(e) => onBirthDateChange(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Address
          </label>
          <Input
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
