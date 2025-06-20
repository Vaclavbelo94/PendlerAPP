
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  completeDailyGoal: () => void;
  addXp: (amount: number) => void;
  xp: number;
  level: number;
  streak: number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  const addXp = (amount: number) => {
    setXp(prev => {
      const newXp = prev + amount;
      const xpForNextLevel = level * 100;
      
      if (newXp >= xpForNextLevel) {
        setLevel(prev => prev + 1);
        return newXp - xpForNextLevel;
      }
      
      return newXp;
    });
  };

  const completeDailyGoal = () => {
    setStreak(prev => prev + 1);
    addXp(20);
  };

  return (
    <LanguageContext.Provider value={{
      completeDailyGoal,
      addXp,
      xp,
      level,
      streak
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
