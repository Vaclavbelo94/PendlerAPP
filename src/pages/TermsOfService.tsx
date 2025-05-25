
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
        <h1 className="text-3xl font-bold">Podmínky používání</h1>
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
              Vítejte v naší aplikaci. Tyto podmínky používání ("Podmínky") 
              upravují váš přístup k naší aplikaci a její používání.
            </p>
            <p>
              Používáním naší aplikace souhlasíte s těmito podmínkami. 
              Pokud s nimi nesouhlasíte, nepoužívejte prosím naši aplikaci.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Použití aplikace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Aplikaci můžete používat pro osobní a nekomerční účely 
              v souladu s těmito podmínkami.
            </p>
            <p>
              Zavazujete se nepoužívat aplikaci způsobem, který by mohl 
              poškodit, deaktivovat, přetížit nebo narušit její fungování.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Uživatelské účty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Pro přístup k některým funkcím můžete potřebovat vytvořit uživatelský účet.
            </p>
            <p>
              Jste odpovědní za zachování důvěrnosti svého hesla a za všechny 
              aktivity, které se stanou pod vaším účtem.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Ochrana dat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Zpracování vašich osobních údajů se řídí našimi Zásadami ochrany osobních údajů.
            </p>
            <p>
              Vaše data jsou chráněna moderními bezpečnostními opatřeními 
              a používána pouze pro účely poskytování služeb.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Omezení odpovědnosti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Aplikace je poskytována "tak jak je" bez jakýchkoli záruk.
            </p>
            <p>
              Neneseme odpovědnost za žádné škody vyplývající z používání aplikace.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Změny podmínek</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Vyhrazujeme si právo tyto podmínky kdykoli změnit. 
              O změnách vás budeme informovat prostřednictvím aplikace.
            </p>
            <p>
              Pokračováním v používání aplikace po změnách souhlasíte s novými podmínkami.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Kontakt</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Máte-li otázky ohledně těchto podmínek, kontaktujte nás prosím 
              prostřednictvím kontaktního formuláře v aplikaci.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
