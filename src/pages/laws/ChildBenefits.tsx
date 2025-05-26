
import React from 'react';
import { ArrowLeft, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ChildBenefits = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpět na Přehled zákonů
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-pink-100">
          <Baby className="h-6 w-6 text-pink-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Přídavky na děti (Kindergeld)</h1>
          <Badge variant="outline" className="mt-2">
            Aktualizováno: 5. dubna 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Výše Kindergeld 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold text-pink-600 mb-2">250 € měsíčně</div>
              <p className="text-muted-foreground">
                Pro všechny děti bez ohledu na pořadí od 1. ledna 2023.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Věkové limity:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Do 18 let: automaticky</li>
                  <li>Do 25 let: při studiu nebo výuce</li>
                  <li>Bez omezení: při zdravotním postižení</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Podmínky pro nárok</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Trvalý pobyt v Německu nebo EU</li>
              <li>Dítě žije ve stejné domácnosti</li>
              <li>Dítě je nezaopatřené</li>
              <li>Splnění věkových podmínek</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jak žádat o Kindergeld</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Kde podat žádost:</h4>
                <p className="text-sm text-muted-foreground">Familienkasse při Bundesagentur für Arbeit</p>
              </div>
              <div>
                <h4 className="font-semibold">Potřebné dokumenty:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Formulář žádosti</li>
                  <li>Rodný list dítěte</li>
                  <li>Průkaz totožnosti</li>
                  <li>Potvrzení o bydlišti</li>
                  <li>Případně potvrzení o studiu/výuce</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kinderzuschlag (Doplněk k Kindergeld)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-lg font-bold text-green-600">Až 250 € měsíčně</div>
              <p className="text-sm text-muted-foreground">
                Pro rodiny s nízkými příjmy, které nepobírají ALG II.
              </p>
              <div>
                <h4 className="font-semibold">Podmínky:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Minimální příjem z práce</li>
                  <li>Příjem nestačí na pokrytie potřeb celé rodiny</li>
                  <li>S Kinderzuschlag by rodina nepotřebovala ALG II</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChildBenefits;
