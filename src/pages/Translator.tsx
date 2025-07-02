
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareIcon, HeadphonesIcon, LanguagesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';

const Translator = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <OptimizedPremiumCheck featureKey="translator">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <LanguagesIcon className="h-8 w-8 text-primary" />
            Komunikace s HR
          </h1>
          <p className="text-muted-foreground text-lg">
            AI asistent pro překládání a komunikaci s německými HR odděleními
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareIcon className="h-5 w-5" />
                Překlad textů
              </CardTitle>
              <CardDescription>
                Překládání emailů, smluv a dokumentů mezi češtinou a němčinou
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeadphonesIcon className="h-5 w-5" />
                HR komunikace
              </CardTitle>
              <CardDescription>
                Specializovaný asistent pro komunikaci s personálními odděleními
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LanguagesIcon className="h-5 w-5" />
                Kontextuální překlad
              </CardTitle>
              <CardDescription>
                Překlad s ohledem na pracovní prostředí a německé právo
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>AI Překladač pro HR komunikaci</CardTitle>
            <CardDescription>
              Zadejte text pro překlad nebo komunikaci s HR oddělením
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <LanguagesIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Funkce bude brzy dostupná</p>
                <p className="text-sm">AI překladač pro HR komunikaci se připravuje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OptimizedPremiumCheck>
  );
};

export default Translator;
