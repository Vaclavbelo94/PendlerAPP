
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useGermanLessonsTranslation } from "@/hooks/useGermanLessonsTranslation";

const InterfaceLanguageSettings: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useGermanLessonsTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Jazyk rozhraní
        </CardTitle>
        <CardDescription>
          Nastavte jazyk uživatelského rozhraní pro lekce němčiny
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label>Vyberte jazyk rozhraní:</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableLanguages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? "default" : "outline"}
                onClick={() => changeLanguage(lang.code)}
                className="justify-start h-auto p-3"
              >
                <span className="mr-2 text-base">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Aktuální jazyk: {availableLanguages.find(l => l.code === currentLanguage)?.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterfaceLanguageSettings;
