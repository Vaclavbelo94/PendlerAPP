
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const WelcomeSection = () => {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const username = user?.email?.split('@')[0] || 'uživatel';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t('welcome')}, {username}!
        </h2>
        <p className="text-muted-foreground mt-1">
          Vítejte zpět ve vašem pracovním asistentovi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipy pro nové uživatele</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Živý trénink s moderními funkcemi
            </p>
            <p className="text-sm text-muted-foreground">
              Komplexní znalostní databáze
            </p>
            <p className="text-sm text-muted-foreground">
              Přizpůsobená oznámení a připomenutí
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link to="/faq">
                Zobrazit nápovědu a FAQ
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-md mr-2">PRO</span>
              Premium výhody
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Pokročilé funkce pro profesionály
            </p>
            <p className="text-sm text-muted-foreground">
              Všechna jazyková cvičení
            </p>
            <p className="text-sm text-muted-foreground">
              Export dat a analýzy
            </p>
            <Button className="mt-4 w-full" asChild>
              <Link to="/premium">
                Aktivovat Premium
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeSection;
