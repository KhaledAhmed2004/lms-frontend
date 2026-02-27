// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProgressBar = ({ step, totalSteps }: any) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#0B31BD] transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
