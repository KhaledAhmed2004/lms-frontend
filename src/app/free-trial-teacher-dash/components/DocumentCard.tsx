import { useRef } from "react";
import { FileText, Check, Upload, X } from "lucide-react";

export const DocumentCard = ({
  label,
  file,
  documentUrl,
  isEditing,
  onSelect,
  onRemove,
}: {
  label: string;
  file?: File;
  documentUrl: string;
  isEditing: boolean;
  onSelect: (file: File | null) => void;
  onRemove: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isEditing) {
    return (
      <a
        href={documentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <FileText className="w-8 h-8 text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700">{label}</p>
      </a>
    );
  }

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,image/*"
        onChange={(e) => onSelect(e.target.files?.[0] || null)}
      />
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          file
            ? "border-green-400 bg-green-50"
            : "border-gray-300 bg-gray-50 hover:border-[#0B31BD] hover:bg-blue-50"
        }`}
      >
        {file ? (
          <>
            <div className="relative w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
              <Check className="w-8 h-8 text-green-500 mb-2 mx-auto" />
            </div>
            <p className="text-xs text-gray-600 text-center truncate w-full">
              {file.name}
            </p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500 mt-1">Click to upload</p>
          </>
        )}
      </div>
    </>
  );
};
