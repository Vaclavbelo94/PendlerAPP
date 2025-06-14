
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, MapPin, Edit, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cs } from 'date-fns/locale';
import { VignetteRecord } from '@/types/vehicle';

interface VignetteCardProps {
  vehicleId: string;
  fullView?: boolean;
  vignettes?: VignetteRecord[];
  onEdit?: (vignette: VignetteRecord) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const VignetteCard: React.FC<VignetteCardProps> = ({ 
  vehicleId, 
  fullView = false, 
  vignettes = [], 
  onEdit, 
  onDelete, 
  isLoading = false 
}) => {
  const getStatusBadge = (validTo: string) => {
    const validToDate = new Date(validTo);
    const daysUntil = differenceInDays(validToDate, new Date());
    
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

  if (vignettes.length === 0) {
    return (
      <div className="text-center py-8">
        <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Žádné dálniční známky</p>
        <p className="text-muted-foreground">Začněte přidáním první dálniční známky</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {vignettes.map((vignette) => (
        <Card key={vignette.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">{vignette.country}</h4>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(vignette.valid_until)}
                {onEdit && onDelete && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(vignette)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(vignette.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Typ:</span>
                <p className="font-medium">{vignette.vignette_type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cena:</span>
                <p className="font-medium">{vignette.cost}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Platnost od:</span>
                <p className="font-medium">{format(new Date(vignette.valid_from), 'dd.MM.yyyy', { locale: cs })}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Platnost do:</span>
                <p className="font-medium">{format(new Date(vignette.valid_until), 'dd.MM.yyyy', { locale: cs })}</p>
              </div>
              {vignette.purchase_location && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Místo nákupu:</span>
                  <p className="font-medium">{vignette.purchase_location}</p>
                </div>
              )}
              {vignette.notes && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Poznámky:</span>
                  <p className="font-medium">{vignette.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VignetteCard;
