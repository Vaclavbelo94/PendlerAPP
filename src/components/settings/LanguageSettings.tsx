
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { languages, Language } from "@/lib/i18n";

const LanguageSettings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t('languageSettings')}
        </CardTitle>
        <CardDescription>
          {t('selectPreferredLanguage')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="app-language-select">{t('preferredLanguage')}</Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger id="app-language-select" className="w-full">
              <SelectValue placeholder={t('select')} />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
