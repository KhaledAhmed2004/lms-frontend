import { Loader2, CalendarIcon } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Link from "next/link";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PasswordField } from "@/components/form/PasswordField";

const INPUT_CLASS =
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  birthDate: Date | undefined;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
  agreeToPolicy: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PersonalInfoStep = ({
  formData,
  setFormData,
  handleInputChange,
  stepComplete,
  isPending,
  onBack,
  onSubmit,
}: {
  formData: PersonalInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stepComplete: boolean;
  isPending: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) => (
  <div className="space-y-6">
    <label className="block text-base font-semibold text-[#0B31BD] mb-4">
      Submit personal information and login credentials!
    </label>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
          className={INPUT_CLASS}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
          className={INPUT_CLASS}
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Birth Date <span className="text-red-500">*</span>
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex h-10 w-full justify-start rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-normal hover:bg-white",
              !formData.birthDate && "text-gray-400",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formData.birthDate ? (
              format(formData.birthDate, "dd-MM-yyyy")
            ) : (
              <span>Select your birth date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={formData.birthDate}
            onSelect={(date) =>
              setFormData((prev: any) => ({
                ...prev,
                birthDate: date,
              }))
            }
            disabled={(date) =>
              date > new Date() || date < new Date("1950-01-01")
            }
            captionLayout="dropdown"
            fromYear={1950}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          placeholder="Enter street name"
          className={INPUT_CLASS}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          House Number <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="houseNumber"
          value={formData.houseNumber}
          onChange={handleInputChange}
          placeholder="Enter house number"
          className={INPUT_CLASS}
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ZIP <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="zip"
          value={formData.zip}
          onChange={handleInputChange}
          placeholder="Enter ZIP"
          className={INPUT_CLASS}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Enter your city"
          className={INPUT_CLASS}
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <PhoneInput
          defaultCountry="de"
          value={formData.phoneNumber}
          onChange={(phone) =>
            setFormData((prev: any) => ({
              ...prev,
              phoneNumber: phone,
            }))
          }
          inputClassName="!h-10 !border-0 !bg-transparent !text-sm !outline-none !shadow-none focus:!outline-none focus:!ring-0 focus:!border-0 focus:!shadow-none"
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white text-sm [&_.react-international-phone-country-selector-button]:!border-0 [&_.react-international-phone-country-selector-button]:!bg-transparent [&_.react-international-phone-country-selector-button]:!h-full [&_.react-international-phone-country-selector-button]:!pl-2 [&_.react-international-phone-country-selector-button]:!pr-1 [&_.react-international-phone-input-container]:!border-0 [&_.react-international-phone-input-container]:!m-0 [&_.react-international-phone-country-selector-dropdown]:!z-50"
          placeholder="Enter your phone number"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email <span className="text-red-500">*</span>
      </label>
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter your email"
        className={INPUT_CLASS}
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PasswordField
        label="Password"
        value={formData.password}
        onChange={(value) =>
          setFormData((prev: any) => ({ ...prev, password: value }))
        }
        placeholder="Enter your Password"
        className={`${INPUT_CLASS} pr-10`}
        required
      />
      <PasswordField
        label="Repeat Password"
        value={formData.repeatPassword}
        onChange={(value) =>
          setFormData((prev: any) => ({ ...prev, repeatPassword: value }))
        }
        placeholder="Repeat your password"
        className={`${INPUT_CLASS} pr-10`}
        required
      />
    </div>

    <div className="flex items-start">
      <Checkbox
        name="agreeToPolicy"
        checked={formData.agreeToPolicy}
        onCheckedChange={(value) =>
          setFormData({
            ...formData,
            agreeToPolicy: Boolean(value),
          })
        }
      />
      <label className="ml-2 text-sm text-gray-700">
        I have read and agree to the{" "}
        <Link
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Privacy Policy
        </Link>
      </label>
    </div>

    <div className="flex gap-4">
      <button
        onClick={onBack}
        disabled={isPending}
        className="w-full max-w-md mx-auto border border-[#0B31BD] text-[#0B31BD] py-3 rounded-md font-medium hover:bg-[#0B31BD]/5 transition-colors disabled:opacity-50"
      >
        Back
      </button>
      <button
        onClick={onSubmit}
        disabled={isPending || !stepComplete}
        className={`w-full max-w-md mx-auto py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
          stepComplete && !isPending
            ? "bg-[#0B31BD] text-white hover:bg-[#062183]"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Send Application"
        )}
      </button>
    </div>
  </div>
);
