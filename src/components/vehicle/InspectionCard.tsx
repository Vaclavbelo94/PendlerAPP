
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Calendar, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cs } from 'date-fns/locale';
import { InspectionRecord } from '@/types/vehicle';

interface InspectionCardProps {
  vehicleId: string;
  fullView?: boolean;
  inspections?: InspectionRecord[];
  onEdit?: (inspection: InspectionRecord) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ 
  vehicleId, 
  fullView = false, 
  inspections = [], 
  onEdit, 
  onDelete, 
  isLoading = false 
}) => {
  const getStatusBadge = (nextDue: string) => {
    const nextDueDate = new Date(nextDue);
    const daysUntil = differenceInDays(nextDueDate, new Date());
    
    if (daysUntil < 0) {
      return <Badge variant="destructive">Prošlá</Badge>;
    } else if (daysUntil <= 30) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Brzy vyprší</Badge>;
    } else {
      return <Badge variant="outline" className="border-green-500 text-green-600">Platná</Badge>;
    }
  };

  if (!fullView) {
    const nextInspection = inspections.length > 0 
      ? inspections.reduce((next, current) => 
          new Date(current.next_inspection_date) < new Date(next.next_inspection_date) ? current : next
        )
      : null;
    
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
            {nextInspection ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Nejbližší STK:</span>
                  {getStatusBadge(nextInspection.next_inspection_date)}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{format(new Date(nextInspection.next_inspection_date), 'dd.MM.yyyy', { locale: cs })}</p>
                  <p className="text-muted-foreground">{nextInspection.result}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Žádné záznamy STK kontrol</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (inspections.length === 0) {
    return (
      <div className="text-center py-8">
        <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Žádné STK kontroly</p>
        <p className="text-muted-foreground">Začněte přidáním první STK kontroly</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {inspections.map((inspection) => (
        <Card key={inspection.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">STK kontrola</h4>
                <p className="text-sm text-muted-foreground">{inspection.station}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(inspection.next_inspection_date)}
                {onEdit && onDelete && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(inspection)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(inspection.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Provedeno:</span>
                <p className="font-medium">{format(new Date(inspection.inspection_date), 'dd.MM.yyyy', { locale: cs })}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Další kontrola:</span>
                <p className="font-medium">{format(new Date(inspection.next_inspection_date), 'dd.MM.yyyy', { locale: cs })}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cena:</span>
                <p className="font-medium">{inspection.cost} Kč</p>
              </div>
              <div>
                <span className="text-muted-foreground">Výsledek:</span>
                <p className="font-medium">{inspection.result}</p>
              </div>
              {inspection.mileage && (
                <div>
                  <span className="text-muted-foreground">Stav km:</span>
                  <p className="font-medium">{inspection.mileage}</p>
                </div>
              )}
              {inspection.notes && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Poznámky:</span>
                  <p className="font-medium">{inspection.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InspectionCard;
