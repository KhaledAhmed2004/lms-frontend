import { Upload } from "lucide-react";

export const FileUploadCard = ({
  label,
  inputId,
  file,
  onFileChange,
}: {
  label: string;
  inputId: string;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-white h-full">
      <input
        type="file"
        id={inputId}
        onChange={onFileChange}
        className="hidden"
        accept=".png,.jpg,.jpeg,.pdf"
      />
      <label
        htmlFor={inputId}
        className="cursor-pointer flex flex-col items-center"
      >
        <div className="w-14 h-14 bg-[#D8E3FC] rounded-full flex items-center justify-center mb-3">
          <Upload className="text-[#0B31BD]" size={26} />
        </div>
        <p className="text-gray-700 font-medium text-sm mb-1">
          Drag & Drop or Click
        </p>
        <p className="text-gray-500 text-xs">Up to 10 MB</p>
      </label>
      {file ? (
        <p className="mt-3 text-xs text-green-600 truncate">{file.name}</p>
      ) : null}
    </div>
  </div>
);
