import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/hooks/useLanguage';
import { Globe } from 'lucide-react';

const AppLanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' }
  ];

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-fit gap-2 px-3">
        <Globe className="h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AppLanguageSelector;