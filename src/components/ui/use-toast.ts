
// Re-exporting from the hooks folder to prevent circular dependencies
import * as React from "react";

// Define the interface for toast props to avoid circular imports
interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  [key: string]: any;
}

// Create a simple placeholder toast function that will be updated after import
let useToastImpl = () => ({
  toast: (props: ToastProps) => console.warn("Toast not initialized"),
  dismiss: () => {},
  toasts: [],
});

let toastImpl = (props: ToastProps) => {
  console.warn("Toast not initialized");
  return { id: "", dismiss: () => {}, update: () => {} };
};

// Import the actual implementations (this prevents circular dependencies)
import { useToast as importedUseToast, toast as importedToast } from "@/hooks/use-toast";

// Replace the placeholders with actual implementations
useToastImpl = importedUseToast;
toastImpl = importedToast;

// Export with the same names
export const useToast = useToastImpl;
export const toast = toastImpl;
