
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';
import { languages, Language } from '@/lib/i18n';

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const currentLang = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0 md:h-9 md:w-auto md:px-2">
          <Globe className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline-block">
            {currentLang?.flag} {currentLang?.name}
          </span>
          <span className="sr-only">{t('common.settings')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as Language)}
            className={`cursor-pointer flex items-center justify-between ${
              language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
