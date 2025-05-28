
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, Download, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { useInternationalization } from "@/hooks/useInternationalization";
import { useGermanLessonsTranslation } from "@/hooks/useGermanLessonsTranslation";

const LanguageSettings = () => {
  const [learningLanguage, setLearningLanguage] = useState("de");
  const [region, setRegion] = useState("cz");
  
  // Hooks pro správu jazyků
  const { currentLanguage: systemLanguage, changeLanguage: changeSystemLanguage, availableLanguages: systemLanguages } = useInternationalization();
  const { currentLanguage: lessonsLanguage, changeLanguage: changeLessonsLanguage, availableLanguages: lessonsLanguages } = useGermanLessonsTranslation();

  const handleSaveSettings = () => {
    toast.success("Jazykové nastavení bylo uloženo");
  };

  const handleDownloadLanguagePack = (lang: string) => {
    toast.success(`Stahování jazykového balíčku pro ${lang === 'de' ? 'němčinu' : 'angličtinu'}`);
  };

  return (
    <div className="space-y-6">
      {/* System Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Hlavní jazyk aplikace
          </CardTitle>
          <CardDescription>
            Nastavte jazyk pro celé uživatelské rozhraní aplikace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="systemLanguage">Jazyk aplikace</Label>
            <Select value={systemLanguage} onValueChange={changeSystemLanguage}>
              <SelectTrigger id="systemLanguage">
                <SelectValue placeholder="Vyberte jazyk aplikace" />
              </SelectTrigger>
              <SelectContent>
                {systemLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Ovlivňuje jazyk menu, tlačítek a všech obecných textů v aplikaci
            </p>
          </div>
        </CardContent>
      </Card>

      {/* German Lessons Interface Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Jazyk rozhraní pro lekce němčiny
          </CardTitle>
          <CardDescription>
            Nastavte jazyk pro instrukce a popisky v sekcích výuky němčiny
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>Vyberte jazyk rozhraní pro lekce:</Label>
            <div className="grid grid-cols-2 gap-2">
              {lessonsLanguages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={lessonsLanguage === lang.code ? "default" : "outline"}
                  onClick={() => changeLessonsLanguage(lang.code)}
                  className="justify-start h-auto p-3"
                >
                  <span className="mr-2 text-base">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Aktuální jazyk: {lessonsLanguages.find(l => l.code === lessonsLanguage)?.name}
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Preference učení
          </CardTitle>
          <CardDescription>
            Nastavte jaký jazyk se učíte a vaší region
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="learningLanguage">Jazyk, který se učíte</Label>
            <Select value={learningLanguage} onValueChange={setLearningLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte jazyk pro učení" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">🇩🇪 Němčina</SelectItem>
                <SelectItem value="en">🇬🇧 Angličtina</SelectItem>
                <SelectItem value="fr">🇫🇷 Francouzština</SelectItem>
                <SelectItem value="it">🇮🇹 Italština</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cz">🇨🇿 Česká republika</SelectItem>
                <SelectItem value="sk">🇸🇰 Slovensko</SelectItem>
                <SelectItem value="de">🇩🇪 Německo</SelectItem>
                <SelectItem value="at">🇦🇹 Rakousko</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offline Language Packs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Offline jazykové balíčky
          </CardTitle>
          <CardDescription>
            Stáhněte jazykové balíčky pro offline použití
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">🇩🇪 Německý balíček</p>
              <p className="text-sm text-muted-foreground">Obsahuje 5,000+ slov a frází</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadLanguagePack('de')}
              >
                <Download className="h-4 w-4 mr-2" />
                Stáhnout
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">🇬🇧 Anglický balíček</p>
              <p className="text-sm text-muted-foreground">Obsahuje 3,000+ slov a frází</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadLanguagePack('en')}
              >
                <Download className="h-4 w-4 mr-2" />
                Stáhnout
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Uložit nastavení
        </Button>
      </div>
    </div>
  );
};

export default LanguageSettings;
