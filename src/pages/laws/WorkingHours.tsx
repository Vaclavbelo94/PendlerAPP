
import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WorkingHours = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpět na Přehled zákonů
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-blue-100">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Pracovní doba v Německu</h1>
          <Badge variant="outline" className="mt-2">
            Aktualizováno: 10. května 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Zákon o pracovní době (ArbZG)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-600">Maximální pracovní doba</h4>
                <p className="text-sm text-muted-foreground">8 hodin denně (maximálně 10 hodin při kompenzaci)</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600">Týdenní limit</h4>
                <p className="text-sm text-muted-foreground">48 hodin v průměru za 6 měsíců</p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600">Denní odpočinek</h4>
                <p className="text-sm text-muted-foreground">Minimálně 11 hodin mezi směnami</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Přestávky a pauzy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Při práci 6-9 hodin</span>
                <span className="font-semibold">30 minut pauza</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Při práci nad 9 hodin</span>
                <span className="font-semibold">45 minut pauza</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nejdelší nepřerušená práce</span>
                <span className="font-semibold">6 hodin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Noční práce a směnnost</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Noční doba:</strong> 23:00 - 6:00 (nebo 22:00 - 5:00)</li>
              <li><strong>Noční směna:</strong> Více než 2 hodiny v noční době</li>
              <li><strong>Limit noční práce:</strong> 8 hodin (výjimečně 10 hodin)</li>
              <li><strong>Zdravotní prohlídky:</strong> Povinné pro noční pracovníky</li>
              <li><strong>Přeřazení:</strong> Právo na denní práci při zdravotních problémech</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nedělní a sváteční práce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Práce v neděli a o svátcích je obecně zakázána s výjimkami pro určitá odvětví:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Zdravotnictví a sociální služby</li>
                <li>Doprava a logistika</li>
                <li>Pohostinství a turistika</li>
                <li>Energetika a bezpečnost</li>
                <li>Zemědělství (sezónní práce)</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded-md mt-4">
                <p className="text-sm"><strong>Kompenzace:</strong> Za každou neděli práce nárok na volno v následujících 2 týdnech</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flexibilní pracovní doba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Gleitzeit (Klouzavá pracovní doba)</h4>
                <p className="text-sm text-muted-foreground">Volba začátku a konce v rámci stanových hranic</p>
              </div>
              <div>
                <h4 className="font-semibold">Homeoffice</h4>
                <p className="text-sm text-muted-foreground">Práce z domova podle dohody se zaměstnavatelem</p>
              </div>
              <div>
                <h4 className="font-semibold">Teilzeit (Částečný úvazek)</h4>
                <p className="text-sm text-muted-foreground">Právo na snížení pracovní doby (při splnění podmínek)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkingHours;
