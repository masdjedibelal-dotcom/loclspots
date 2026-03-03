"use client";

import { ToastProvider } from "@/hooks/useToast";

export function ToastProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
