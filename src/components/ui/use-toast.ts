
// Re-exporting from the hooks folder to prevent circular dependencies
import * as React from "react";

// Define the interface for toast props to avoid circular imports
interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  [key: string]: any;
}

type ToastReturnType = {
  id: string;
  dismiss: () => void;
  update: (props: any) => void;
};

// Create a simple placeholder toast function that will be updated after import
let useToastImpl = () => ({
  toast: (props: ToastProps): ToastReturnType => {
    console.warn("Toast not initialized");
    return { id: "", dismiss: () => {}, update: (props: any) => {} };
  },
  dismiss: () => {},
  toasts: [],
});

let toastImpl = (props: ToastProps): ToastReturnType => {
  console.warn("Toast not initialized");
  return { id: "", dismiss: () => {}, update: (props: any) => {} };
};

// Import the actual implementations (this prevents circular dependencies)
import { useToast as importedUseToast, toast as importedToast } from "@/hooks/use-toast";

// Replace the placeholders with actual implementations
useToastImpl = importedUseToast;
toastImpl = importedToast;

// Add helper methods to match toast usage in components
const enhancedToast = Object.assign(
  (props: ToastProps): ToastReturnType => toastImpl(props),
  {
    success: (title: string, description?: string): ToastReturnType => 
      toastImpl({ title, description, variant: "default" }),
    error: (title: string, description?: string): ToastReturnType => 
      toastImpl({ title, description, variant: "destructive" }),
    info: (title: string, description?: string): ToastReturnType => 
      toastImpl({ title, description })
  }
);

// Export with the same names
export const useToast = useToastImpl;
export const toast = enhancedToast;
