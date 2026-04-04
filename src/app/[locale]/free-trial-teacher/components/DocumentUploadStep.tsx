import { FileUploadCard } from "./FileUploadCard";

export const DocumentUploadStep = ({
  formData,
  onFileChange,
  stepComplete,
  onNext,
  onBack,
}: {
  formData: {
    cv: File | null;
    abiturCertificate: File | null;
    officialId: File | null;
  };
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "cv" | "abiturCertificate" | "officialId",
  ) => void;
  stepComplete: boolean;
  onNext: () => void;
  onBack: () => void;
}) => (
  <div className="space-y-6">
    <label className="block text-base font-semibold text-[#0B31BD] mb-4">
      Submit qualification and identification!
    </label>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FileUploadCard
        label="CV"
        inputId="cv-upload"
        file={formData.cv}
        onFileChange={(e) => onFileChange(e, "cv")}
      />
      <FileUploadCard
        label="Abitur Certificate"
        inputId="abitur-upload"
        file={formData.abiturCertificate}
        onFileChange={(e) => onFileChange(e, "abiturCertificate")}
      />
      <FileUploadCard
        label="Official ID-Document"
        inputId="id-upload"
        file={formData.officialId}
        onFileChange={(e) => onFileChange(e, "officialId")}
      />
    </div>

    <div className="flex gap-4 !mt-10">
      <button
        onClick={onBack}
        className="w-full max-w-md mx-auto border border-[#0B31BD] text-[#0B31BD] py-3 rounded-md font-medium hover:bg-[#0B31BD]/5 transition-colors"
      >
        Back
      </button>
      <button
        onClick={onNext}
        disabled={!stepComplete}
        className={`w-full max-w-md mx-auto py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
          stepComplete
            ? "bg-[#0B31BD] text-white hover:bg-[#062183]"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        Next
      </button>
    </div>
  </div>
);
