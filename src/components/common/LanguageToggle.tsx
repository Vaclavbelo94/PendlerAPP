
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useInternationalization } from '@/hooks/useInternationalization';

const LanguageToggle = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useInternationalization();
  
  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0 md:h-9 md:w-auto md:px-2">
          <Globe className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline-block">
            {currentLang?.flag} {currentLang?.name}
          </span>
          <span className="sr-only">Změnit jazyk</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border shadow-lg z-50">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${
              currentLanguage === lang.code ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
