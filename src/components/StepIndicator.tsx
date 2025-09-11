import React from "react";

interface Props {
  current: number;
}

export function StepIndicator({ current }: Props) {
  const steps = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          {index > 0 && (
            <div
              className={`w-8 h-0.5 mx-2 ${current >= step ? "bg-brand-pink" : "bg-[var(--surface-border)]"}`}
            />
          )}
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-full border text-sm font-medium ${
              current >= step
                ? "bg-brand-pink text-white border-brand-pink"
                : "bg-[var(--surface)] border-[var(--surface-border)]"
            }`}
          >
            {step}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

