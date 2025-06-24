
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, StarIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ModernLayout } from "@/components/modern/ModernLayout";

const Pricing = () => {
  const { user, isPremium } = useAuth();

  const plans = [
    {
      name: "Základní",
      price: "Zdarma",
      period: "",
      description: "Základní funkce pro začínající pendlery",
      features: [
        "Základní kalkulačka",
        "Jednoduché slovníčky (max 100 slov)",
        "Kalendář směn",
        "Základní překlad",
        "Mobilní aplikace"
      ],
      limitations: [
        "Omezený počet překladů (50/den)",
        "Základní statistiky",
        "Bez offline režimu"
      ],
      buttonText: "Aktuální plán",
      buttonVariant: "outline" as const,
      disabled: true,
      current: !isPremium
    },
    {
      name: "Premium",
      price: "149",
      period: "/měsíc",
      description: "Kompletní řešení pro profesionální pendlery",
      features: [
        "Neomezené kalkulačky a nástroje",
        "Neomezené slovníčky a překlady",
        "Pokročilé statistiky a grafy",
        "Offline režim",
        "Export dat (PDF, Excel)",
        "Pokročilý správce vozidel",
        "Daňové optimalizace",
        "Prioritní podpora",
        "Synchronizace mezi zařízeními",
        "Pokročilé plánování cest"
      ],
      limitations: [],
      buttonText: isPremium ? "Aktuální plán" : "Vybrat Premium",
      buttonVariant: isPremium ? "outline" as const : "default" as const,
      disabled: isPremium,
      current: isPremium,
      recommended: true
    },
    {
      name: "Firemní",
      price: "Na vyžádání",
      period: "",
      description: "Řešení pro firmy a týmy pendlerů",
      features: [
        "Vše z Premium plánu",
        "Správa více uživatelů",
        "Centralizované reporty",
        "API přístup",
        "Vlastní branding",
        "Dedikovaný account manager",
        "Školení týmu",
        "SLA garantovaná dostupnost",
        "Vlastní integrace",
        "Bulk správa dat"
      ],
      limitations: [],
      buttonText: "Kontaktovat prodej",
      buttonVariant: "secondary" as const,
      disabled: false,
      current: false
    }
  ];

  return (
    <ModernLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/8">
        <div className="container py-8 md:py-12 max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Cenové plány</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Vyberte si plán, který nejlépe vyhovuje vašim potřebám jako pendler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 md:mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`relative bg-background/95 backdrop-blur-sm border border-border/50 ${plan.recommended ? 'border-primary shadow-lg scale-105 bg-background' : ''} ${plan.current ? 'ring-2 ring-primary/20' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <StarIcon className="w-3 h-3 mr-1" />
                      Doporučeno
                    </Badge>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-4 right-4">
                    <Badge variant="secondary">Aktuální</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6 md:pb-8 pt-6 md:pt-8">
                  <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl md:text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm md:text-base">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4 px-4 md:px-6">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">Zahrnuje:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm">
                          <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-orange-600">Omezení:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-start text-sm">
                            <span className="h-4 w-4 text-orange-500 mr-2 mt-0.5 shrink-0">•</span>
                            <span className="text-muted-foreground">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="px-4 md:px-6 pb-6">
                  {plan.name === "Firemní" ? (
                    <Button 
                      variant={plan.buttonVariant} 
                      className="w-full"
                      asChild
                    >
                      <Link to="/contact">
                        {plan.buttonText}
                      </Link>
                    </Button>
                  ) : plan.name === "Premium" && !isPremium ? (
                    <Button 
                      variant={plan.buttonVariant} 
                      className="w-full"
                      asChild
                    >
                      <Link to="/premium">
                        {plan.buttonText}
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      variant={plan.buttonVariant} 
                      className="w-full" 
                      disabled={plan.disabled}
                    >
                      {plan.buttonText}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Často kladené otázky k cenám</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Mohu kdykoliv změnit plán?</h3>
                <p className="text-sm text-muted-foreground">
                  Ano, plán můžete změnit kdykoliv. Při přechodu na vyšší plán se rozdíl doplatí poměrně.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Jsou ceny včetně DPH?</h3>
                <p className="text-sm text-muted-foreground">
                  Ano, všechny uvedené ceny jsou včetně 21% DPH.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Nabízíte roční slevy?</h3>
                <p className="text-sm text-muted-foreground">
                  Ano, při roční platbě získáte 2 měsíce zdarma (sleva 16,7%).
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Jak funguje zkušební období?</h3>
                <p className="text-sm text-muted-foreground">
                  Premium plán můžete vyzkoušet 14 dní zdarma, bez závazků.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Máte otázky ohledně cen nebo potřebujete individuální nabídku?
              </p>
              <Button asChild variant="outline">
                <Link to="/contact">Kontaktujte nás</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default Pricing;
