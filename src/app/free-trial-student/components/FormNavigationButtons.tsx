// components/free-trial/FormNavigationButtons.tsx
interface FormNavigationButtonsProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
  isLastStep?: boolean;
  isLoading?: boolean;
}

export const FormNavigationButtons = ({
  step,
  totalSteps,
  onNext,
  isLastStep = false,
  isLoading = false,
}: FormNavigationButtonsProps) => {
  return (
    <button
      onClick={onNext}
      disabled={isLoading}
      className="w-2/3 mx-auto bg-[#0B31BD] text-white py-3 rounded-md font-medium hover:bg-[#062183] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </>
      ) : (
        isLastStep ? "Send the Request" : "Next Step"
      )}
    </button>
  );
};
