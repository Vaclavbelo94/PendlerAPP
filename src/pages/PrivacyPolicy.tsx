
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zpět
        </Button>
        <h1 className="text-3xl font-bold">Zásady ochrany osobních údajů</h1>
        <p className="text-muted-foreground mt-2">
          Platné od: {new Date().toLocaleDateString('cs-CZ')}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Úvod</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Tyto zásady ochrany osobních údajů popisují, jak shromažďujeme, 
              používáme a chráníme vaše osobní údaje.
            </p>
            <p>
              Vaše soukromí je pro nás důležité a zavazujeme se chránit vaše osobní údaje.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Jaké údaje shromažďujeme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Osobní údaje:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email a uživatelské jméno při registraci</li>
              <li>Informace o vašich směnách a rozvrhu</li>
              <li>Nastavení aplikace a preference</li>
              <li>Pokrok v učení jazyka</li>
            </ul>
            <p><strong>Technické údaje:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP adresa a informace o zařízení</li>
              <li>Údaje o používání aplikace</li>
              <li>Cookies a podobné technologie</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Jak údaje používáme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Vaše údaje používáme pro:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Poskytování a zlepšování našich služeb</li>
              <li>Synchronizaci dat mezi zařízeními</li>
              <li>Zasílání důležitých oznámení</li>
              <li>Analýzu používání pro vylepšení aplikace</li>
              <li>Zabezpečení a prevenci zneužití</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Sdílení údajů</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Vaše osobní údaje nesdílíme s třetími stranami, kromě případů:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Se zákonné povinnosti</li>
              <li>S vaším výslovným souhlasem</li>
              <li>Pro ochranu našich práv a bezpečnosti</li>
              <li>Se spolehlivými poskytovateli služeb (pouze pro technické účely)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Zabezpečení údajů</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Používáme moderní bezpečnostní opatření pro ochranu vašich údajů:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Šifrování dat při přenosu i uložení</li>
              <li>Pravidelné bezpečnostní audity</li>
              <li>Omezený přístup pouze autorizovanému personálu</li>
              <li>Pravidelné zálohy dat</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Vaše práva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Máte právo:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Přístup k vašim osobním údajům</li>
              <li>Oprava nesprávných údajů</li>
              <li>Smazání vašich údajů</li>
              <li>Omezení zpracování</li>
              <li>Přenositelnost údajů</li>
              <li>Námitka proti zpracování</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Používáme cookies pro zlepšení funkčnosti aplikace a analýzu používání.
            </p>
            <p>
              Cookies můžete spravovat v nastavení vašeho prohlížeče.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Kontakt</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Pro dotazy ohledně ochrany osobních údajů nás kontaktujte 
              prostřednictvím kontaktního formuláře v aplikaci.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
