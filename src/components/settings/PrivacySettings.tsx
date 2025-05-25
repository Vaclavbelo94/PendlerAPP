
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Cookie, BarChart3 } from 'lucide-react';
import { toast } from "sonner";

const PrivacySettings = () => {
  const [analytics, setAnalytics] = useState(true);
  const [cookies, setCookies] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);

  const handleSaveSettings = () => {
    toast.success("Nastavení soukromí byla uložena");
  };

  const handleDownloadData = () => {
    toast.success("Požadavek na stažení dat byl odeslán");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Soukromí a bezpečnost
          </CardTitle>
          <CardDescription>
            Spravujte své nastavení soukromí a bezpečnosti
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytické cookies
              </Label>
              <p className="text-sm text-muted-foreground">
                Povolit sbírání anonymních dat pro zlepšení aplikace
              </p>
            </div>
            <Switch
              id="analytics"
              checked={analytics}
              onCheckedChange={setAnalytics}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cookies" className="flex items-center gap-2">
                <Cookie className="h-4 w-4" />
                Funkční cookies
              </Label>
              <p className="text-sm text-muted-foreground">
                Povolit cookies potřebné pro správné fungování aplikace
              </p>
            </div>
            <Switch
              id="cookies"
              checked={cookies}
              onCheckedChange={setCookies}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dataSharing" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sdílení dat
              </Label>
              <p className="text-sm text-muted-foreground">
                Povolit sdílení anonymizovaných dat s partnery
              </p>
            </div>
            <Switch
              id="dataSharing"
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profileVisibility" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Viditelnost profilu
              </Label>
              <p className="text-sm text-muted-foreground">
                Povolit ostatním uživatelům vidět váš profil
              </p>
            </div>
            <Switch
              id="profileVisibility"
              checked={profileVisibility}
              onCheckedChange={setProfileVisibility}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Práva podle GDPR</CardTitle>
          <CardDescription>
            Vaše práva týkající se zpracování osobních údajů
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleDownloadData} variant="outline" className="w-full">
              Stáhnout moje data
            </Button>
            
            <Button variant="outline" className="w-full">
              Požádat o smazání
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Informace o zpracování</h4>
            <p className="text-sm text-muted-foreground">
              Vaše osobní údaje zpracováváme v souladu s GDPR. 
              Více informací najdete v našich zásadách ochrany osobních údajů.
            </p>
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

export default PrivacySettings;
