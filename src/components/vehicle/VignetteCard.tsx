
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Plus, MapPin } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cs } from 'date-fns/locale';

interface VignetteCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const VignetteCard: React.FC<VignetteCardProps> = ({ vehicleId, fullView = false }) => {
  const [vignettes] = useState([
    {
      id: '1',
      country: 'Rakousko',
      type: 'Roční',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      cost: 96.40,
      currency: 'EUR'
    },
    {
      id: '2',
      country: 'Slovensko',
      type: 'Roční',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      cost: 50,
      currency: 'EUR'
    }
  ]);

  const getStatusBadge = (validTo: Date) => {
    const daysUntil = differenceInDays(validTo, new Date());
    
    if (daysUntil < 0) {
      return <Badge variant="destructive">Prošlá</Badge>;
    } else if (daysUntil <= 30) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Brzy vyprší</Badge>;
    } else {
      return <Badge variant="outline" className="border-green-500 text-green-600">Platná</Badge>;
    }
  };

  if (!fullView) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Dálniční známky
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold">{vignettes.length}</p>
              <p className="text-sm text-muted-foreground">Aktivní známky</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {vignettes.map((vignette) => (
                <Badge key={vignette.id} variant="outline" className="text-xs">
                  {vignette.country}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dálniční známky</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Přidat známku
        </Button>
      </div>

      <div className="grid gap-4">
        {vignettes.map((vignette) => (
          <Card key={vignette.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">{vignette.country}</h4>
                </div>
                {getStatusBadge(vignette.validTo)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Typ:</span>
                  <p className="font-medium">{vignette.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cena:</span>
                  <p className="font-medium">{vignette.cost} {vignette.currency}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Platnost od:</span>
                  <p className="font-medium">{format(vignette.validFrom, 'dd.MM.yyyy', { locale: cs })}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Platnost do:</span>
                  <p className="font-medium">{format(vignette.validTo, 'dd.MM.yyyy', { locale: cs })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VignetteCard;
