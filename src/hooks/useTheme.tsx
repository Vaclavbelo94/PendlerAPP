
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

// Synchronní funkce pro načtení tématu
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (error) {
    console.warn('Error reading theme from localStorage:', error);
  }
  
  return 'light';
};

const getInitialColorScheme = (): ColorScheme => {
  if (typeof window === 'undefined') return 'purple';
  
  try {
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    return savedColorScheme || 'purple';
  } catch (error) {
    console.warn('Error reading colorScheme from localStorage:', error);
    return 'purple';
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Synchronní inicializace pro zabránění problikávání
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getInitialColorScheme);
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log('ThemeProvider: Initializing with', { theme, colorScheme });
  
  // Efekt pro inicializaci - spustí se jen jednou
  useEffect(() => {
    try {
      const root = window.document.documentElement;
      
      // Okamžitě aplikovat téma bez animace
      root.classList.add('no-transition');
      
      if (theme === 'dark') {
        root.classList.remove('light');
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
      
      // Nastavit barevné schéma
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
      
      // Po krátkém čase povolit transitions
      setTimeout(() => {
        root.classList.remove('no-transition');
        setIsInitialized(true);
        console.log('ThemeProvider: Initialization complete');
      }, 100);
    } catch (error) {
      console.error('ThemeProvider: Error during initialization:', error);
      setIsInitialized(true); // Set initialized even on error to prevent blocking
    }
  }, []); // Prázdný dependency array - spustí se jen jednou
  
  // Efekt pro změny tématu po inicializaci
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      const root = window.document.documentElement;
      setIsChangingTheme(true);
      
      console.log('ThemeProvider: Changing theme to', theme);
      
      // Smooth transition pro změny tématu
      root.classList.add('theme-transition');
      
      setTimeout(() => {
        if (theme === 'dark') {
          root.classList.remove('light');
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
        
        localStorage.setItem('theme', theme);
        
        setTimeout(() => {
          root.classList.remove('theme-transition');
          setIsChangingTheme(false);
        }, 200);
      }, 10);
    } catch (error) {
      console.error('ThemeProvider: Error changing theme:', error);
      setIsChangingTheme(false);
    }
  }, [theme, isInitialized]);
  
  // Efekt pro změny barevného schématu
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      const root = window.document.documentElement;
      
      console.log('ThemeProvider: Changing color scheme to', colorScheme);
      
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
      
      localStorage.setItem('colorScheme', colorScheme);
    } catch (error) {
      console.error('ThemeProvider: Error changing color scheme:', error);
    }
  }, [colorScheme, isInitialized]);

  const toggleTheme = () => {
    if (isChangingTheme) return;
    console.log('ThemeProvider: Toggling theme from', theme);
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    colorScheme,
    isChangingTheme,
    setTheme,
    setColorScheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    console.error('useTheme must be used within a ThemeProvider. Make sure ThemeProvider wraps your app.');
    // Poskytni fallback hodnoty místo házení chyby
    return {
      theme: 'light' as Theme,
      colorScheme: 'purple' as ColorScheme,
      isChangingTheme: false,
      setTheme: () => console.warn('ThemeProvider not available'),
      setColorScheme: () => console.warn('ThemeProvider not available'),
      toggleTheme: () => console.warn('ThemeProvider not available')
    };
  }
  
  return context;
}
