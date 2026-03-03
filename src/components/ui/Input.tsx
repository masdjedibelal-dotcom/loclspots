import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-forest"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={cn(
            "w-full rounded-lg border-2 bg-cream px-3 py-2.5 text-forest placeholder:text-sage/60 transition-colors focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-peach focus:border-peach focus:ring-peach/50"
              : "border-warm focus:border-sage",
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-peach"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-sage">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
