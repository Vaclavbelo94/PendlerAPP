
import React from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useLanguageManager } from "@/hooks/useLanguageManager";

interface LanguageManagerProps {
  children: React.ReactNode;
}

const LanguageManager: React.FC<LanguageManagerProps> = ({ children }) => {
  const languageManager = useLanguageManager();
  
  return (
    <LanguageContext.Provider value={languageManager}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageManager;
