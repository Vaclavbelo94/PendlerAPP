import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-yellow-200 hover:bg-yellow-50"
        >
          <Languages className="h-4 w-4" />
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {currentLanguage.code.toUpperCase()}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="min-w-[200px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={`flex items-center gap-3 cursor-pointer py-3 px-4 ${
              i18n.language === language.code 
                ? 'bg-yellow-50 text-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-100' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleLanguageChange(language.code)}
          >
            <span className="text-xl">{language.flag}</span>
            <div className="flex-1">
              <span className="font-medium">{language.name}</span>
              <div className="text-xs text-muted-foreground">
                {language.code.toUpperCase()}
              </div>
            </div>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-yellow-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;