"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  createdAt: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DISMISS_MS = 4000;

function ToastProviderImpl({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = crypto.randomUUID();
      const item: ToastItem = {
        id,
        message,
        variant,
        createdAt: Date.now(),
      };
      setToasts((prev) => [...prev, item]);
      setTimeout(() => removeToast(id), DISMISS_MS);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({ toasts, toast, removeToast }),
    [toasts, toast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export { ToastProviderImpl as ToastProvider };

function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;
  const { toasts, removeToast } = context;
  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((item) => (
        <Toast
          key={item.id}
          message={item.message}
          variant={item.variant}
          onDismiss={() => removeToast(item.id)}
        />
      ))}
    </div>
  );
}

function Toast({
  message,
  variant,
  onDismiss,
}: {
  message: string;
  variant: ToastVariant;
  onDismiss: () => void;
}) {
  const variantStyles = {
    success: "border-sage bg-sage/20 text-forest",
    error: "border-peach bg-peach/20 text-peach",
    info: "border-peach/60 bg-peach/10 text-forest",
  };

  return (
    <div
      role="alert"
      className={`
        animate-slide-in-right
        flex items-center gap-3 rounded-lg border-2 px-4 py-3 shadow-lg
        ${variantStyles[variant]}
      `}
    >
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-1 opacity-70 hover:opacity-100"
        aria-label="Schließen"
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: (_m: string, _v?: ToastVariant) => {},
      toasts: [] as ToastItem[],
      removeToast: (_id: string) => {},
    };
  }
  return context;
}
