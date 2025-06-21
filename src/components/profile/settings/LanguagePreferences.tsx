
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/hooks/useLanguage';

interface LanguagePreferencesProps {
  preferredLanguage: string;
  handleInputChange: (field: string, value: string) => void;
}

const LanguagePreferences = ({
  preferredLanguage,
  handleInputChange,
}: LanguagePreferencesProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('preferences')}</h3>
      
      <div className="space-y-2">
        <Label htmlFor="preferredLanguage">{t('preferredLanguage')}</Label>
        <Select 
          value={preferredLanguage} 
          onValueChange={(value) => handleInputChange('preferredLanguage', value)}
        >
          <SelectTrigger id="preferredLanguage" className="w-full">
            <SelectValue placeholder={t('selectLanguage')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs">🇨🇿 {t('czech')}</SelectItem>
            <SelectItem value="pl">🇵🇱 {t('polish')}</SelectItem>
            <SelectItem value="de">🇩🇪 {t('german')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LanguagePreferences;
