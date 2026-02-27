import { Spinner } from "@/components/ui/spinner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormNavigationButtons = ({
  step,
  onNext,
  onBack,
  isLastStep = false,
  isLoading = false,
  isDisabled = false,
}: any) => {
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
            <Spinner className="size-5 text-white" />
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