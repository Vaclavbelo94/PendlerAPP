
import React from 'react';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EmployeeProtection = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpět na Přehled zákonů
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-blue-100">
          <UserCheck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Ochrana zaměstnanců v Německu</h1>
          <Badge variant="outline" className="mt-2">
            Aktualizováno: 30. března 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Základní práva zaměstnanců</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Právo na bezpečné pracovní prostředí</li>
              <li>Ochrana před diskriminací</li>
              <li>Právo na spravedlivou mzdu</li>
              <li>Dodržování pracovní doby</li>
              <li>Právo na dovolenou</li>
              <li>Ochrana před neodůvodněným propuštěním</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zákon o ochraně před propuštěním (KSchG)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Platí pro podniky s více než 10 zaměstnanci. Výpověď musí být sociálně odůvodněná.
              </p>
              <div>
                <h4 className="font-semibold">Důvody pro výpověď:</h4>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Osobní důvody (nemoc, neschopnost)</li>
                  <li>Porušování povinností</li>
                  <li>Provozní důvody (ekonomické problémy)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pracovní bezpečnost</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Povinnost zaměstnavatele zajistit bezpečnost</li>
              <li>Poskytnutí ochranných pomůcek</li>
              <li>Školení BOZP</li>
              <li>Právo odmítnout nebezpečnou práci</li>
              <li>Nahlašování úrazů</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ochrana před diskriminací</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Všeobecný zákon o rovném zacházení (AGG) chrání před diskriminací na základě:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Rasy nebo etnického původu</li>
                <li>Pohlaví</li>
                <li>Náboženství nebo přesvědčení</li>
                <li>Postižení</li>
                <li>Věku</li>
                <li>Sexuální orientace</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProtection;
