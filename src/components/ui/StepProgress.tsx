import { cn } from "@/lib/utils";

interface StepProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepProgress({
  steps,
  currentStep,
  className,
}: StepProgressProps) {
  return (
    <div className={cn("mb-8 flex items-center gap-2", className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
              i < currentStep && "bg-forest text-white",
              i === currentStep && "bg-forest text-white ring-2 ring-forest/30",
              i > currentStep && "bg-warm text-sage"
            )}
          >
            {i < currentStep ? "✓" : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn("h-0.5 w-8 shrink-0", i < currentStep ? "bg-forest" : "bg-warm")}
            />
          )}
        </div>
      ))}
    </div>
  );
}
