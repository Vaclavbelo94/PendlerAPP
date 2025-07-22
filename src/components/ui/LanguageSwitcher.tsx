import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Settings, User } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {t('common.language', 'Jazyk')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={i18n.language === lang.code ? 'default' : 'outline'}
              onClick={() => handleLanguageChange(lang.code)}
              className="justify-start"
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSwitcher;