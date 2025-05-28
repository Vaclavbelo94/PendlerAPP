
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const WelcomeSection = () => {
  const { user } = useAuth();
  const username = user?.email?.split('@')[0] || 'uživateli';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Vítejte, {username}!</h2>
        <p className="text-muted-foreground mt-1">
          Začněte používat Pendlerův Pomocník pro efektivnější práci v zahraničí
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipy pro nové uživatele</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Připojte se k našim školením v živém přenosu
            </p>
            <p className="text-sm text-muted-foreground">
              • Procházejte naši znalostní bázi s návody
            </p>
            <p className="text-sm text-muted-foreground">
              • Nastavte si notifikace pro důležité události
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link to="/faq">
                Zobrazit FAQ a nápovědu
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
              • Odemkněte pokročilé funkce a statistiky
            </p>
            <p className="text-sm text-muted-foreground">
              • Získejte přístup ke všem jazykovým cvičením
            </p>
            <p className="text-sm text-muted-foreground">
              • Exportujte data do různých formátů
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
