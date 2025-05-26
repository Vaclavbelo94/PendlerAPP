
import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HealthInsurance = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpět na Přehled zákonů
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-red-100">
          <Heart className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Zdravotní pojištění v Německu</h1>
          <Badge variant="outline" className="mt-2">
            Aktualizováno: 2. dubna 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Typy zdravotního pojištění</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600">Zákonné pojištění (GKV)</h4>
                <p className="text-sm text-muted-foreground">Povinné pro zaměstnance s příjmem do 69 300 € ročně (2024)</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600">Soukromé pojištění (PKV)</h4>
                <p className="text-sm text-muted-foreground">Volitelné pro vysoce příjmové skupiny a samostatně výdělečné</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Příspěvky na zdravotní pojištění</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Základní sazba</span>
                <span className="font-semibold">14,6%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Zaměstnanec platí</span>
                <span className="font-semibold">7,3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Zaměstnavatel platí</span>
                <span className="font-semibold">7,3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Dodatečný příspěvek (průměr)</span>
                <span className="font-semibold">1,7%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Co pokrývá zákonné pojištění</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Základní lékařská péče</li>
              <li>Hospitalizace</li>
              <li>Léky podle seznamu</li>
              <li>Preventivní prohlídky</li>
              <li>Zubní péče (základní)</li>
              <li>Nemocenská (od 7. dne)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthInsurance;
