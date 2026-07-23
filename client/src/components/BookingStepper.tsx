import { Check } from "lucide-react";

type Step = { number: number; label: string };

const steps: Step[] = [
  { number: 1, label: "Department" },
  { number: 2, label: "Doctor" },
  { number: 3, label: "Date & Time" },
  { number: 4, label: "Confirm" },
];

function BookingStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((step, index) => {
        const isComplete = step.number < currentStep;
        const isCurrent = step.number === currentStep;

        return (
          <div
            key={step.number}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                  isComplete
                    ? "bg-blue-600 text-white"
                    : isCurrent
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                }`}
              >
                {isComplete ? <Check size={16} /> : step.number}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isCurrent || isComplete
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-3 ${
                  isComplete ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BookingStepper;
