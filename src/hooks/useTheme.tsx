
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ColorScheme = 'purple' | 'blue' | 'green' | 'amber' | 'red' | 'pink';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  isChangingTheme: boolean;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
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

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    // Načtení barevného schématu z local storage
    if (typeof window !== 'undefined') {
      const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
      if (savedColorScheme) {
        return savedColorScheme;
      }
    }
    
    // Výchozí hodnota
    return 'purple';
  });
  
  // Stav pro sledování, zda právě probíhá změna tématu
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  
  // Zamezit problikávání při změně tématu
  const [initialRender, setInitialRender] = useState(true);
  
  // Efekt pro inicializaci
  useEffect(() => {
    // Přidáme třídu pro zamezení animací během prvního načtení
    document.documentElement.classList.add('no-animation');
    
    // Odstraníme třídu po chvíli
    setTimeout(() => {
      document.documentElement.classList.remove('no-animation');
      setInitialRender(false);
    }, 300);
  }, []);
  
  // Efekt pro aktualizaci HTML atributu a localStorage při změně tématu
  useEffect(() => {
    // Přeskočit první render, aby nedošlo k probliknutí
    if (initialRender) return;
    
    const root = window.document.documentElement;
    
    // Nastavit příznak změny tématu
    setIsChangingTheme(true);
    
    // Aplikovat změnu plynule
    if (theme === 'dark') {
      root.classList.add('theme-transition');
      setTimeout(() => {
        // Odstranit předchozí třídy a přidat novou
        root.classList.remove('light');
        root.classList.add('dark');
        
        // Po dokončení přechodu odstranit třídu pro transition a resetovat příznak změny
        setTimeout(() => {
          root.classList.remove('theme-transition');
          setIsChangingTheme(false);
        }, 300);
      }, 10);
    } else {
      root.classList.add('theme-transition');
      setTimeout(() => {
        // Odstranit předchozí třídy a přidat novou
        root.classList.remove('dark');
        root.classList.add('light');
        
        // Po dokončení přechodu odstranit třídu pro transition a resetovat příznak změny
        setTimeout(() => {
          root.classList.remove('theme-transition');
          setIsChangingTheme(false);
        }, 300);
      }, 10);
    }
    
    // Uložit do localStorage
    localStorage.setItem('theme', theme);
  }, [theme, initialRender]);
  
  // Efekt pro aktualizaci barevného schématu
  useEffect(() => {
    // Přeskočit první render, aby nedošlo k probliknutí
    if (initialRender) return;
    
    const root = window.document.documentElement;
    
    // Nastavit CSS proměnnou s primární barvou podle vybraného schématu
    switch (colorScheme) {
      case 'purple':
        root.style.setProperty('--color-primary', '#8884d8');
        break;
      case 'blue':
        root.style.setProperty('--color-primary', '#0ea5e9');
        break;
      case 'green':
        root.style.setProperty('--color-primary', '#10b981');
        break;
      case 'amber':
        root.style.setProperty('--color-primary', '#f59e0b');
        break;
      case 'red':
        root.style.setProperty('--color-primary', '#ef4444');
        break;
      case 'pink':
        root.style.setProperty('--color-primary', '#ec4899');
        break;
      default:
        root.style.setProperty('--color-primary', '#8884d8');
    }
    
    // Uložit do localStorage
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme, initialRender]);

  // Funkce pro přepnutí témat
  const toggleTheme = () => {
    if (isChangingTheme) return; // Zabránit rychlému přepínání, pokud už změna probíhá
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, isChangingTheme, setTheme, setColorScheme, toggleTheme }}>
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
