
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Globe, Clock, MapPin } from 'lucide-react';
import { toast } from "sonner";

export const LanguageSettings = () => {
  const [language, setLanguage] = useState('cs');
  const [region, setRegion] = useState('cz');
  const [timezone, setTimezone] = useState('Europe/Prague');
  const [dateFormat, setDateFormat] = useState('dd.mm.yyyy');
  const [currency, setCurrency] = useState('czk');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('languageSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setLanguage(parsed.language ?? 'cs');
        setRegion(parsed.region ?? 'cz');
        setTimezone(parsed.timezone ?? 'Europe/Prague');
        setDateFormat(parsed.dateFormat ?? 'dd.mm.yyyy');
        setCurrency(parsed.currency ?? 'czk');
      } catch (error) {
        console.error('Error loading language settings:', error);
      }
    }
  }, []);

  // Auto-save when settings change
  useEffect(() => {
    const settings = {
      language,
      region,
      timezone,
      dateFormat,
      currency
    };
    
    localStorage.setItem('languageSettings', JSON.stringify(settings));
    
    // Apply language to document
    document.documentElement.setAttribute('lang', language);
  }, [language, region, timezone, dateFormat, currency]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success("Jazyk změněn na " + languages.find(l => l.value === value)?.name);
  };

  const languages = [
    { value: 'cs', label: '🇨🇿 Čeština', name: 'Čeština' },
    { value: 'sk', label: '🇸🇰 Slovenčina', name: 'Slovenčina' },
    { value: 'de', label: '🇩🇪 Němčina', name: 'Deutsch' },
    { value: 'en', label: '🇬🇧 Angličtina', name: 'English' }
  ];

  const regions = [
    { value: 'cz', label: '🇨🇿 Česká republika' },
    { value: 'sk', label: '🇸🇰 Slovensko' },
    { value: 'de', label: '🇩🇪 Německo' },
    { value: 'at', label: '🇦🇹 Rakousko' }
  ];

  const timezones = [
    { value: 'Europe/Prague', label: 'Praha (CET/CEST)' },
    { value: 'Europe/Bratislava', label: 'Bratislava (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Berlín (CET/CEST)' },
    { value: 'Europe/Vienna', label: 'Vídeň (CET/CEST)' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Jazyk aplikace
          </CardTitle>
          <CardDescription>
            Nastavte jazyk pro celé uživatelské rozhraní
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Hlavní jazyk</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte jazyk" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Region a lokalizace
          </CardTitle>
          <CardDescription>
            Nastavte region pro správné zobrazení obsahu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={(value) => {
              setRegion(value);
              toast.success("Region změněn");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((reg) => (
                  <SelectItem key={reg.value} value={reg.value}>
                    {reg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Měna</Label>
            <Select value={currency} onValueChange={(value) => {
              setCurrency(value);
              toast.success("Měna změněna");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte měnu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="czk">CZK - Česká koruna</SelectItem>
                <SelectItem value="eur">EUR - Euro</SelectItem>
                <SelectItem value="usd">USD - Americký dolar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Čas a formáty
          </CardTitle>
          <CardDescription>
            Nastavte časové pásmo a formáty zobrazení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Časové pásmo</Label>
            <Select value={timezone} onValueChange={(value) => {
              setTimezone(value);
              toast.success("Časové pásmo změněno");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte časové pásmo" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">Formát data</Label>
            <Select value={dateFormat} onValueChange={(value) => {
              setDateFormat(value);
              toast.success("Formát data změněn");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte formát data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd.mm.yyyy">DD.MM.YYYY</SelectItem>
                <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 Všechna nastavení se ukládají automaticky při změně
        </p>
      </div>
    </div>
  );
};
