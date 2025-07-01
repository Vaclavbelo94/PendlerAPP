
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Info } from 'lucide-react';
import DHLSetupForm from '@/components/dhl/DHLSetupForm';
import { useDHLRouteGuard } from '@/hooks/dhl/useDHLRouteGuard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const DHLSetup: React.FC = () => {
  const { canAccess, isDHLEmployee, isLoading } = useDHLRouteGuard(true);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isDHLEmployee) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Přístup odepřen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tato stránka je dostupná pouze pro zaměstnance DHL.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">DHL Nastavení účtu</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Dokončete nastavení vašeho DHL účtu výběrem pozice a pracovní skupiny. 
          Tyto informace pomůžou aplikaci přizpůsobit směny podle vašeho pracovního rozvrhu.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Důležité informace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Pozice:</strong> Určuje typ práce, kterou vykonáváte a odpovídající hodinovou sazbu.
          </p>
          <p>
            <strong>Pracovní skupina (Woche):</strong> Určuje váš rotační rozvrh v 15-týdenním cyklu.
          </p>
          <p className="text-muted-foreground">
            Po dokončení nastavení budete moci spravovat své směny a využívat všechny DHL funkce aplikace.
          </p>
        </CardContent>
      </Card>

      <DHLSetupForm />
    </div>
  );
};

export default DHLSetup;
