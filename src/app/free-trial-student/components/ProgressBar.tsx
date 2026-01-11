// components/free-trial/ProgressBar.tsx
interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export const ProgressBar = ({ step, totalSteps }: ProgressBarProps) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#062183] transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
