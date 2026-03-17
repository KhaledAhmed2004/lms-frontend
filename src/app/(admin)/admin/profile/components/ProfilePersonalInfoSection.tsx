import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit, X } from "lucide-react";

type ProfileFormData = {
  name: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  street: string;
  number: string;
  zip: string;
  city: string;
};

type ProfilePersonalInfoSectionProps = {
  isEditing: boolean;
  formData: ProfileFormData;
  tempFormData: ProfileFormData;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onInputChange: (field: keyof ProfileFormData, value: string) => void;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium text-gray-900 mt-1">{value}</p>
    </div>
  );
}

export default function ProfilePersonalInfoSection({
  isEditing,
  formData,
  tempFormData,
  onEdit,
  onCancel,
  onSave,
  onInputChange,
}: ProfilePersonalInfoSectionProps) {
  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Personal Information
        </h2>
        {!isEditing ? (
          <Button
            onClick={onEdit}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
          <InfoRow label="Full Name" value={formData.name} />
          <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
          <InfoRow label="Email Address" value={formData.email} />
          <InfoRow label="Phone Number" value={formData.phoneNumber} />
          <InfoRow
            label="Address"
            value={`${formData.street} ${formData.number}`}
          />
          <InfoRow label="City" value={`${formData.zip} ${formData.city}`} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <Input
                value={tempFormData.dateOfBirth}
                onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                value={tempFormData.phoneNumber}
                onChange={(e) => onInputChange("phoneNumber", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={tempFormData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street
              </label>
              <Input
                value={tempFormData.street}
                onChange={(e) => onInputChange("street", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Number
              </label>
              <Input
                value={tempFormData.number}
                onChange={(e) => onInputChange("number", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <Input
                value={tempFormData.zip}
                onChange={(e) => onInputChange("zip", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <Input
                value={tempFormData.city}
                onChange={(e) => onInputChange("city", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
