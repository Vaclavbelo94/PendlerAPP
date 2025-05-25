
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, Download, Trash2 } from 'lucide-react';
import { toast } from "sonner";

const LanguageSettings = () => {
  const [appLanguage, setAppLanguage] = useState("cs");
  const [learningLanguage, setLearningLanguage] = useState("de");
  const [region, setRegion] = useState("cz");

  const handleSaveSettings = () => {
    toast.success("Jazykové nastavení bylo uloženo");
  };

  const handleDownloadLanguagePack = (lang: string) => {
    toast.success(`Stahování jazykového balíčku pro ${lang === 'de' ? 'němčinu' : 'angličtinu'}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Jazykové nastavení
          </CardTitle>
          <CardDescription>
            Nastavte preferovaný jazyk rozhraní a učení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="appLanguage">Jazyk aplikace</Label>
            <Select value={appLanguage} onValueChange={setAppLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte jazyk aplikace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">🇨🇿 Čeština</SelectItem>
                <SelectItem value="de">🇩🇪 Němčina</SelectItem>
                <SelectItem value="en">🇬🇧 Angličtina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

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
