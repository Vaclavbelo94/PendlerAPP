
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TaxReturn = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpět na Přehled zákonů
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-yellow-100">
          <FileText className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Daňové přiznání v Německu</h1>
          <Badge variant="outline" className="mt-2">
            Aktualizováno: 10. dubna 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kdo musí podat daňové přiznání</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Samostatně výdělečné osoby</li>
              <li>Osoby s vedlejšími příjmy nad 410 € ročně</li>
              <li>Manželé s daňovou třídou III/V nebo IV s faktorem</li>
              <li>Osoby s příjmy od více zaměstnavatelů</li>
              <li>Osoby pobírající nezaměstnanecké dávky</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lhůty pro podání</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Standardní lhůta</h4>
                <p className="text-sm text-muted-foreground">31. července následujícího roku</p>
              </div>
              <div>
                <h4 className="font-semibold">S daňovým poradcem</h4>
                <p className="text-sm text-muted-foreground">Do konce února roku následujícího</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Odpočitatelné položky</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cestovné náklady do práce</li>
              <li>Pracovní pomůcky</li>
              <li>Fortbildung (další vzdělávání)</li>
              <li>Příspěvky na pojištění</li>
              <li>Církevní daň</li>
              <li>Dary na charitu</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxReturn;
