import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const supportedLanguages = [
  { value: "cs", label: "Čeština" },
  { value: "pl", label: "Polski" },
  { value: "de", label: "Deutsch" },
];

// Only UI language setting remains
const LanguageSettings: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("app_language") || "cs");

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    localStorage.setItem("app_language", value);
    window.location.reload(); // Easiest way to fully reload language
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Jazyk aplikace
        </CardTitle>
        <CardDescription>
          Vyberte jazyk rozhraní aplikace (čeština, polština, němčina)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="app-language-select">Jazyk</Label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger id="app-language-select" className="w-full">
              <SelectValue placeholder="Vyberte jazyk" />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
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
