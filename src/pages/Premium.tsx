
import React from 'react';
import { DashboardBackground } from '@/components/common/DashboardBackground';
import OptimizedLayout from '@/components/layouts/OptimizedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Crown, Star, Check, Zap, Shield, Rocket } from "lucide-react";

const Premium = () => {
  const { isPremium } = useAuth();

  const premiumFeatures = [
    {
      icon: Star,
      title: 'Bez reklam',
      description: 'Používejte aplikaci bez jakýchkoliv reklam'
    },
    {
      icon: Zap,
      title: 'Neomezený přístup',
      description: 'Přístup ke všem funkcím a nástrojům'
    },
    {
      icon: Shield,
      title: 'Prioritní podpora',
      description: 'Rychlejší řešení problémů a dotazů'
    },
    {
      icon: Rocket,
      title: 'Pokročilé funkce',
      description: 'Exkluzivní nástroje pro premium uživatele'
    }
  ];

  return (
    <OptimizedLayout>
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Crown className="h-8 w-8 text-amber-500" />
              Premium Předplatné
            </h1>
            <p className="text-muted-foreground text-lg">
              Odemkněte plný potenciál Pendlerova Pomocníka
            </p>
          </div>

          {isPremium ? (
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
                  <Crown className="h-6 w-6" />
                  Jste Premium uživatel!
                </CardTitle>
                <CardDescription>
                  Děkujeme za vaši podporu. Využíváte všechny Premium výhody.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <feature.icon className="h-5 w-5 text-amber-600" />
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Crown className="h-6 w-6 text-amber-500" />
                    Přejděte na Premium
                  </CardTitle>
                  <CardDescription>
                    Získejte přístup ke všem funkcím bez omezení
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4">
                    <span className="text-3xl text-muted-foreground">od</span> 99 Kč
                    <span className="text-lg text-muted-foreground">/měsíc</span>
                  </div>
                  <Button size="lg" className="w-full max-w-sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Aktivovat Premium
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premium výhody</CardTitle>
                  <CardDescription>
                    Co získáte s Premium předplatným
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                        <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardBackground>  
    </OptimizedLayout>
  );
};

export default Premium;
