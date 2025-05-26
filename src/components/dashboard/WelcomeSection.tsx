
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const quickStartSteps = [
  {
    title: "Nastavte si profil",
    description: "Doplňte své základní informace",
    link: "/profile",
    completed: false
  },
  {
    title: "Přidejte své první vozidlo",
    description: "Zaregistrujte vozidlo pro evidenci",
    link: "/vehicle",
    completed: false
  },
  {
    title: "Naplánujte první směnu",
    description: "Vytvořte první záznam směny",
    link: "/shifts",
    completed: false
  },
  {
    title: "Vyzkoušejte jazykový kurz",
    description: "Naučte se základní slovíčka",
    link: "/language",
    completed: false
  }
];

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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rychlý start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickStartSteps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  step.completed ? 'bg-primary/10' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <Button 
                  asChild 
                  variant={step.completed ? "secondary" : "default"} 
                  size="sm"
                >
                  <Link to={step.link}>
                    {step.completed ? "Upravit" : "Začít"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
