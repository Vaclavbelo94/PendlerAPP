
import { useContext } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";

// Hook for using the language context
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageManager');
  }
  return context;
};
