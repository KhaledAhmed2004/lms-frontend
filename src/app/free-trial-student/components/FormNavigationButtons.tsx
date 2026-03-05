import { Loader2 } from "lucide-react";

export const FormNavigationButtons = ({
  step,
  onNext,
  onBack,
  isLastStep = false,
  isLoading = false,
  isDisabled = false,
}: {
  step: number;
  totalSteps?: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}) => {
  return (
    <div className="flex gap-3">
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          className="w-full border border-[#0B31BD] text-[#0B31BD] py-3 rounded-md font-medium hover:bg-[#0B31BD]/5 transition-colors"
        >
          Back
        </button>
      ) : null}

      <button
        onClick={onNext}
        disabled={isLoading || isDisabled}
        className={`w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
          isDisabled
            ? "bg-gray-300 text-gray-500"
            : "bg-[#0B31BD] text-white hover:bg-[#062183] disabled:opacity-50"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 text-white animate-spin" />
            Submitting...
          </>
        ) : isLastStep ? (
          "Request Trial Session"
        ) : (
          "Next"
        )}
      </button>
    </div>
  );
};