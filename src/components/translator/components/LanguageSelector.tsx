
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  id: string;
  languages: Array<{code: string, name: string}>;
  label?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onValueChange,
  id,
  languages,
  label
}) => {
  const { t } = useLanguage();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={label || t('selectLanguage') || "Vyberte jazyk"} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
