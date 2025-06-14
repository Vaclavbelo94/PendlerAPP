
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Plus, Calendar, AlertTriangle } from 'lucide-react';
import { format, differenceInDays, isBefore } from 'date-fns';
import { cs } from 'date-fns/locale';

interface InspectionCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ vehicleId, fullView = false }) => {
  const [inspections] = useState([
    {
      id: '1',
      type: 'STK',
      date: new Date('2024-09-15'),
      nextDue: new Date('2025-09-15'),
      status: 'Prošel',
      cost: 800,
      location: 'STK Praha 5'
    },
    {
      id: '2',
      type: 'Emise',
      date: new Date('2024-09-15'),
      nextDue: new Date('2025-09-15'),
      status: 'Prošel',
      cost: 400,
      location: 'STK Praha 5'
    }
  ]);

  const getStatusBadge = (nextDue: Date) => {
    const daysUntil = differenceInDays(nextDue, new Date());
    
    if (daysUntil < 0) {
      return <Badge variant="destructive">Prošlá</Badge>;
    } else if (daysUntil <= 30) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Brzy vyprší</Badge>;
    } else {
      return <Badge variant="outline" className="border-green-500 text-green-600">Platná</Badge>;
    }
  };

  if (!fullView) {
    const nextInspection = inspections.reduce((next, current) => 
      current.nextDue < next.nextDue ? current : next
    );
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            STK a Emise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Nejbližší STK:</span>
              {getStatusBadge(nextInspection.nextDue)}
            </div>
            <div className="text-sm">
              <p className="font-medium">{format(nextInspection.nextDue, 'dd.MM.yyyy', { locale: cs })}</p>
              <p className="text-muted-foreground">{nextInspection.type}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">STK a Emise</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Přidat kontrolu
        </Button>
      </div>

      <div className="grid gap-4">
        {inspections.map((inspection) => (
          <Card key={inspection.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{inspection.type}</h4>
                  <p className="text-sm text-muted-foreground">{inspection.location}</p>
                </div>
                {getStatusBadge(inspection.nextDue)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Provedeno:</span>
                  <p className="font-medium">{format(inspection.date, 'dd.MM.yyyy', { locale: cs })}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Další kontrola:</span>
                  <p className="font-medium">{format(inspection.nextDue, 'dd.MM.yyyy', { locale: cs })}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cena:</span>
                  <p className="font-medium">{inspection.cost} Kč</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Výsledek:</span>
                  <p className="font-medium">{inspection.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InspectionCard;
