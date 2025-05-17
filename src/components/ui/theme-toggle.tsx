
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  alwaysShow?: boolean; // Přidáno pro kontrolu zobrazení na mobilech
}

export function ThemeToggle({ 
  variant = 'ghost', 
  size = 'icon',
  alwaysShow = false // Výchozí hodnota: nezobrazovat na mobilech
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDesktop = useMediaQuery("md");
  
  // Pokud není povoleno vždy zobrazovat a jsme na mobilním zařízení, nic nevykreslíme
  if (!alwaysShow && !isDesktop) {
    return null;
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
        >
          {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
