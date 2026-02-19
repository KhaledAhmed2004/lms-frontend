/* eslint-disable @typescript-eslint/no-explicit-any */
// components/free-trial/steps/Step3PersonalInfo.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface Step3Props {
  formData: any;
  setFormData: (data: any) => void;
}

export const Step3PersonalInfo = ({ formData, setFormData }: Step3Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name (Student) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="studentFirstName"
            value={formData.studentFirstName}
            onChange={(e) =>
              setFormData({ ...formData, studentFirstName: e.target.value })
            }
            placeholder="Enter your First Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name (Student) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="studentLastName"
            value={formData.studentLastName}
            onChange={(e) =>
              setFormData({ ...formData, studentLastName: e.target.value })
            }
            placeholder="Enter your Last Name"
          />
        </div>
      </div>

      <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Is the student under 18 years of age? <span className="text-red-500">*</span>
  </label>

  <div className="flex gap-6">
    {/* YES → Under 18 */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="ageCheck"
        checked={formData.isUnder18 === true}
        onChange={() =>
          setFormData({ ...formData, isUnder18: true })
        }
      />
      <span className="text-sm text-gray-700">Yes</span>
    </label>

    {/* NO → 18 or above */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="ageCheck"
        checked={formData.isUnder18 === false}
        onChange={() =>
          setFormData({ ...formData, isUnder18: false })
        }
      />
      <span className="text-sm text-gray-700">No</span>
    </label>
  </div>
</div>


      {formData.isUnder18 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name (Legal Guardian){" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="guardianFirstName"
                value={formData.guardianFirstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guardianFirstName: e.target.value,
                  })
                }
                placeholder="Enter guardian first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name (Legal Guardian){" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="guardianLastName"
                value={formData.guardianLastName}
                onChange={(e) =>
                  setFormData({ ...formData, guardianLastName: e.target.value })
                }
                placeholder="Enter guardian last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone (Legal Guardian) <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              name="guardianPhone"
              value={formData.guardianPhone}
              onChange={(e) =>
                setFormData({ ...formData, guardianPhone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          E-Mail <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your E-mail"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Enter your Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-start">
        <Checkbox
          checked={formData.agreeToPolicy}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, agreeToPolicy: checked })
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
          </Link>{" "}
          <span className="text-red-500">*</span>
        </label>
      </div>
    </div>
  );
};
