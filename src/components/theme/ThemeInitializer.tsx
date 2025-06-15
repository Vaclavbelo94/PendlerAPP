
import { useEffect } from 'react';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export const ThemeInitializer: React.FC<ThemeInitializerProps> = ({ children }) => {
  useEffect(() => {
    // Ensure the document has the no-transition class initially
    const root = document.documentElement;
    root.classList.add('no-transition');
    
    // Remove the no-transition class after a short delay to enable smooth transitions
    const timer = setTimeout(() => {
      root.classList.remove('no-transition');
    }, 150);
    
    return () => {
      clearTimeout(timer);
      root.classList.remove('no-transition');
    };
  }, []);

  return <>{children}</>;
};
