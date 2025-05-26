
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TaxClasses = () => {
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
          <h1 className="text-3xl font-bold">Daňové třídy v Německu</h1>
          <Badge variant="outline" className="mt-2">
            Aktualizováno: 28. března 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Přehled daňových tříd</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Třída I</h4>
                <p className="text-sm text-muted-foreground">Svobodní, rozvedení, ovdovělí</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Třída II</h4>
                <p className="text-sm text-muted-foreground">Svobodní s dítětem (zvýhodněný sazba)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">Třída III</h4>
                <p className="text-sm text-muted-foreground">Ženatí/vdané - výhodnější varianta</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold">Třída IV</h4>
                <p className="text-sm text-muted-foreground">Ženatí/vdané - standardní</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold">Třída V</h4>
                <p className="text-sm text-muted-foreground">Ženatí/vdané - partner má třídu III</p>
              </div>
              <div className="border-l-4 border-gray-500 pl-4">
                <h4 className="font-semibold">Třída VI</h4>
                <p className="text-sm text-muted-foreground">Druhé zaměstnání</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jak si vybrat správnou třídu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Výběr daňové třídy ovlivňuje výši měsíčních srážek. Konečná výše daně se vyrovná při ročním daňovém přiznání.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Svobodní:</strong> Automaticky třída I (nebo II s dítětem)</li>
              <li><strong>Manželé s podobnými příjmy:</strong> Obě třída IV</li>
              <li><strong>Manželé s rozdílnými příjmy:</strong> Kombinace III/V</li>
              <li><strong>Druhé zaměstnání:</strong> Vždy třída VI</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxClasses;
