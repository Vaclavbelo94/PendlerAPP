
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' }
];

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  
  const currentLang = languages.find(lang => lang.code === i18n.language);

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0 md:h-9 md:w-auto md:px-2">
          <Globe className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline-block">
            {currentLang?.flag} {currentLang?.name}
          </span>
          <span className="sr-only">{t('navigation:language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer flex items-center justify-between ${
              i18n.language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </div>
            {i18n.language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
