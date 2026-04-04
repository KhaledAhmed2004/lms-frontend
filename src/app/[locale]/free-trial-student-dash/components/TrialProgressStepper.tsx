"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const STEPS = ["Tutor Matching request", "Trial Session", "Start Learning"];

const computeProgressWidth = (step: number, screenWidth: number) => {
  if (screenWidth <= 640) {
    return step === 1 ? "22%" : step === 2 ? "55%" : "88%";
  }
  if (screenWidth <= 768) {
    return step === 1 ? "18%" : step === 2 ? "52%" : "86%";
  }
  return step === 1 ? "10%" : step === 2 ? "55%" : "95%";
};

export const TrialProgressStepper = ({
  step,
  showChecks = false,
}: {
  step: number;
  showChecks?: boolean;
}) => {
  const [progressWidth, setProgressWidth] = useState("0%");

  useEffect(() => {
    const update = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 0;
      setProgressWidth(computeProgressWidth(step, w));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [step]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-2.5 left-0 right-0 h-2 rounded-3xl bg-gray-300 z-0" />
        <div
          className="absolute top-2.5 left-0 h-2 rounded-3xl bg-[#0B31BD] z-10 transition-all duration-700 ease-in-out"
          style={{ width: progressWidth }}
        />

        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = step >= stepNum;
          const isCompleted = showChecks && step > stepNum;

          return (
            <div
              key={label}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${
                  isActive ? "bg-[#0B31BD]" : "bg-gray-300"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : null}
              </div>
              <span
                className={`text-sm text-center transition-colors duration-500 ${
                  isActive ? "text-gray-700" : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
