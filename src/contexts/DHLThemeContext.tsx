import React, { createContext, useContext, ReactNode } from 'react';
import { useDHLTheme, DHLThemeState } from '@/hooks/useDHLTheme';

interface DHLThemeContextType extends DHLThemeState {
  toggleDHLTheme: () => void;
}

const DHLThemeContext = createContext<DHLThemeContextType | undefined>(undefined);

interface DHLThemeProviderProps {
  children: ReactNode;
}

export const DHLThemeProvider: React.FC<DHLThemeProviderProps> = ({ children }) => {
  const dhlTheme = useDHLTheme();

  return (
    <DHLThemeContext.Provider value={dhlTheme}>
      {children}
    </DHLThemeContext.Provider>
  );
};

export const useDHLThemeContext = () => {
  const context = useContext(DHLThemeContext);
  if (context === undefined) {
    throw new Error('useDHLThemeContext must be used within a DHLThemeProvider');
  }
  return context;
};