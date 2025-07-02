
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Ceník</h1>
          <p className="text-xl text-muted-foreground">
            Vyberte si plán, který vám vyhovuje
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Zdarma</CardTitle>
              <CardDescription>Pro začátečníky</CardDescription>
              <div className="text-3xl font-bold">0 €</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  Základní kalkulačka
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  Základní informace o zákonech
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Zůstat zdarma
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-primary relative">
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
              Nejpopulárnější
            </Badge>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StarIcon className="h-5 w-5 text-primary" />
                Premium
              </CardTitle>
              <CardDescription>Pro pokročilé uživatele</CardDescription>
              <div className="text-3xl font-bold">9.99 €<span className="text-sm font-normal">/měsíc</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  Všechny funkce zdarma
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  Správa směn
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  Sledování vozidla
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  Pokročilé analýzy
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  AI asistent pro daně
                </li>
              </ul>
              <Button className="w-full">
                Aktivovat Premium
              </Button>
            </CardContent>
          </Card>

          {/* DHL Plan */}
          <Card>
            <CardHeader>
              <CardTitle>DHL Zaměstnanci</CardTitle>
              <CardDescription>Speciální ceny pro DHL</CardDescription>
              <div className="text-3xl font-bold">4.99 €<span className="text-sm font-normal">/měsíc</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  Všechny Premium funkce
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  DHL specializované nástroje
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  Integrace s DHL systémy
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Kontaktovat HR
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
