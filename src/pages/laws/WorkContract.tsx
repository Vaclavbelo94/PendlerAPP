
import React from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WorkContract = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpět na Přehled zákonů
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-blue-100">
          <Briefcase className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Pracovní smlouva v Německu</h1>
          <Badge variant="outline" className="mt-2">
            Aktualizováno: 18. března 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Náležitosti pracovní smlouvy</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identifikace smluvních stran</li>
              <li>Datum začátku pracovního poměru</li>
              <li>Popis pracovní činnosti</li>
              <li>Výše mzdy a způsob výplaty</li>
              <li>Pracovní doba</li>
              <li>Dovolená</li>
              <li>Výpovědní lhůty</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zkušební doba</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Zkušební doba může trvat maximálně 6 měsíců. Během této doby je možné ukončit pracovní poměr s výpovědní lhůtou 2 týdny k libovolnému datu.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formy pracovního poměru</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Plný úvazek:</strong> Standardní 40hodinový týden</li>
              <li><strong>Částečný úvazek:</strong> Méně hodin než plný úvazek</li>
              <li><strong>Minijob:</strong> Příjem do 450 € měsíčně</li>
              <li><strong>Na dobu určitou:</strong> Omezený časem</li>
              <li><strong>Na dobu neurčitou:</strong> Bez časového omezení</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkContract;
