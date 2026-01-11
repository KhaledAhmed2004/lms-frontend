/* eslint-disable @typescript-eslint/no-explicit-any */
// components/free-trial/steps/Step2GoalsDocuments.tsx
import { Input } from "@/components/ui/input";

interface Step2Props {
  formData: any;
  setFormData: (data: any) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Step2GoalsDocuments = ({
  formData,
  setFormData,
  handleFileChange,
}: Step2Props) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Goals (Optional)
        </label>
        <textarea
          name="learningGoals"
          value={formData.learningGoals}
          onChange={(e) =>
            setFormData({ ...formData, learningGoals: e.target.value })
          }
          placeholder="Enter your learning goals"
          rows={6}
          className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Documents (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-white">
          <Input
            type="file"
            id="file-upload-step2"
            onChange={handleFileChange}
            className="hidden"
            accept=".png,.jpg,.jpeg,.pdf"
          />
          <label
            htmlFor="file-upload-step2"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="w-18 h-18 p-2 bg-[#D8E3FC] rounded-full flex items-center justify-center mb-4">
              <img src="/Vector.svg" alt="Upload" />
            </div>
            <p className="text-gray-700 font-medium mb-1">
              Drag & drop files here or click to browse
            </p>
            <p className="text-gray-500 text-sm">png, jpg, pdf up to 10MB</p>
          </label>
          {formData.documents && (
            <p className="mt-4 text-sm text-green-600">
              File selected: {formData.documents.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
