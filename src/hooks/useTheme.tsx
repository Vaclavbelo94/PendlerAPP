
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Načtení tématu z local storage při inicializaci
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      
      // Pokud existuje preference v localStorage, použij ji
      if (savedTheme) {
        return savedTheme;
      }
      
      // Jinak se pokus zjistit preferenci systému
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    // Výchozí hodnota
    return 'light';
  });

  // Efekt pro aktualizaci HTML atributu a localStorage při změně tématu
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Odstranit předchozí třídy a přidat novou
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Uložit do localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Funkce pro přepnutí témat
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook pro použití tématu v komponentách
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
