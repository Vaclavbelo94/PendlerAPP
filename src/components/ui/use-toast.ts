
import { useToast as useShadcnToast } from "@/hooks/use-toast";
import { toast as shadcnToast } from "@/hooks/use-toast";

// Re-export with the same names
export const useToast = useShadcnToast;
export const toast = shadcnToast;
