
import React from 'react';
import { ArrowLeft, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MinimumWage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpět na Přehled zákonů
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-green-100">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Minimální mzda v Německu</h1>
          <Badge variant="outline" className="mt-2">
            Aktualizováno: 15. dubna 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktuální minimální mzda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">12,41 € za hodinu</div>
            <p className="text-muted-foreground">
              Od 1. ledna 2024 činí minimální mzda v Německu 12,41 € za hodinu pro všechny zaměstnance starší 18 let.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kdo má nárok na minimální mzdu</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Všichni zaměstnanci starší 18 let</li>
              <li>Pracovníci na částečný úvazek</li>
              <li>Dočasní pracovníci</li>
              <li>Praktikanti (s výjimkami)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Výjimky z minimální mzdy</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mladiství do 18 let bez dokončeného vzdělání</li>
              <li>Dobrovolníci (FÖJ, FSJ, BFD)</li>
              <li>Praktikanti při povinné praxi ze školy</li>
              <li>Dlouhodobě nezaměstnaní (první 6 měsíců)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Praktické informace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Kontrola dodržování</h4>
                <p className="text-sm text-muted-foreground">
                  Minimální mzdu kontroluje Celní správa (Zoll). Porušení může vést k pokutám až 500 000 €.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Kde nahlásit porušení</h4>
                <p className="text-sm text-muted-foreground">
                  Porušení minimální mzdy můžete nahlásit na horkou linku: 0351 44834-523
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinimumWage;
